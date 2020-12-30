import React, { createContext, useReducer, useMemo } from 'react'
import { reducers, initState } from './reducers/index'
import { combineReducers } from './util'

// 用 Context 实现类似 store 的全局容器
export const StateContext = createContext()
export const DispatchContext = createContext()


const Provider = props => {
    const { children } = props
    
    const combinedReducer = combineReducers(reducers)
    const [state, dispatch] = useReducer(combinedReducer, initState)
    const context = useMemo(() => children, [children])
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                {context}
            </DispatchContext.Provider>
        </StateContext.Provider>
    )
}

export default Provider
