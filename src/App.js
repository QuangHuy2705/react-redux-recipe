import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Loadable from 'react-loadable'
import {default as Builder} from './store/index'

const Main = Loadable({
  loader: () => import('./components/Main/index'),
  loading: () => <div>Loading...</div>
})

const StoreContainer = new Builder().createStore().createStoreContainer()

function App(props) {
  return (
    <div className="App">
      <StoreContainer props={props}>
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
