import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoadMask from '../components/LoadMask';
import AddMarker from '../components/AddMarker';
import MarkerPopup from '../components/MarkerPopup';
import FindPlace from '../components/FindPlace';
import FindPopup from '../components/FindPopup';
import CenterSet from './CenterSet';

import config from '../client-config';

function MapComponent(props) {
    const user = props.user;
    const create = props.create;
    const search = props.search;
    const setting = props.setting;

    const user_center = localStorage.getItem("ground_center") ? 
        JSON.parse(localStorage.getItem("ground_center")) 
        : 
        { lat : 37.4011892, lng : 126.9222421 };

    const [ open, setOpen ] = useState(false);
    const [ findOpen, setFindOpen ] = useState(false);

    const [ loadMask, setLoadMask ] = useState(false);

    const [ currentLat, setCurrentLat ] = useState(0);
    const [ currentLng, setCurrentLng ] = useState(0);
    
    const [ centerLat, setCenterLat ] = useState(user_center.lat);
    const [ centerLng, setCenterLng ] = useState(user_center.lng);

    const [ placeArr, setPlaceArr ] = useState(props.mapArr);

    useEffect(() => {
        async function init() {
            try {
                // map init
                let map = new window.google.maps.Map(document.getElementById("map"), {
                    center: { lat: centerLat, lng: centerLng },
                    zoom: 16,
                });

                // map drag end event
                map.addListener('dragend', function() {
                    setCenterLat(map.center.lat());
                    setCenterLng(map.center.lng());
                });

                let markers = [];
                let infowindows = [];

                // marker display
                placeArr.forEach((value, index) => {
                    markers.push(new window.google.maps.Marker({
                        position: { lat: value.lat, lng: value.lng },
                        map: map,
                        id : index,
                        title: value.title,
                        cate: value.cate,
                        content: value.content,
                        animation: window.google.maps.Animation.DROP,
                    }));

                    // marker infowindow set
                    infowindows.push(new window.google.maps.InfoWindow({
                        content: `<div class="marker-div">
                            <span class="marker-cate">${markers[index].cate}</span>
                            <span class="marker-content">${markers[index].content}</span>
                            <span class="marker-title">${markers[index].title}</span>
                        </div>`
                    }));

                    // marker click event set
                    markers[index].addListener('click', function(e) {
                        infowindows[index].open(map, markers[index]);
                        markerClick(markers[index]);
                    });
                });

                // 9 seconds after -> infowindow display
                setTimeout(() => {
                    for(let index = 0; index < infowindows.length; index++) {
                        infowindows[index].open(map, markers[index]);
                    }
                }, 900);

                // map click event
                const clickMarker = [];
                map.addListener('click', function(e) {
                    setCurrentLat(e.latLng.lat());
                    setCurrentLng(e.latLng.lng());

                    if(clickMarker[0]) {
                        const getClickMarker = clickMarker.pop();
                        getClickMarker.setMap(null);
                    }

                    // here marker
                    clickMarker.push(new window.google.maps.Marker({
                        position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                        map: map,
                    }));
                });
            } catch(err) {
                alert("비정상적인 접근입니다.");
                window.location.href = "/";
                return;
            }
        }
        init();
    }, [placeArr]);

    async function markerClick(marker) {
        setLoadMask(true);
        try {
            const result = await axios.get(`${config.server}/maps/place?title=${marker.title}&cate=${marker.cate}&lat=${marker.position.lat()}&lng=${marker.position.lng()}`);
            
            if(result.data && result.data.url) {
                window.open(result.data.url);
                setLoadMask(false);
                return;
            }

            if(!result.data || !result.data.candidates[0] || !result.data.candidates[0].place_id) {
                alert("장소에 대한 상세 정보가 없습니다.");
                setLoadMask(false);
                return;
            }

            const place_result = await axios.get(`${config.server}/maps/place/detail?place_id=${result.data.candidates[0].place_id}&title=${marker.title}&cate=${marker.cate}&lat=${marker.position.lat()}&lng=${marker.position.lng()}`);

            if(!place_result.data) {
                alert("실제 장소와 너무 멀리 떨어졌거나, 장소 이름이 실제 이름과 달라 상세정보 조회가 불가합니다.");
                setLoadMask(false);
                return;
            }
            
            window.open(place_result.data.result.url);
        } catch(err) {
            alert("잘못된 장소입니다. 다시 시도해 주세요.");
        }
        setLoadMask(false);
        return;
    }

    return (
        <>
            <LoadMask load={loadMask} />
            <div id="map" style={{width:"100%", height:"100vh"}} />
            {
                open && <MarkerPopup user={user} placeArr={placeArr} setPlaceArr={setPlaceArr} lat={currentLat} lng={currentLng} setOpen={setOpen} />
            }
            {
                findOpen && <FindPopup setCurrentLat={setCurrentLat} setCurrentLng={setCurrentLng} setLoadMask={setLoadMask} setOpen={setOpen} setFindOpen={setFindOpen} lat={centerLat} lng={centerLng} />
            }
            {
                user && search ? <FindPlace setFindOpen={setFindOpen} lat={centerLat} lng={centerLng} text="장소 검색" /> : <div></div>
            }
            {
                user && create ? <AddMarker lat={currentLat} lng={currentLng} setOpen={setOpen} text="장소 추가" guide="위치를 선택하고 추가 버튼을 눌러보세요!" /> : <div></div>
            }
            {
                user && setting ? <CenterSet centerLat={centerLat} centerLng={centerLng} text={"센터 설정"} /> : <div></div>
            }
        </>
    );
}

export default MapComponent;