import React from 'react'

export default class Test extends React.Component {
    render() {
        console.log(this.context)
        return(
            <div>
                test
            </div>
        )
    }

}