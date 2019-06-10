import React from 'react'
import Props from 'prop-types'
import { Provider } from 'react-redux'
import { withContext } from 'recompose'
import Loadable from 'react-loadable'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

const Main = Loadable({
  loader: () => import('../components/Main/index.js'),
  loading: () => <div>Loading...</div>,
  timeout: 5000,
})

const contextTypes = {
    store: Props.object,
    registerEpics: Props.func,
    registerReducers: Props.func,
  }
  
  const contextCreator = props => ({
    store: props.store,
    registerEpics: props.registerEpics,
    registerReducers: props.registerReducers,
  })
  
    class StoreContainer extends React.Component {
    static propTypes = {
      store: Props.object.isRequired,
      children: Props.element,
    }
  
    render() {
      const { store, children } = this.props  
      return (
        <Provider store={store}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={Main}/>
            </Switch>
          </BrowserRouter>
        </Provider>
      )
    }
  }

  export default withContext(contextTypes, contextCreator)(StoreContainer)