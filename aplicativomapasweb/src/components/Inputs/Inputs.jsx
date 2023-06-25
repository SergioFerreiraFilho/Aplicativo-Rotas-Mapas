import React, { useState, useEffect } from 'react';
import './styles.css';

const Inputs = ({ onGenerateRoute }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  useEffect(() => {
    if (origin !== '') {
      fetchSuggestions(origin, 'origin');
    }
    if (destination !== '') {
      fetchSuggestions(destination, 'destination');
    }
  }, [origin, destination]);

  const fetchSuggestions = async (input, field) => {
    try {
      const response = await fetch(`http://localhost:3000/suggestions?input=${input}`);
      const data = await response.json();
      if (field === 'origin') {
        setOriginSuggestions(data.suggestions);
      } else if (field === 'destination') {
        setDestinationSuggestions(data.suggestions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleOriginSelect = (address) => {
    setOrigin(address);
    setOriginSuggestions([]);
  };

  const handleDestinationSelect = (address) => {
    setDestination(address);
    setDestinationSuggestions([]);
  };

  const handleGenerateRoute = () => {
    onGenerateRoute(origin, destination);
  };

  const canGenerateRoute = origin !== '' && destination !== '';

  return (
    <div>
      <label>
        Origem:
        <input type="text" value={origin} onChange={handleOriginChange} />
        <ul>
          {originSuggestions && originSuggestions.map((suggestion, index) => (
            <li className='origemLi' key={index} onClick={() => handleOriginSelect(suggestion)}>{suggestion}</li>
          ))}
        </ul>
      </label>
      <label>
        Destino:
        <input type="text" value={destination} onChange={handleDestinationChange} />
        <ul>
          {destinationSuggestions && destinationSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleDestinationSelect(suggestion)}>{suggestion}</li>
          ))}
        </ul>
      </label>
      {canGenerateRoute ? (
        <button onClick={handleGenerateRoute}>Gerar Rota</button>
      ) : (
        <p>Digite as Rotas</p>
      )}
    </div>
  );
};

export default Inputs;
