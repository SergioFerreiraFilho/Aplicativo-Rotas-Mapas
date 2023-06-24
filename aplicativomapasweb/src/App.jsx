import React, { useEffect, useState } from 'react';

function App() {
  const [route, setRoute] = useState(null);

  useEffect(() => {
    async function fetchRoute() {
      try {
        const response = await fetch('http://localhost:3000/rota?origin=Fortaleza,%20Brasil&destination=Aquiraz,%20Brasil'); // Por enquanto esta sendo feito uma rota padrão de Aquiraz a Fortaleza, por motivos de testes rapidos.
        const data = await response.json();
        setRoute(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchRoute();
  }, []);

  return (
    <div>
      <h1>Rota entre Fortaleza e Aquiraz</h1>
      {route ? (
        <div>
          <h2>Informações da rota:</h2>
          <p>Duração: {route.routes[0].legs[0].duration.text}</p>
          <p>Distância: {route.routes[0].legs[0].distance.text}</p>

          <h2>Passos do trajeto:</h2>
          <ol>
            {route.steps.map((step, index) => (
              <li key={index}>{step.html_instructions}</li>
            ))}
          </ol>
        </div>
      ) : (
        <p>Carregando rota...</p>
      )}
    </div>
  );
}

export default App;
