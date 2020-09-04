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

    const [ placeArr, setPlaceArr ] = useState(props.mapArr);

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
                setCurrentLng(e.latLng.lng());

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
                alert("실제 장소와 너무 멀리 떨어졌거나, 장소 이름이 실제 이름과 달라 상세정보 조회가 불가합니다..");
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
                open && <MarkerPopup placeArr={placeArr} setPlaceArr={setPlaceArr} lat={currentLat} lng={currentLng} setOpen={setOpen} />
            }
            <AddMarker lat={currentLat} lng={currentLng} setOpen={setOpen} text="장소 추가" guide="위치를 선택하고 추가 버튼을 눌러보세요!" />
        </>
    );
}

export default MapComponent;