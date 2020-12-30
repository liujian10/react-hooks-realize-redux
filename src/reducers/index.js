const context = require.context('./', false, /\.(js|tsx)$/)
const keys = context.keys().filter(item => item !== './index.js')
const [reducers, initState] = keys.reduce((res, key) => {
    const nameSpace = key.match(/([^\\/]+).(js)$/)[1]
    res[0][nameSpace] = context(key).reducer
    res[1][nameSpace] = context(key).initState
    return res
}, [{}, {}])

export { reducers, initState }
