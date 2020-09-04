import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import config from '../client-config';

import Main from '../page/Main';
import Map from '../page/MapComponent';

import Login from './Login';
import Sidemenu from './Sidemenu';
import SidemenuSub from './SidemenuSub';

export default function Base() {
    const [ open, setOpen ] = useState(false);      // side popup
    const [ login, setLogin ] = useState(false);    // login popup
    const [ user, setUser ] = useState(null);       // user state
    const [ mapArr, setMapArr ] = useState([]);

    useEffect(() => {
        mapsGet();
        userLogin();
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

                setUser({ id : result.data.id, name : result.data.name });
            } catch(err) {
                alert("로그인 시도 중 에러가 발생했습니다. 다시 시도해 주세요.");
                localStorage.removeItem("ground_user");
            }
        }
    }

    return (
        <Router>
            {/* side menu */}
            <Sidemenu user={user} open={open} setOpen={setOpen} setLogin={setLogin} />
            { open && <SidemenuSub open={open} setOpen={setOpen} id={user ? user.id : 0} setUser={setUser} /> }

            {/* login / insert */}
            { login && <Login setLogin={setLogin} />}

            {/* main contents */}
            <Switch>
                <Route exact path="/" render={() => <Main user={user} />}  />
                <Route exact path="/map" render={(props) => mapArr[0] ? <Map mapArr={mapArr} {...props} /> : <div></div>}  />

                {/* url not found */}
                <Route render={() => <Main user={user} />} />
            </Switch>
        </Router>
    );
}