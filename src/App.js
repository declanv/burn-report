import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Script from 'react-load-script';
const PLACES_KEY = process.env.REACT_APP_PLACES_API_KEY;
const OPEN_UV_KEY = process.env.REACT_APP_OPENUV_API_KEY;
// const placesBaseUrl = `https://maps.googleapis.com/maps/api/js?key=${PLACES_KEY}&libraries=places`;
const placesBaseUrl = `https://maps.googleapis.com/maps/api/js?key=${PLACES_KEY}&libraries=places`;
const uvApiBaseUrl = 'https://api.openuv.io/api/v1/uv?lat=';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            city: '',
            query: ''
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

        debugger;

        if (address) {
            this.setState(
                {
                    city: address[0].long_name,
                    query: addressObject.formatted_address,
                    // geometry: addressObject.geometry,
                }
            )
        }
        axios.get(uvApiUrl, {
            headers: {
                'x-access-token': OPEN_UV_KEY
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }
    render() {
        return (
            <div>
                <Script
                    url={placesBaseUrl}
                    onLoad={this.handleScriptLoad}
                />
                <input id='autocomplete' placeholder='' defaultValue={this.state.query}></input>
            </div>
        )
    }
}



// class PlacesInput extends React.Component
// {
//     handlePlaceSelect = () => {
//
//         // Extract City From Address Object
//         const addressObject = this.autocomplete.getPlace();
//         const address = addressObject.address_components;
//
//         // Check if address is valid
//         if (address) {
//             // Set State
//             this.setState(
//                 {
//                     city: address[0].long_name,
//                     query: addressObject.formatted_address,
//                 }
//             );
//         }
//     }
//     handleScriptLoad = () => {
//         // Declare Options For Autocomplete
//         const options = {
//             types: ['(cities)'],
//         };
//
//         // Initialize Google Autocomplete
//         /*global google*/ // To disable any eslint 'google not defined' errors
//         this.autocomplete = new google.maps.places.Autocomplete(
//             document.getElementById('autocomplete'),
//             options,
//         );
//
//         // Avoid paying for data that you don't need by restricting the set of
//         // place fields that are returned to just the address components and formatted
//         // address.
//         this.autocomplete.setFields(['address_components', 'formatted_address']);
//
//         // Fire Event when a suggested name is selected
//         this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
//     }
//     componentDidMount() {
//         axios.get(placesBaseUrl)
//             .then(response => {
//                 console.log(response.data);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     }
//     render() {
//         console.log(placesBaseUrl)
//         <Script
//         url="https://maps.googleapis.com/maps/api/js?key=your_api_key&libraries=places"
//         onLoad={this.handleScriptLoad}
//         />
//         return(
//             <p>Enter your location:</p>
//             // <input type="text"></input>
//         )
//     }
// }


// class UVChecker extends React.Component
// {
//     render() {
//         return (
//             console.log('hey')
//         );
//     }
// }
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//
//         <p>
//           Burn Report!
//         </p>
//         <p>Here is today's report:</p>
//         <p id="report"></p>
//         {/*< PlacesInput />*/}
//         <Search />
//       </header>
//     </div>
//   );
// }

export default Search;
