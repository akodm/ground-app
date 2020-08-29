import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import config from '../client-config';

function SidemenuSub(props) {
    const { setOpen, id, setUser } = props;

    const logout = async() => {
        try {
            await axios.get(`${config.server}/logout?id=${id}`);

            setUser(null);
            localStorage.removeItem("ground_user");

            alert("로그아웃 되었습니다.");
            window.location.href = "/";
        } catch(err) {
            alert("로그아웃 시도 중 에러가 발생했습니다.");
        };
    }

    return (
        <div className="sidemenu-sub">
            <div className="sidemenu-sub-overlay" onClick={() => setOpen(false)}></div>
            <div className="sidemenu-sub-menu">
                <a href="/"><div className="sidemenu-sub-item">홈</div></a>
                <Link to="/map" onClick={() => setOpen(false)}><div className="sidemenu-sub-item">지도</div></Link>
                <Link to={`/profile/${id}`} onClick={() => setOpen(false)}><div className="sidemenu-sub-item">프로필</div></Link>
                <div onClick={logout} className="sidemenu-sub-item">로그아웃</div>
            </div>
        </div>
    );
}

export default SidemenuSub;