import React from 'react'
import Props from 'prop-types'
import { Provider } from 'react-redux'
import { withContext } from 'recompose'
import Test from './test'

const contextTypes = {
    store: Props.object,
    registerEpics: Props.func,
    registerReducers: Props.func,
}

const contextCreator = props => ({
    store: props.store,
    registerReducers: props.registerReducers,
    registerEpics: props.registerEpics,
})

class StoreContainer extends React.Component {
    static propTypes = {
        store: Props.object.isRequired,
        children: Props.element,
    }

    render() {
        const { store, children } = this.props
        console.log(this.props.store)
        return (
            <Provider store={store}>
                <Test />
                <div>
                    {children || null}
                </div>
            </Provider>
        )
    }
}

export default withContext(contextTypes, contextCreator)(StoreContainer)