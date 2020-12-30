
import { useContext, useMemo } from 'react'
// 这里我们其实只有一个`Context`，可以直接放这里吧
import { StateContext } from './Provider.js'
import { DispatchContext } from './Provider.js'

const useSelector = (...funcs) => {
    const state = useContext(StateContext)
    const resultFunc = useMemo(() => {
        if (funcs.length > 1) {
            return funcs.pop()
        }
        return (...v) => v[0]
    }, [funcs])
    const params = funcs.map(func => func(state))

    return useMemo(() => resultFunc(...params), [resultFunc, params])
}

const useDispatch = () => useContext(DispatchContext)

const connect = (...args) => {
    return Cmp => {
        return props => {
            const state = useSelector(...args)
            const dispatch = useDispatch()
            return useMemo(() => <Cmp {...props} {...state} dispatch={dispatch} /> , [props, state, dispatch])
        }
    }
}

const combineReducers = reducers => {
    // 把非function的reducer过滤掉
    const finalReducers = Object.entries(reducers).reduce((res, [k, v]) => {
        if (typeof v === 'function') {
            res[k] = v
        }
        return res
    }, {})
    const finalReducersEntries = Object.entries(finalReducers)
    // 根据key调用每个reducer，将他们的值合并在一起
    return (state = {}, action) => {
        let hasChange = false
        const nextState = {}

        finalReducersEntries.forEach(([key, handle]) => {
            const previousValue = state[key]
            const nextValue = handle(previousValue, action)
            nextState[key] = nextValue
            hasChange = hasChange || previousValue !== nextValue
        })
        return hasChange ? nextState : state
    }
}

export {
    combineReducers,
    useSelector,
    useDispatch,
    connect,
}