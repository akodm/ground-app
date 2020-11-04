import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import config from '../client-config';

// page
import Main from '../page/Main';
import Profile from '../page/Profile';
import Category from '../page/Category';

// component or main dependency
import Login from './Login';
import Sidemenu from './Sidemenu';
import SidemenuSub from './SidemenuSub';

import Map from '../components/MapComponent';

export default function Base() {
    const [ open, setOpen ] = useState(false);      // side popup
    const [ login, setLogin ] = useState(false);    // login popup
    const [ user, setUser ] = useState(null);       // user state
    const [ mapArr, setMapArr ] = useState([]);
    const [ cateArr, setCateArr ] = useState([]);

    const [ load, setLoad ] = useState(false);

    useEffect(() => {
        async function mount() {
            await mapsGet();
            await cateMapGet();
            userLogin();
        }

        mount();
    }, []);

    async function mapsGet() {
        try {
            const result = await axios.get(`${config.server}/maps/all`);

            if(result.data[0]) {
                setMapArr(result.data);
            }
        } catch(err) {
            alert("로드 중 에러가 발생했습니다. 다시 시도해 주세요.");
            return;
        }
    }

    async function cateMapGet() {
        try {
            const result = await axios.get(`${config.server}/maps/all/category/init`);

            if(result.data[0]) {
                setCateArr(result.data);
            }
        } catch(err) {
            alert("로드 중 에러가 발생했습니다. 다시 시도해 주세요.");
            return;
        }
    }

    // reconnection login check or reload
    async function userLogin() {
        if(localStorage.getItem("ground_user")) {
            try {
                const localItem = JSON.parse(localStorage.getItem("ground_user"))
                let user = await axios.get(`${config.server}/verify/access`, {
                    headers : { "Authorization" : localItem.token }
                });

                if(!user.data || user.data === "expire") {
                    // 1. access token expire
                    // 2. refresh token search
                    // 3. new access token verify - set localstorage
                    // 4. if refresh expire => re login - remove localstorage

                    const newAccess = await axios.get(`${config.server}/verify/refresh?name=${localItem.name}`, {
                        headers : { "Authorization" : localItem.token }
                    });

                    if(!newAccess || !newAccess.data) { 
                        localStorage.removeItem("ground_user");
                        alert("로그인이 만료되었습니다. 다시 로그인 해주세요."); 
                        return; 
                    }

                    localStorage.setItem("ground_user", JSON.stringify(newAccess.data));
                    window.location.href = "/";
                    return;
                }

                const result = await axios.get(`${config.server}/users/one?id=${user.data.id}`);

                if(!result.data) {
                    alert("존재하지 않는 사용자입니다. 다시 확인해 주세요.");
                    localStorage.removeItem("ground_user");
                    return;
                }

                setUser({ 
                    id : result.data.id,
                    name : result.data.name,
                    gender : result.data.gender || null,
                    address : result.data.address || null,
                    open_add : result.data.open_add,
                });
            } catch(err) {
                alert("로그인 시도 중 에러가 발생했습니다. 다시 시도해 주세요.");
                localStorage.removeItem("ground_user");
            }
        }
        setLoad(true);
    }

    return (
        <Router>
            {/* side menu */}
            <Sidemenu user={user} open={open} setOpen={setOpen} setLogin={setLogin} />
            { open && <SidemenuSub open={open} setOpen={setOpen} id={user ? user.id : 0} setUser={setUser} /> }

            {/* login / insert */}
            { login && <Login setLogin={setLogin} />}

            {/* contents */}
            <Switch>
                {/* main page - first page */}
                <Route exact path="/" render={() => <Main user={user} />}  />

                {/* basic map */}
                <Route exact path="/map" 
                    render={(props) => load && 
                        <Map 
                            create={true}       // marker add func
                            search={true}       // place find func
                            setting={true}      // center set func
                            mapArr={mapArr}     // marker arr obj
                            user={user}         // user obj
                            {...props}          // r-r-d props
                        />
                    }  
                />

                {/* profile */}
                <Route exact path="/profile/:id" 
                    render={(props) => load && user ? 
                        <Profile 
                            user={user} 
                            {...props} 
                        /> 
                        : 
                        <Main 
                            user={user} 
                        />
                    }  
                />

                {/* custom map or category map */}
                <Route exact path="/map/:category" 
                    render={(props) => load && 
                        <Map 
                            create={true}       // marker add func
                            search={true}       // place find func
                            setting={true}      // center set func
                            user={user}         // user obj
                            {...props}          // r-r-d props
                        />
                    }  
                />

                <Route exact path="/Category" 
                    render={(props) => load &&
                        <Category 
                            user={user} 
                            mapArr={cateArr}
                            {...props}
                    />}
                />

                {/* url not found */}
                <Route render={() => <Main user={user} />} />
            </Switch>
        </Router>
    );
}