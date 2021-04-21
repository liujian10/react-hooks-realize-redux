import React, { useState } from 'react'
import { useSetState } from '@sunl-fe/sfe-hook'

const Demo = () => {
    const [state, setState] = useSetState({ a: 1, b: 2 }, val => console.log('cb', val))
    const [val, setVal] = useState('old')

    const addA = () => {
        setState(val => ({ ...val, a: val.a + 1 }))
    }
    const addB = () => setState({ b: state.b + 1 })
    const increment = () => setVal('new')

    console.log('render')

    return (
        <div>
            <h1>state.a is {state.a}</h1>
            <h1>state.b is {state.b}</h1>
            <button onClick={addA}>+a</button>
            <button onClick={addB}>+b</button>
            <button onClick={increment}>{val}</button>
        </div>
    )
}

export default Demo
