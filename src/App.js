import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import Loadable from 'react-loadable'
import { withRefreshedStore } from './store/store'
import storeManager from './store/store'
import {default as Builder} from './store/index'

const Main = Loadable({
  loader: () => withRefreshedStore(import('./Main')),
  loading: () => <div>Loading...</div>
})

const StoreBuilder = new Builder()

function App() {
  return (
    <div className="App">
      <Provider store={StoreBuilder.createStore()}>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Main}/>
          </Switch>
        </BrowserRouter>
      </Provider> 
    </div>
  );
}

export default App;
