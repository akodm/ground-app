import React, { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import FindList from './FindList';

import config from '../client-config';

function FindPopup(props) {
    const { setFindOpen, lat, lng, setLoadMask, setCurrentLat, setCurrentLng, setOpen } = props;
    const [ title, setTitle ] = useState("");
    const [ findData, setFindData ] = useState(null);

    async function searchPlace() {
        if(!title) {
            alert("이름이 비어있습니다.");
            return;
        }
        
        setLoadMask(true);
        try {
            const result = await axios.get(`${config.server}/maps/place/find?title=${title}&lat=${lat}&lng=${lng}`);

            if(!result.data) {
                alert("해당하는 장소가 없습니다.");
                setLoadMask(false);
                setFindOpen(false)
                return;
            }

            setFindData(result.data.results);
        } catch(err) {
            alert("장소 검색 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = "/map";
            return;
        }
        setLoadMask(false);
    }

    return !findData ? (
        <div className="markerpopup">
            <div className="markerpopup-overlay" onClick={() => setFindOpen(false)}></div>
            <div className="findpopup-content" onKeyUp={function(e) {
                    if(e.keyCode === 13) { searchPlace(); }
                }}>
                <div><CloseIcon style={{ cursor:"pointer" }} onClick={() => setFindOpen(false)} /></div>
                <div className="markerpopup-title">장소 검색</div>
                <pre className="markerpopup-guide">현재 센터는 {lat + ", " + lng}</pre>
                
                {/* title input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        label="장소 이름 입력"
                        helperText="찾고자 하는 장소의 실제 이름을 입력해주세요."
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* search btn */}
                <div className="markerpopup-btn">
                    <Button onClick={searchPlace} variant="outlined" color="primary" style={{ width:"150px", height:"45px" }}>검색하기</Button>
                </div>
            </div>
        </div>
    ) : <FindList setCurrentLat={setCurrentLat} setCurrentLng={setCurrentLng} setOpen={setOpen} setFindOpen={setFindOpen} findData={findData} />
}

export default FindPopup;