import React from 'react'
import * as actions from '../actions'
import { connect } from '../util'

const App = props => {
    // 用 useContext 来获取 state 与 dispatch
    const { count, dispatch } = props
    console.log('App', props)

    const increment = val => dispatch(actions.increment(val))
    const decrement = val => dispatch(actions.decrement(val))

    return (
        <div>
            <h1>The count is {count}</h1>
            <button onClick={() => increment(count)}>+</button>
            <button onClick={() => decrement(count)}>-</button>
        </div>
    )
}

export default connect(state => state.counter)(App);