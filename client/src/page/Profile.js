import React, { useState, useEffect } from 'react';
import axios from 'axios';

import config from '../client-config';

function Profile(props) {
    const user = props.user;

    const [ getUser, setGetUser ] = useState(null);

    const [ update, setUpdate] = useState(false);

    useEffect(() => {
        console.log("asd")
        async function userGet() {
            if(!props.match || !props.match.params || !props.match.params.id) {
                alert("잘못된 접근입니다.");
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

                setGetUser(result.data);
            } catch(err) {
                alert("유저 정보를 가져오는 중 에러가 발생했습니다.");
                window.location.href = "/";
                return;
            }
        }
        userGet();
    }, [props.match, update]);

    async function profileUpdate() {
        try {
            const result = await axios.put(`${config.server}/users/update`, {
                id : getUser.id
            });

            if(!result.data) {
                alert("업데이트가 정상적으로 처리되지 않았습니다. 다시 시도해 주세요.");
                window.location.href = props.match.url;
                return;
            }

            setUpdate(update ? false : true);
        } catch(err) {
            alert("업데이트 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = props.match.url;
            return;
        }
    }

    async function userFollow() {
        try {

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
                        <div className="profile-user-func" onClick={ userCheck ? profileUpdate : userFollow }>{ userCheck ? "업데이트" : "팔로우"}</div>
                    </div>
                    <div className="profile-text">
                        <div>성별 : { getUser.gender || "미정"}</div>
                        <div>주소 : { (getUser.openAdd === "no" ? "비공개" : getUser.address) || "미정"}</div>
                    </div>
                    <div className="profile-space">
                        <div>등록 장소 : { "13개"}</div>
                        <div>찜한 장소 : { "13개"}</div>
                        <div>가장 많은 등록 지역 : { "동안구"}</div>
                    </div>
                </div>
            </section>
            <div className="main-footer">문의사항 / a8456452@naver.com</div>
        </div>
    ) : <div></div>
}

export default Profile;