import React from 'react';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';

function FollowList(props) {
    const { setListOpen, data } = props;

    return (
        <div className="markerpopup">
            <div className="markerpopup-overlay" onClick={() => setListOpen(false)}></div>
            <div className="followlist-content">
                <div><CloseIcon style={{ cursor:"pointer" }} onClick={() => setListOpen(false)} /></div>
                <div className="markerpopup-title followlist-title">팔로우 리스트</div>
                {
                    data.map((data, index) => {
                        return <Link onClick={() => setListOpen(false)} key={index} to={`/profile/${data.target_info.id}`}> 
                            <div className="followlist-list">
                                <span>닉네임 : {data.target_info.name}</span>
                                <span>성별 : {data.target_info.gender}</span>
                                <span>주소 : {data.target_info.address}</span>
                            </div>
                        </Link>
                    })
                }
            </div>
        </div>
    );
}

export default FollowList;