import React, {Component} from 'react';
import './App.scss';
import axios from 'axios';
import Script from 'react-load-script';
import sun from "./assets/img/sun.svg";
const PLACES_KEY = process.env.REACT_APP_PLACES_API_KEY;
const OPEN_UV_KEY = process.env.REACT_APP_OPENUV_API_KEY;
const placesBaseUrl = `https://maps.googleapis.com/maps/api/js?key=${PLACES_KEY}&libraries=places`;
const uvApiBaseUrl = 'https://api.openuv.io/api/v1/uv?lat=';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            query: '',
            uvRisk: 0,
            report: ''
        };
    }
    handleScriptLoad = () => {
        const options = {
            types: ['(cities)'],
        };
        /* global google */
        this.autocomplete = new google.maps.places.Autocomplete(
            document.getElementById('autocomplete'),
            options,
        )
        this.autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
        this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
    }
    handlePlaceSelect = () => {
        let addressObject = this.autocomplete.getPlace();
        let address = addressObject.address_components;
        let today = new Date().toISOString();
        let geometry = addressObject.geometry.location;
        let lat = geometry.lat();
        let lng = geometry.lng();
        let uvApiUrl = uvApiBaseUrl + lat + '&lng=' + lng + '&dt=' + today;

        axios.get(uvApiUrl, {
            headers: {
                'x-access-token': OPEN_UV_KEY
            }
        })
        .then(response => {
            if (address) {
                this.setState(
                    {
                        city: address[0].long_name,
                        query: addressObject.formatted_address,
                        uvRisk: Math.round(response.data.result.uv),
                        report: 'show'
                    }
                )
            }
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }
    render() {
        return (
            <div id='appContainer' className={`risk-${this.state.uvRisk}`}>
                <img src={sun} className="sun-background quad" alt="sun" />
                <img src={sun} className="sun-background trip" alt="sun" />
                <img src={sun} className="sun-background dupe" alt="sun" />
                <img src={sun} className="sun-background" alt="sun" />
                <div id='inputMessageContainer'>
                    <h1 id='logo'>Burn Report</h1>
                    <Script
                        url={placesBaseUrl}
                        onLoad={this.handleScriptLoad}
                    />
                    <p id='instructions'>Enter your location</p>
                    <input id='autocomplete' placeholder='' defaultValue={this.state.query}></input>
                    <h1 id='riskMessage' className={this.state.report}>
                        Your UV risk for today is: {this.state.uvRisk}
                    </h1>
                </div>
            </div>
        )
    }
}

export default Search;
