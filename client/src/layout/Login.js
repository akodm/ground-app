import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

function Login(props) {
    const { setLogin } = props;
    return (
        <div className="login">
            <div className="login-div">
                <div className="login-close"><CloseIcon style={{cursor: "pointer"}} onClick={() => setLogin(false)} /></div>

                
            </div>
        </div>
    );
}

export default Login;