import React from 'react';

function Sidemenu(props) {
    const { open, setOpen, user, setLogin } = props;

    return (
        <div className={`sidemenu ${open && "sidemenu-none"}`}>

            { !user && <div className="sidemenu-login">로그인이 필요합니다! <br></br> 로그인 및 회원가입</div> }

            <img alt="menu" src="image/menu.png" onClick={() => {
                user ? setOpen(true) : setLogin(true)
            }}></img>
        </div>
    );
}

export default Sidemenu;