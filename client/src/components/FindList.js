import React from 'react';
import CloseIcon from '@material-ui/icons/Close';

import Item from './FindListItem';

function FindList(props) {
    const { findData, setFindOpen, setCurrentLat, setCurrentLng, setOpen } = props;
    console.log(findData);

    return (
        <div className="markerpopup">
            <div className="markerpopup-overlay" onClick={() => setFindOpen(false)}></div>
            <div className="findlist-content">
                <div><CloseIcon style={{ cursor:"pointer" }} onClick={() => setFindOpen(false)}/></div>
                <div className="markerpopup-title">장소 검색 결과</div>
                <pre className="markerpopup-guide">현재 지도 위치에서 최대 20개까지 결과목록</pre>
                {
                    findData[0] ? findData.map((data, index) => {
                        return <Item 
                            key={index}
                            setCurrentLat={setCurrentLat} 
                            setCurrentLng={setCurrentLng} 
                            setOpen={setOpen} 
                            setFindOpen={setFindOpen}
                            data={data} 
                        />
                    })
                    :
                    <div className="findlist-null">해당하는 장소가 없습니다.</div>
                }
            </div>
        </div>
    );
}

export default FindList;