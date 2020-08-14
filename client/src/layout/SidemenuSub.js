import React from 'react';
import { Link } from 'react-router-dom';

function SidemenuSub(props) {
    const { setOpen } = props;
    return (
        <div className="sidemenu-sub">
            <div className="sidemenu-sub-overlay" onClick={() => setOpen(false)}></div>
            <div className="sidemenu-sub-menu">
                <a href="/"><img alt="menu" src="/image/home.png"></img></a>
                <Link to="/map" onClick={() => setOpen(false)}><img alt="menu" src="/image/map.png"></img></Link>
                <Link to="/profile" onClick={() => setOpen(false)}><img alt="menu" src="/image/profile.png"></img></Link>
            </div>
        </div>
    );
}

export default SidemenuSub;