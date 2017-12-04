import React, {Component} from 'react';
import $ from 'jquery';
const { compose, withProps, withStateHandlers } = require('recompose');
import FaIconPack from 'react-icons/lib/fa';
import MarkerItem from './marker.jsx';
const FaAnchor = require('react-icons/lib/fa/anchor');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require('react-google-maps');


const Map = (props)=> {
  const MapStyles = [{'featureType': 'all', 'elementType': 'labels.text.fill', 'stylers': [{'color': '#ffffff'}]}, {'featureType': 'all', 'elementType': 'labels.text.stroke', 'stylers': [{'color': '#000000'}, {'lightness': 13}]}, {'featureType': 'administrative', 'elementType': 'geometry.fill', 'stylers': [{'color': '#000000'}]}, {'featureType': 'administrative', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#144b53'}, {'lightness': 14}, {'weight': 1.4}]}, {'featureType': 'landscape', 'elementType': 'all', 'stylers': [{'color': '#08304b'}]}, {'featureType': 'poi', 'elementType': 'geometry', 'stylers': [{'color': '#0c4152'}, {'lightness': 5}]}, {'featureType': 'road.highway', 'elementType': 'geometry.fill', 'stylers': [{'color': '#000000'}]}, {'featureType': 'road.highway', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#0b434f'}, {'lightness': 25}]}, {'featureType': 'road.arterial', 'elementType': 'geometry.fill', 'stylers': [{'color': '#000000'}]}, {'featureType': 'road.arterial', 'elementType': 'geometry.stroke', 'stylers': [{'color': '#0b3d51'}, {'lightness': 16}]}, {'featureType': 'road.local', 'elementType': 'geometry', 'stylers': [{'color': '#000000'}]}, {'featureType': 'transit', 'elementType': 'all', 'stylers': [{'color': '#146474'}]}, {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#021019'}]}];
  const lat = props.geolocationInfo.lat;
  const lng = props.geolocationInfo.long;


  let resArr = props.geolocationInfo.resArr.slice(1).map(result => {
    return {lat: result.geometry.location.lat, lng: result.geometry.location.lng, name: result.name,
      address: result.formatted_address, icon: {
        url: 'http://images.mobilism.org/?dm=VS3EOQPV',
      }};
  });

  resArr.unshift({lat, lng, info: 'User',
    address: props.geolocationInfo.location, icon: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Circle-icons-heart.svg/40px-Circle-icons-heart.svg.png',
    }});

  console.log('resArr');
  console.log(resArr);

  const MapWithAMakredInfoWindow = compose(
    withScriptjs,
    withGoogleMap
  )((props) =>
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{lat, lng}}
      defaultOptions={{ styles: MapStyles }}
    >
      {resArr.map((location, i)=>
        <MarkerItem location={location} key={i} />
      )}

    </GoogleMap>
  );

  return (
    <MapWithAMakredInfoWindow
      googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC4R6AN7SmujjPUIGKdyao2Kqitzr1kiRg&v=3.exp&libraries=geometry,drawing,places"
      loadingElement={<div style={{ height: '100%' }} />}
      containerElement={<div style={{ height: '400px' }} />}
      mapElement={<div style={{ height: '100%' }} />}
    />
  );
};




export default Map;
