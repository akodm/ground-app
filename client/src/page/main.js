import React from 'react';
import { Link } from 'react-router-dom';

import Button from '../components/Button';

function Main(props) {
    const { user } = props;
    return (
        <div className="main">
            <div className="main-title" onClick={() => window.location.href = "/"}>aaa</div>

            {/* 컨텐츠 영역 */}
            <section>
                <div>
                    <Link to="/map"><Button text="지도 보기" /></Link>
                    {
                        user &&
                        <Link to={`/profile/${user.id}`}><Button text="내 프로필" /></Link>
                    }
                </div>









            </section>

            <div className="main-footer">문의사항 / a8456452@naver.com</div>
        </div>
    );
}

export default Main;