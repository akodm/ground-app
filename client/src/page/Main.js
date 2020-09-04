import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/Button';

function Main(props) {
    const { user } = props;
    return (
        <div className="main">
            <div className="main-title" onClick={() => window.location.href = "/"}>aaa</div>

            {/* contents section */}
            <section>
                <div className="main-top">
                    <img alt="map" src="/image/anayng.png"></img>

                    <div className="main-top-text-div">
                        <div className="main-top-text">경기도 안양시 지도</div>
                        <div className="main-top-text">특별한 카테고리별 장소 및 추천</div>
                        <Link to="/map"><Button text="지도 보기" style={{width: "250px"}} /></Link>
                        {
                            user && 
                            <Link to={`/profile/${user ? user.id : 0}`}><Button text="내 프로필" style={{width: "250px"}} /></Link>
                        }
                        <Link to="/category"><Button text="카테고리 보기" style={{width: "250px"}} /></Link>
                    </div>
                </div>
            </section>
            
            <div className="main-footer">문의사항 / a8456452@naver.com</div>
        </div>
    );
}

export default Main;