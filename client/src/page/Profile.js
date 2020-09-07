import React, { useState, useEffect } from 'react';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';

import config from '../client-config';

function Profile(props) {
    const user = props.user;

    const [ getUser, setGetUser ] = useState(null);
    const [ maps, setMaps ] = useState(0);
    const [ follow, setFollow ] = useState(null);
    const [ followCount, setFollowCount ] = useState(0);

    const [ update, setUpdate] = useState(false);

    const [ addToggle, setAddToggle ] = useState(false);
    const [ genderText, setGenderText ] = useState("");
    const [ addText, setAddText ] = useState("");

    useEffect(() => {
        async function userGet() {
            if(!props.match || !props.match.params || !props.match.params.id) {
                alert("잘못된 접근입니다.");
                window.location.href = "/";
                return;
            }

            if(!user) { 
                alert("로그인 후 이용바랍니다.");
                window.location.href = "/";
                return;
            }

            const id = props.match.params.id;
            try {
                const result = await axios.get(`${config.server}/users/one/attr?id=${id}`);

                if(!result.data) {
                    alert("해당하는 유저가 없습니다.");
                    window.location.href = "/";
                    return;
                }

                let followCount = axios.get(`${config.server}/follows/all/target?target_id=${result.data.id}`);
                let follow = axios.get(`${config.server}/follows/one?user_id=${user.id}&target_id=${result.data.id}`);
                let mapCount = axios.get(`${config.server}/maps/all/user?user_id=${result.data.id}`);

                await Promise.all([followCount, follow, mapCount]).then(value => {
                    setFollowCount(value[0].data.length);
                    setFollow(value[1].data);
                    setMaps(value[2].data.length);
                });
                
                setGetUser(result.data);
                setAddToggle(result.data.open_add);
                setGenderText(result.data.gender || "미정");
                setAddText(result.data.address || "미정");
            } catch(err) {
                alert("유저 정보를 가져오는 중 에러가 발생했습니다.");
                window.location.href = "/";
                return;
            }
        }
        userGet();
    }, [props.match, update, user]);

    async function profileUpdate() {
        if(!addText || !genderText) {
            alert("없는 내용이 있습니다. 내용을 작성해 주세요.");
            return;
        }
        
        try {
            const result = await axios.put(`${config.server}/users/update`, {
                id : getUser.id,
                gender : genderText,
                address : addText,
                open_add : addToggle
            });

            if(!result.data) {
                alert("업데이트가 정상적으로 처리되지 않았습니다. 다시 시도해 주세요.");
                window.location.href = props.match.url;
                return;
            }

            alert("업데이트가 적용되었습니다.");
            setUpdate(update ? false : true);
        } catch(err) {
            alert("업데이트 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = props.match.url;
            return;
        }
    }

    async function userFollow() {
        try {
            if(!follow) {
                await axios.post(`${config.server}/follows/create`, {
                    user_info : user,
                    target_info : getUser,
                    user_id : user.id,
                    target_id : getUser.id,
                });
                alert("팔로우 합니다.");
            } else {
                await axios.delete(`${config.server}/follows/delete?id=${follow.id}`);
                alert("팔로우를 취소합니다.");
            }
            setUpdate(update ? false : true);
        } catch(err) {
            alert("팔로우 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = props.match.url;
            return;
        }
    }

    const userCheck = props.match.params.id === (user.id + "");

    return getUser ? (
        <div className="profile">
            <div className="profile-title" onClick={() => window.location.href = "/"}>안양 동네</div>
            
            <section className="profile-section">

                {/* profile box */}
                <div className="profile-box">
                    <div className="profile-text">
                        <div>닉네임 : { getUser.name }</div>
                        <div className="profile-user-func" onClick={ userCheck ? profileUpdate : userFollow }>{ userCheck ? "업데이트 적용" : (follow ? "팔로우 취소" : "팔로우")}</div>
                    </div>
                    <div className="profile-text">
                        <div>
                            성별 :&nbsp;
                            {
                                userCheck ?
                                <select className="profile-select" value={genderText} onChange={(e) => setGenderText(e.target.value)}>
                                    <option value="미정">미정</option>
                                    <option value="남자">남자</option>
                                    <option value="여자">여자</option>
                                </select>
                                :
                                getUser.gender || "미정"
                            }
                        </div>
                        <div>
                            주소 : { userCheck ? <input type="text" value={addText} onChange={(e) => setAddText(e.target.value)} className="profile-update-input"></input> : (!getUser.open_add ? "비공개" : (getUser.address || "미정"))}
                            {
                                userCheck &&
                                <div>
                                    공개설정 : 
                                    <Switch
                                        checked={addToggle}
                                        onChange={(e) => setAddToggle(e.currentTarget.checked)}
                                        color="primary"
                                        name="addToggle"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </div>
                            }

                        </div>
                    </div>
                    <div className="profile-space">
                        <div>등록 장소 : {maps + "개"}</div>
                        <div>팔로우 받은 유저 수 : {followCount + "명"}</div>
                    </div>
                </div>
            </section>
            <div className="main-footer">문의사항 / a8456452@naver.com</div>
        </div>
    ) : <div></div>
}

export default Profile;