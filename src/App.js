import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import StoreBuilder from './store/StoreBuilder'

const Main = Loadable({
  loader: () => import('./components/Main/index.js'),
  loading: () => <div>Loading...</div>,
  timeout: 5000,
})

const StoreContainer = StoreBuilder.createStore().createStoreProvider()

function App(props) {
  return (
    <div className="App">
      <StoreContainer>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Main}/>
          </Switch>
        </BrowserRouter>
      </StoreContainer> 
    </div>
  );
}

export default App;
