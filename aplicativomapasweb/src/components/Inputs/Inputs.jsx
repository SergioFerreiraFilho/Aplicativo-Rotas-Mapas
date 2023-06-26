import React, { useState, useEffect } from "react";
import "./styles.css";
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Button from 'react-bootstrap/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactLogo from '../../assets/arrow-right-arrow-left-solid.svg';
// import { faArrowRightArrowLeft} from '@fortawesome/fontawesome-free-solid'

const Inputs = ({ onGenerateRoute }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  useEffect(() => {
    if (origin !== "") {
      fetchSuggestions(origin, "origin");
    }
    if (destination !== "") {
      fetchSuggestions(destination, "destination");
    }
  }, [origin, destination]);

  const fetchSuggestions = async (input, field) => {
    try {
      const response = await fetch(
        `http://localhost:3000/suggestions?input=${input}`
      );
      const data = await response.json();
      if (field === "origin") {
        setOriginSuggestions(data.suggestions);
      } else if (field === "destination") {
        setDestinationSuggestions(data.suggestions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOriginChange = (event) => {
    setOrigin(event);
  };

  const handleDestinationChange = (event) => {
    setDestination(event);
  };

  
  const handleSwitch = () => {
    const origem = origin;
    setOrigin(destination)
    setDestination(origem);
    handleGenerateRoute()
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

  const canGenerateRoute = origin !== "" && destination !== "";

  return (
    <div className="boxGerarRota">
      <div className="boxInputs">
      <div className="originTypeHead">
          Origem:
          <AsyncTypeahead
          placeholder="Digite o endereço de origem"        
          id='origem'
          filterBy={() => true}
          onChange={handleOriginChange}
          onSearch= {(query) =>fetchSuggestions(query, 'origin')}
          options={originSuggestions}
          />
      </div>
      <img onClick={handleSwitch} className="imgSwitch" src={ReactLogo} alt="React Logo" />
      <div className="originTypeHead">
          Destino:
          <AsyncTypeahead
          id='destino'
          placeholder="Digite o endereço de destino"        
          onChange={handleDestinationChange}
          filterBy={() => true}
          onSearch= {(query) =>fetchSuggestions(query, 'destination')}
          options={destinationSuggestions}
          />
      </div>
      </div>
      <div className="boxButton">
        {canGenerateRoute ? (
          <div>
            <Button variant='primary' onClick={handleGenerateRoute}>Gerar Rota</Button>
          </div>
        ) : (
          <p className="p">Digite as Rotas</p>
        )}
      </div>
    </div>
  );
};

export default Inputs;
