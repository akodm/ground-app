import React, { useState, useEffect } from 'react';

import './App.css';
import './css/Base.css';
import './css/Sidemenu.css';
import './css/Main.css';
import './css/Map.css';
import './css/Button.css';
import './css/Login.css';
import './css/Textfield.css';
import './css/AddMarker.css';
import './css/MarkerPopup.css';
import './css/LoadMask.css';

import Base from './layout/Base';

export default function App() {
    const [ maps, setMaps ] = useState(null);

    useEffect(() => {
        if(maps) { return () => clearInterval(interval); }
        const interval = setInterval(() => {
            initMap();
        }, 100);

        return () => clearInterval(interval);
    }, [maps]);

    function initMap() {
        const loadMap = window.google || false;

        if(loadMap) { setMaps(window.google); }
    }

    return maps ? (
        <Base />
    ) : <div></div>
}