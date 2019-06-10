import React from 'react'

class Main extends React.Component {
    render() {
        console.log(this.context)
        return (
            <div>Works</div>
        )
    }
}

// storeManager.registerReducers({ main: MainReducer })

export default Main