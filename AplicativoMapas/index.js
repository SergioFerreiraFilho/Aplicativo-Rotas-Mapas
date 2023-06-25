// Const Iniciais de Importção das Funcionalidades Basicas

const express = require('express');
const { Client } = require('@googlemaps/google-maps-services-js');
const cors = require('cors');
const app = express();
app.use(cors());


// Const de Configuração do Google Maps
const googleMapsClient = new Client({});

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
        key: '', // Substitua com sua chave de API do Google Maps JavaScript API
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
    key: '', // Aqui e onde ira ser colocado a KEY do GOOGLE MAPS API, por motivo de segurança não estou fornecendo a minha no momento.
    origin: origin, // Parametro do Endereço de Origem
    destination: destination, // Parametro do Endereço de Destino , Sera modificado na URL de Requição no FRONT-END
    mode: 'driving', // Modo de transporte ( Escolhe os Modos de Transporte, os mesmos seram informados melhor no futuro, por agora a opção driving(Carro) sera a padrão)
    alternatives: true, // Essa opção faz aparecer rotas auternativas
    language: 'pt-BR',
    region: 'br',

  },
  timeout: 5000
})
  .then(response => {
    // Extrai as informações de rota e os passos // Futuramente sera feito uma const para extrair a latitude e longitude para formar o mapa.
    const routes = response.data.routes;
    const steps = routes[0].legs[0].steps;

    // Retorna a resposta em formato JSON
    res.json({ routes: routes, steps: steps });
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
