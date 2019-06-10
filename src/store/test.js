import React from 'react'
import { getContext } from 'recompose'
import PropTypes from 'prop-types'

class Test extends React.Component {
    static contextTypes = {
        store: PropTypes.object.isRequired,
        registerEpics: PropTypes.func.isRequired,
        registerReducers: PropTypes.func.isRequired,
      }
    render() {
        console.log(this.context)
        return (
            <div>test</div>
        )
    }
}

export default Test
