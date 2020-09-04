import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LoadMask from '../components/LoadMask';
import AddMarker from '../components/AddMarker';
import MarkerPopup from '../components/MarkerPopup';

import config from '../client-config';

function MapComponent(props) {
    const [ open, setOpen ] = useState(false);
    const [ loadMask, setLoadMask ] = useState(false);
    const [ currentLat, setCurrentLat ] = useState(0);
    const [ currentLng, setCurrentLng ] = useState(0);

    const [ placeArr, setPlaceArr ] = useState([
        { title : "대림대학교", cate : "학교", content : "안양역 근처 대학교", lat : 37.403627, lng : 126.9303408 },
        { title : "안양역", cate : "지하철역", content : "1호선 급행이 들렀다 가는 곳", lat : 37.4026842, lng : 126.9220501 },
        { title : "엔터식스 안양점", cate : "백화점", content : "층마다 구경거리가 있는", lat : 37.4016455, lng : 126.9229027 },
    ]);

    useEffect(() => {
        function init() {
            let map = new window.google.maps.Map(document.getElementById("map"), {
                center: { lat: 37.4011892, lng: 126.9222421 },
                zoom: 16,
            });

            let markers = [];
            let infowindows = [];

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

                infowindows.push(new window.google.maps.InfoWindow({
                    content: `<div class="marker-div">
                        <span class="marker-cate">${markers[index].cate}</span>
                        <span class="marker-content">${markers[index].content}</span>
                        <span class="marker-title">${markers[index].title}</span>
                    </div>`
                }));

                markers[index].addListener('click', function(e) {
                    infowindows[index].open(map, markers[index]);
                    markerClick(markers[index]);
                });
            });

            setTimeout(() => {
                for(let index = 0; index < infowindows.length; index++) {
                    infowindows[index].open(map, markers[index]);
                }
            }, 900);

            const clickMarker = [];
            map.addListener('click', function(e) {
                setCurrentLat(e.latLng.lat());
                setCurrentLng(e.latLng.lat());

                if(clickMarker[0]) {
                    const getClickMarker = clickMarker.pop();
                    getClickMarker.setMap(null);
                }

                clickMarker.push(new window.google.maps.Marker({
                    position: { lat: e.latLng.lat(), lng: e.latLng.lng() },
                    map: map,
                }));
            });
        }
        init();
    }, [placeArr]);

    async function markerClick(marker) {
        setLoadMask(true);
        try {
            const result = await axios.get(`${config.server}/maps/place?title=${marker.title}&lat=${marker.position.lat()}&lng=${marker.position.lng()}`);
            
            if(result.data && result.data.url) {
                window.open(result.data.url);
                setLoadMask(false);
                return;
            }

            if(!result.data || !result.data.candidates[0] || !result.data.candidates[0].place_id) {
                alert("장소에 대한 상세 정보가 없습니다.");
                return;
            }

            const place_result = await axios.get(`${config.server}/maps/place/detail?place_id=${result.data.candidates[0].place_id}`);

            if(!place_result.data || !place_result.data.result.url) {
                alert("장소에 대한 상세 정보가 없습니다.");
                return;
            }
            
            window.open(place_result.data.result.url);
            setLoadMask(false);
        } catch(err) {
            alert("잘못된 장소인 것 같습니다. 다시 시도해 주세요.");
        }
    }

    return (
        <>
            <LoadMask load={loadMask} />
            <div id="map" style={{width:"100%", height:"100vh"}} />
            {
                open && <MarkerPopup lat={currentLat} lng={currentLng} setOpen={setOpen} />
            }
            <AddMarker lat={currentLat} lng={currentLng} setOpen={setOpen} text="장소 추가" guide="위치를 선택하고 추가 버튼을 눌러보세요!" />
        </>
    );
}

export default MapComponent;