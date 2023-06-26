import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import Inputs from './components/Inputs/Inputs';
import MapWithRoutes from './components/MapWithRoutes/MapWithRoutes';
import './App.css'
// import dotenv from 'dotenv';
// dotenv.config();

function App() {
  const [route, setRoute] = useState(null);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const generateRoute = async (origin, destination) => {
    try {
      const response = await fetch(`http://localhost:3000/rota?origin=${origin}&destination=${destination}`);
      const data = await response.json();
      setRoute(data);
      setOrigin(origin);
      setDestination(destination);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='container'>
    <div className='inputLocation'>
      <Inputs onGenerateRoute={generateRoute} className='inputCSS' />
    </div> 
      {route ? (
        <div>
        <div className='headInformation'>
          <h1>Rota entre {origin} e {destination}</h1>
          <h2>Informações da rota:</h2>
          <p>Duração: {route.routes[0].legs[0].duration.text}</p>
          <p>Distância: {route.routes[0].legs[0].distance.text}</p>
          <h2>Passos do trajeto:</h2>
        </div>
        <div className='textMap'>
          <ol>
            {route.steps.map((step, index) => (
              <li key={index}>{parse(step.html_instructions)}</li>
            ))}
          </ol>
          <div>
          <MapWithRoutes route={route} className='maps'/>
          </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
