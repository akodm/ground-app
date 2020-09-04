import React from 'react';

function addMarker(props) {
    const { setOpen, lat, lng } = props;

    let latLngValue = false;
    if(lat && lng) { latLngValue = true; }

    return (
        <div className="addmarker" onClick={() => latLngValue ? setOpen(true) : alert("선택한 장소가 없습니다.")}>
            <span>{props.guide}</span>
            <div>{props.text}</div>
        </div>
    );
}

export default addMarker;