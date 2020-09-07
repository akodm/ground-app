import React, { useState } from 'react';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import config from '../client-config';

function MarkerPopup(props) {
    const { setOpen, lat, lng, placeArr, setPlaceArr, user } = props;

    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");
    const [ cate, setCate ] = useState("");

    async function addMarker() {
        if(!title || !content || !cate || !lat || !lng) {
            alert("값이 없거나 잘못되었습니다. 다시 시도해 주세요.");
            return;
        }

        try {
            const result = await axios.post(`${config.server}/maps/create`, {
                title, content, cate, lat, lng, user_id : user.id
            });

            const { data } = result.data;

            if(!result.data && !data) {
                alert("추가되지 않았습니다. 잠시 후 다시 시도해 주세요.");
                return;
            }

            if(!result.data.result) {
                alert("이미 같은 내용으로 등록된 장소입니다.");
                return;
            }

            setPlaceArr(placeArr.concat({
                title : data.title,
                content : data.content,
                cate : data.cate,
                lat : parseFloat(data.lat),
                lng : parseFloat(data.lng),
            }));
            
            alert("새로운 장소를 등록하였습니다.");
            setOpen(false);
        } catch(err) {
            alert("등록 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = "/map";
        }
    }

    return (
        <div className="markerpopup">
            <div className="markerpopup-overlay" onClick={() => setOpen(false)}></div>
            <div className="markerpopup-content" onKeyUp={function(e) {
                    if(e.keyCode === 13) { addMarker() }
                }}>
                <div><CloseIcon style={{ cursor:"pointer" }} onClick={() => setOpen(false)} /></div>
                <div className="markerpopup-title">장소 추가</div>
                <pre className="markerpopup-guide">현재 이곳은 {lat + ", " + lng}</pre>
                
                {/* title input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        label="이곳의 이름이 무엇인가요?"
                        helperText="실제와 같아야 상세 정보를 볼 수 있습니다!"
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* content input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        label="이곳을 간단하게 소개해주세요."
                        helperText="특징같은 것도 좋습니다."
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* cate input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        value={cate}
                        onChange={(e) => setCate(e.target.value)}
                        label="이곳의 태그를 정해주세요."
                        helperText="예) 카페, 식당, 지하철역"
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* add btn */}
                <div className="markerpopup-btn">
                    <Button onClick={addMarker} variant="outlined" color="primary" style={{ width:"150px", height:"45px" }}>등록하기</Button>
                </div>
            </div>
        </div>
    );
}

export default MarkerPopup;