import React from 'react';
import Rating from '@material-ui/lab/Rating';

/**
 * geometry.location.lat
    icon
    name
    rating
    types (arr)
    vicinity
 */

function FindListItem(props) {
    const { data, setFindOpen, setCurrentLat, setCurrentLng, setOpen } = props;

    function addMap() {
        if(!data.geometry && !data.geometry.location) {
            alert("해당 장소에 대한 정확한 위치 정보가 없습니다.");
            return;
        }

        setCurrentLat(data.geometry.location.lat);
        setCurrentLng(data.geometry.location.lng);
        setFindOpen(false);
        setOpen(true);
    }

    return (
        <div className="findlist-item">
            <div className="findlist-add-btn" onClick={addMap}>추가</div>
            {
                data.icon ?
                <img className="findlist-img" src={data.icon} alt="icon"></img>
                :
                <div>이미지 없음</div>
            }
            <div>{data.name || "이름 없음"}</div>
            <div>{data.vicinity || "알수 없음"}</div>
            <div><Rating name="read-only" value={data.rating || 0} readOnly /></div>
        </div>
    );
}

export default FindListItem;