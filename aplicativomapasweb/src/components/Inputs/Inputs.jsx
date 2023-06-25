import React, { useState } from 'react';

const Inputs = ({ onGenerateRoute }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOriginChange = (event) => {
    setOrigin(event.target.value);
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const handleGenerateRoute = async () => {
    setLoading(true);
    await onGenerateRoute(origin, destination);
    setLoading(false);
  };

  const canGenerateRoute = origin !== '' && destination !== '';

  return (
    <div>
      <label>
        Origem:
        <input type="text" value={origin} onChange={handleOriginChange} />
      </label>
      <label>
        Destino:
        <input type="text" value={destination} onChange={handleDestinationChange} />
      </label>
      {loading ? (
        <p>Carregando Rotas...</p>
      ) : (
        <div>
          {!canGenerateRoute && <p>Digite as Rotas</p>}
          {canGenerateRoute && (
            <button onClick={handleGenerateRoute}>Gerar Rota</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Inputs;