import React from 'react'
import * as actions from '../actions'
import { connect } from '../util'

const Todos = props => {
    // 用 useContext 来获取 state 与 dispatch
    const { todos, counter, dispatch } = props
    const change = val => dispatch(actions.changeText(val))
    const increment = val => dispatch(actions.increment(counter.count))
    console.log('todos', props)

    return (
        <div>
            <h1>The text is {todos.text}</h1>
            <button onClick={() => change('new')}>change</button>
            <button onClick={increment}>increment</button>
        </div>
    )
}

export default connect(
    state => state.counter,
    state => state.todos,
    (counter, todos) => ({ counter, todos }),
)(Todos)
