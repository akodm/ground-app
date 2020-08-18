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
    const [ open, setOpen ] = useState(false);      // 사이드 팝업
    const [ login, setLogin ] = useState(false);    // 로그인 팝업
    const [ user, setUser ] = useState(null);       // 유저 상태

    useEffect(() => {
        userLogin();
    }, []);

    async function userLogin() {
        if(localStorage.getItem("ground_user")) {
            try {
                const user = await axios.get(`${config.server}/verify`, {
                    headers : { "Authorization" : localStorage.getItem("ground_user") }
                });

                if(user.data === "error" || !user.data) {
                    alert("로그인 시간이 만료되었습니다. 다시 로그인 해주세요.");
                    localStorage.removeItem("ground_user");
                    return;
                }

                const result = await axios.get(`${config.server}/users/one?id=${user.data.id}`);

                if(!result.data) {
                    alert("존재하지 않는 사용자입니다.");
                    localStorage.removeItem("ground_user");
                    return;
                }

                setUser(result.data);
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
            { open && <SidemenuSub open={open} setOpen={setOpen} id={user ? user.id : 0} /> }

            {/* login / insert */}
            { login && <Login setLogin={setLogin} />}

            {/* main contents */}
            <Switch>
                <Route exact path="/" render={() => <Main user={user} />}  />
                <Route exact path="/map" render={(props) => <Map {...props} />}  />

                {/* url not found */}
                <Route render={() => <Main user={user} />} />
            </Switch>
        </Router>
    );
}