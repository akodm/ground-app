import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import config from '../client-config';

class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        const { google, loaded } = this.props;
        return loaded && (
            <div className="map">
                <Map
                    google={google}
                    zoom={17}
                    initialCenter={{ lat: 37.401815, lng: 126.922779}}
                />
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: config.apiKey,
    language : "ko",
})(MapComponent);