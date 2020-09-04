import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function MarkerPopup(props) {
    const { setOpen, lat, lng } = props;

    async function addMarker() {
        try {
            console.log("add markers");
        } catch(err) {
            alert("등록 중 에러가 발생했습니다. 다시 시도해 주세요.");
            window.location.href = "/map";
        }
    }

    return (
        <div className="markerpopup">
            <div className="markerpopup-overlay" onClick={() => setOpen(false)}></div>
            <div className="markerpopup-content">
                <div><CloseIcon style={{ cursor:"pointer" }} onClick={() => setOpen(false)} /></div>
                <div className="markerpopup-title">장소 추가</div>
                <pre className="markerpopup-guide">현재 이곳은 {lat + ", " + lng}</pre>
                
                {/* title input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        label="이곳의 이름이 무엇인가요?"
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* content input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        label="이곳을 간단하게 소개해주세요"
                        variant="outlined"
                        size="small"
                        style={{ width:"100%" }}
                    />
                </div>

                {/* cate input */}
                <div className="markerpopup-input">
                    <TextField
                        required
                        label="이곳의 태그를 정해주세요"
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