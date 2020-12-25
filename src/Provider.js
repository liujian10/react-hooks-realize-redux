import React, { createContext, useReducer, useMemo } from 'react';

import counterReducer from './reducers/counterReducer';
import todosReducer from './reducers/todosReducer';
import { combineReducers } from './util';

// 用 Context 实现类似 store 的全局容器
export const Context = createContext()

const initialState = {
    counter: { count: 0 },
    todos: { text: 'test' },
}

const Provider = props => {
    const { children } = props

    const combinedReducer = combineReducers({
        counter: counterReducer,
        todos: todosReducer,
    })

    const [state, dispatch] = useReducer(combinedReducer, initialState)
    const context = useMemo(() => children, [children])
    return (
        <Context.Provider value={[state, dispatch]}>
            {context}
        </Context.Provider>
    )
}

export default Provider
