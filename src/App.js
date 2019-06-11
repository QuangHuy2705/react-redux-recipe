import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import StoreBuilder from './store/StoreBuilder'

const StoreContainer = StoreBuilder.createStore().createStoreProvider()

function App() {
  return (
    <div className="App">
      <StoreContainer>
        <BrowserRouter>
          <Switch>
          </Switch>
        </BrowserRouter>
      </StoreContainer>
    </div>
  );
}

export default App;
