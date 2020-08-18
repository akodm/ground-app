import React, { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import config from '../client-config';
import TextField from '../components/TextField';

function Login(props) {
    const [ toggle, setToggle ] = useState(false);

    const [ name, setName ] = useState(""); 
    const [ pass, setPass ] = useState("");

    const { setLogin } = props;

    const insertClick = async() => {
        const valid = validate();
        if(!valid) return;

        try {
            const confirm = await axios.get(`${config.server}/users/one/name?name=${name}`);

            if(confirm.data) {
                alert("존재하는 닉네임입니다. 다른 닉네임을 사용해주세요.");
                return;
            }

            const result = await axios.post(`${config.server}/users/create`, {
                name,
                pass
            });

            if(result.data) {
                alert("가입되었습니다.");
            } else {
                alert("가입 중 에러가 발생했습니다. 다시 시도해주세요.");
            }

            setLogin(false);
        } catch(err) {
            alert("에러가 발생했습니다. 다시 시도해 주세요.");
        }
    }
    
    const login = async() => {
        const valid = validate();
        if(!valid) return;

        try {

        } catch(err) {
            alert("로그인 시도 중 에러가 발생했습니다. 다시 시도해 주세요.");
        }
    }

    function validate() {
        if(!name || !pass) {
            alert("없는 내용이 있습니다. 내용을 모두 입력해주세요.");
            return false;
        }
    
        if(/\s+/.test(name) || /\s+/.test(pass)) {
            setName(""); setPass("");
            alert("띄어쓰기를 빼고 입력해주세요.");
            return false;
        }
        return true;
    }

    return (
        <div className="login">
            <div className="login-div">
                <div className="login-close"><CloseIcon style={{cursor: "pointer"}} onClick={() => setLogin(false)} /></div>

                <div className="login-title">로그인 및 회원가입</div>
                
                <form>
                    <TextField
                        value={name}
                        type="text" 
                        placeholder="닉네임 8자 내"
                        maxLength={8}
                        onChange={(e) => setName(e)}
                    />
                    <TextField
                        value={pass}
                        type="password" 
                        placeholder="비밀번호 12자 내"
                        maxLength={12}
                        onChange={(e) => setPass(e)}
                    />
                </form>
                <div className="login-btn"><Button onClick={() => !toggle ? insertClick() : login()} style={{width:"220px"}} variant="outlined" color="primary">{ toggle ? "로그인" : "가입하기" }</Button></div>

                <div className="login-footer" onClick={() => !toggle ? setToggle(true) : setToggle(false)}>이미 가입되어 있으신가요?</div>
            </div>
        </div>
    );
}

export default Login;