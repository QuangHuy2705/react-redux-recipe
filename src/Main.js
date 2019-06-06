import React from 'react'
import { Provider } from 'react-router-dom'
import storeManager from './store/store'
import MainReducer from './MainReducer'

class Main extends React.Component {
    render() {
        return (
            <div>Works</div>
        )
    }
}

storeManager.registerReducers({ main: MainReducer })

export default Main