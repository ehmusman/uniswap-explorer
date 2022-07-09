import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ContractEventsState from './context/contract/contractEventsState';

ReactDOM.render(
  <React.StrictMode>
    <ContractEventsState>
      <App />
    </ContractEventsState>
  </React.StrictMode>,
  document.getElementById('root')
);
