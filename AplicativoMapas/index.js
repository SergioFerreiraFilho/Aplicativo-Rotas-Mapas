// Const Iniciais de Importção das Funcionalidades Basicas
const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const cors = require('cors');
const app = express();
app.use(cors());
// const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
// dotenv.config();




// Const de Configuração do Google Maps
const googleMapsClient = new Client({});

// Const de configuração da Key

const APIKEY = 'sua_key_do_google_maps' // Coloque aqui a sua key do GOOGLE MAPS API

// Levando a Key para o FRONT-END
app.get('/api/google-api-key', (req, res) => {
  res.send(APIKEY);
});

// Rota de Requisição GET para obter sugestões de autocompletar
app.get('/suggestions', async (req, res) => {
  const input = req.query.input;

  try {
    const response = await googleMapsClient.placeAutocomplete({
      params: {
        input: input,
        language: 'pt-BR',
        region: 'br',
        types: ['address'], // Define o tipo de sugestões (pode ser ajustado de acordo com suas necessidades)
        key: APIKEY,
      },
      timeout: 5000
    });

    const suggestions = response.data.predictions.map(prediction => prediction.description);
    res.json({ suggestions: suggestions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Ocorreu um erro ao obter as sugestões.' });
  }
});


// Rota de Requisição GET para informar as Rotas
app.get('/rota', (req, res) => {
  const origin = req.query.origin;
  const destination = req.query.destination;

  googleMapsClient.directions({
    params: {
      key: APIKEY, // Aqui é onde será colocado a KEY do GOOGLE MAPS API, por motivo de segurança não estou fornecendo a minha no momento.
      origin: origin, // Parâmetro do Endereço de Origem
      destination: destination, // Parâmetro do Endereço de Destino, será modificado na URL de Requisição no FRONT-END
      mode: 'driving', // Modo de transporte (Escolhe os Modos de Transporte, os mesmos serão informados melhor no futuro, por agora a opção driving(Carro) será a padrão)
      alternatives: true, // Essa opção faz aparecer rotas alternativas
      language: 'pt-BR',
      region: 'br',
    },
    timeout: 5000
  })
    .then(response => {
      // Extrai as informações de rota e os passos
      const routes = response.data.routes;
      const steps = routes[0].legs[0].steps;
      const stepsWithcoordinates = routes[0].legs[0].steps.map(step => {
        const startLocation = step.start_location ? {
          lat: step.start_location.lat,
          lng: step.start_location.lng
        } : null;
      
        const endLocation = step.end_location ? {
          lat: step.end_location.lat,
          lng: step.end_location.lng
        } : null;
      
        return {
          instruction: step.html_instructions,
          distance: step.distance.text,
          duration: step.duration.text,
          startLocation: startLocation,
          endLocation: endLocation
        };
      });

      // Retorna a resposta em formato JSON
      res.json({ routes: routes, steps: steps, stepsWithcoordinates: stepsWithcoordinates });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Ocorreu um erro ao obter a rota.' });
    });
});


// Inicia o servidor // Pode Trocar a Porta, sera feito uma const no futuro para isso, por enquanto esta 3000 por padrão
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000.');
});
