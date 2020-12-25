import React from 'react';
import * as actions from '../actions';
import { connect } from '../util'

const Todos = props => {
    // 用 useContext 来获取 state 与 dispatch
    const { text, dispatch} = props
    const change = val => dispatch(actions.changeText(val))
    console.log('todos', props)

    return (
      <div>
        <h1>The text is {text}</h1>
        <button onClick={() => change('new')}>change</button>
      </div>
    );
}

export default connect(state => state.todos)(Todos)
