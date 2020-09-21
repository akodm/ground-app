import React from 'react';

function CenterSet(props) {
    const { centerLat, centerLng } = props;

    function setCenter() {
        const result = window.confirm("현재 시점을 기본으로 설정 하시겠습니까?");
        if(result) {
            const user_center = {
                lat : centerLat,
                lng : centerLng,
            }

            localStorage.setItem("ground_center", JSON.stringify(user_center));
        }
    }

    return (
        <div className="addmarker centerset" onClick={setCenter}>
            <div>{props.text}</div>
        </div>
    );
}

export default CenterSet;