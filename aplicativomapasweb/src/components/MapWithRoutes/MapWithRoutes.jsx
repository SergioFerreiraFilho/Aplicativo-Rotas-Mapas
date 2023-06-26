import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'

const containerStyle = {
  width: '50%',
  height: '400px',
};

const center = {
  lat: -20.0000,
  lng: -40.0000,
};

const MapWithRoutes = ({ route }) => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/api/google-api-key')
      .then(response => {
        const apiKey = response.data;
        setApiKey(apiKey);
      })
      .catch(error => {
        console.log('Erro ao obter a chave de API:', error);
      });
  }, []);

  useEffect(() => {
    if (apiKey) {
      loadGoogleMaps();
    }
  }, [apiKey]);

  const loadGoogleMaps = () => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry`;
    script.onload = () => {
      renderMap();
      renderRoute();
    };
    script.onerror = (error) => {
      console.log('Erro ao carregar o Google Maps:', error);
    };
    document.body.appendChild(script);
  };

  const renderMap = () => {
    new window.google.maps.Map(document.getElementById('map'), {
      center,
      zoom: 12,
    });
  };

  const renderRoute = () => {
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    const map = new window.google.maps.Map(document.getElementById('map'), {
      center,
      zoom: 5,
    });

    directionsRenderer.setMap(map);

    const request = {
      origin: route.routes[0].legs[0].start_location,
      destination: route.routes[0].legs[0].end_location,
      travelMode: 'DRIVING',
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
      } else {
        console.log('Erro ao traçar a rota:', status);
      }
    });
  };

  return <div id="map" style={containerStyle} className='mapStyle'></div>;
};

export default MapWithRoutes;
