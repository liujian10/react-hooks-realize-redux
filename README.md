## 为什么要用Redux？

> 一般而言，如果随着时间的推移，数据处于合理的变动之中、需要一个单一的数据源、在 React 顶层组件 state 中维护所有内容的办法已经无法满足需求，这个时候就需要使用 Redux 了

这是官方关于什么时候需要用到`Redux`的描述，分析下

1. 数据处于合理的变动之中 > 数据复杂度越来越高
2. 需要一个单一数据源 > 统一状态/数据管理
3. 在 React 顶层组件 state 中维护所有内容的办法已经无法满足需求 > `React`无法满足需求

简单来说，`Redux` 提供了统一的状态管理，让复杂的前端变得更加健壮和易维护，让组件之间数据共享变得更有效率，简单列下`Redux`的优点：

1. 统一的状态管理，让组件间数据共享更高效
2. `reducer`纯函数和`action`机制，使状态具有可预测性，易于测试
3. 可以把`state`从组件中解耦出来，使组件更轻量，代码易读性更好
4. 各种`middleware`，方便拓展

---

## React Hooks 实现 Redux

`Redux`很好，现在我们每个`React`项目几乎都会用到`Redux`。但有时候它也会显得很臃肿，`action`、`reducer`、`connnect`、`mapStateToProps`、`mapDispatchToProps`写起来会显得很繁琐，有没有更优雅的方案呢？

之前看到一篇有意思的文章 [使用 React Hooks 代替 Redux](https://zhuanlan.zhihu.com/p/66020264) ，好像`React Hooks`是个不错的替代方案，不多说，直接上代码

Redux

* 组织`action`

```javascript
// actions/actions.js
export const increment = count => ({
  type: 'CHANGE_COUNT',
  payload: count + 1
})

export const decrement = count => ({
  type: 'CHANGE_COUNT',
  payload: count - 1
})
```

* 创建`reducers`

```javascript
// reducer/counterReducer.js
const counterReducer = (state, action) => {
  switch(action.type) {
    case 'CHANGE_COUNT':
      return {
        ...state,
        count: action.payload
      }
    default:
      return state;
  }
};

export default counterReducer
```

* 创建`store`

```javascript
// Main.js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './components/App.jsx';
import counterReducer from './reducers/counterReducer';

const initialState = {
  count: 0
};
const store = createStore(counterReducer, initialState);
render(
  <Provider store={store}>
    <App />
  </Provider>, 
  document.getElementById('root')
);
```

* UI组件

```javascript
// components/App.jsx
import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/actions';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {count, increment, decrement} = this.props;

    return (
      <div>
        <h1>The count is {count}</h1>
        <button onClick={() => increment(count)}>+</button>
        <button onClick={() => decrement(count)}>-</button>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  count: store.count
});

const mapDispatchToProps = dispatch => ({
  increment: count => dispatch(actions.increment(count)),
  decrement: count => dispatch(actions.decrement(count))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

用 React Hooks 来实现

* 组织`action`，同上

* 创建`reducers`，同上

* 创建`Context`

```javascript
// Main.js
import React, { createContext, useReducer } from 'react';
import {render} from 'react-dom';
import App from './components/App.jsx';
import reducer from './reducers/counterReducer';

const initialState = {
  count: 0
}
// 用 Context 实现类似 store 的全局容器
export const Context = createContext()

const Provider = props => {
   // 用 useReducer 生成 state 与 dispatch
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            <App />
        </Context.Provider>
    )
}

render(
  <Provider />, 
  document.getElementById('root')
);
```

* UI组件

```javascript
// components/App.jsx
import React, { useContext } from 'react';
import { Context } from '../Main.js';
import * as actions from '../actions/actions';

const App = props => {
    // 用 useContext 来获取 state 与 dispatch
    const [state, dispatch] = useContext(Context)

    const increment = count => dispatch(actions.increment(count))
    const decrement = count => dispatch(actions.decrement(count))

    return (
      <div>
        <h1>The count is {state.count}</h1>
        <button onClick={() => increment(state.count)}>+</button>
        <button onClick={() => decrement(state.count)}>-</button>
      </div>
    );
}

export default App;
```

从上面代码中可以看到，`React Hook`主要是用到了`useReducer`与`useContext`两个hook，也有`action`、`reducer`、`dispatch`，而且用法与`Redux`一样，只是`store`的实现、`reducer`的应用、`state\dispatch`的生成与获取方式有差异

### 数据流对比

Redux

![ReduxDataFlow](https://miro.medium.com/max/3600/1*yYkitaR24SuFNXYyTxL1xA.gif)

Hooks

![hooks-flow](https://miro.medium.com/max/2068/1*PZM9gEhY5So-Oq4C_aTHQA.png)

重点看下 `React Hooks`，通过`useReducer`生成`state`与`dispatch`，然后以`Context`做容器，在UI 组件内，通过`useContext`得到 `state`、`dispatch`，主动调用 `dispatch` 发送 `action`，然后经过`useReducer`，触发`reducer`相应的数据改变。

它们都是在UI组件内调用`dispatch`发送`action`，然后经过`reducer`后，生成新的`state`回到UI组件更新视图，一样的数据流，只是实现有所不同

上面的例子很简单，`React Hooks`能实现`Redux`的基本功能，然而用到实际开发中，这还不够

### 组合reducer

实际开发中，我们经常需要根据页面组织不同的`reducer`，然后进行组合。

`Redux`中，有专门的工具[combineReducers](https://redux.js.org/api/combinereducers#combinereducersreducers)来实现，而`React Hooks`是没有的，我们需要自己实现

先看下，`combineReducers`干了啥

```jsx
// todos、counter是两个reducer
import { combineReducers } from 'redux'
import counterReducer from './reducers/counterReducer';
import todosReducer from './reducers/todosReducer';

export default combineReducers({
  todos: counterReducer,
  counter: todosReducer,
})
```

返回一个调用 reducers 对象里所有 reducer 的 reducer，并且构造一个与 reducers 对象结构相同的 state 对象。

换一种说法，我们需要写一个函数combineReducers，使得下面的用法

```jsx
const reducer = combineReducers({
  a: handleA,
  b: handleB,
  c: HandleC,
})
```

转换成

```jsx
function reducer(state = {}, action) {
  return {
    a: handleA(state.a, action),
    b: handleB(state.b, action),
    c: HandleC(state.c, action)
  }
}
```

知道要干嘛就简单了，直接参照[源码](https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts)自己写一个

```jsx
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
```

好了，一个简版的`combineReducers`就搞定了

更新下代码

```javascript
// Main.js
...
import counterReducer from './reducers/counterReducer';
import todosReducer from './reducers/todosReducer';
import { combineReducers } from './util';

...
const reducers = combineReducers({
  counter: counterReducer,
  todos: todosReducer,
})

const Provider = props => {
    // 用 useReducer 生成 state 与 dispatch
    const [state, dispatch] = useReducer(reducers, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            <App />
        </Context.Provider>
    )
}

...
```

```javascript
// components/App.jsx
...

const App = props => {
    const [state, dispatch] = useContext(Context)
    const { counter } = state

    const increment = count => dispatch(actions.increment(count))
    const decrement = count => dispatch(actions.decrement(count))

    return (
      <div>
        <h1>The count is {counter.count}</h1>
        <button onClick={() => increment(counter.count)}>+</button>
        <button onClick={() => decrement(counter.count)}>-</button>
      </div>
    );
}

...
```

可以看到，UI组件获取用的`state`是全局的，而我们只需要`state`里面的`counter`，这样就会有个问题，只要全局`state`有更新，都会触发组件的重新渲染，还差点意思

### 状态切片

还是先看看`Redux`怎么处理的

```jsx
import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import App from './components/App'

export default connect(createSelector(
    state => ({ ...state.counter, ...state.common }),
    data => data,
))(Home)
```

`createSelector`重新组合`state`，生成可记忆的 Selector，然后`connect`连接到UI组件

重点看下[`createSelector`](https://github.com/reduxjs/reselect/blob/master/src/index.js)，关键在于生成可记忆的 Selector

来看源码，摘重点

```javascript
export function defaultMemoize(func, equalityCheck = defaultEqualityCheck) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments)
    }

    lastArgs = arguments
    return lastResult
  }
}
```

可以看到，先缓存方法的入参及结果，然后每次调用的时候对比入参是否变化，如果没变化，就返回缓存的结果，原理很简单

我们试着写一个简版的

```javascript
// useSelector.js

import { useContext, useMemo } from 'react'
// 这里我们其实只有一个`Context`，可以直接放这里吧
import { Context } from './index.js'

const useSelector = (...funcs) => {
    const [state, dispatch] = useContext(Context)
    console.log('useSelector', funcs)
    const resultFunc = useMemo(() => {
        if (funcs.length > 1) {
            return funcs.pop()
        }
        return ([v]) => v
    }, [funcs])
    const params = funcs.map(func => func(state))

    return useMemo(() => [resultFunc(params), dispatch], [resultFunc, params, dispatch])
}

const connect = (...args) => {
    return Cmp => {
        return props => {
            const [state, dispatch] = useSelector(...args)
            return useMemo(() => <Cmp {...props} {...state} dispatch={dispatch} /> , [props, state, dispatch])
        }
    }
}

export default connect
```

这里直接用`useMemo`实现了参数/结果的缓存处理，当然还有很多细节需要处理，先拿这个简版的试试效果

加到代码里面

```jsx
// components/App.jsx
import React from 'react';
import * as actions from '../actions';
import { connect } from '../util'

const App = props => {
    // 用 useContext 来获取 state 与 dispatch
    const { count, dispatch } = props

    const increment = val => dispatch(actions.increment(val))
    const decrement = val => dispatch(actions.decrement(val))

    return (
      <div>
        <h1>The count is {count}</h1>
        <button onClick={() => increment(count)}>+</button>
        <button onClick={() => decrement(count)}>-</button>
      </div>
    );
}

export default connect(state => state.counter)(App);
...
```

运行代码，发现在`App`中调用`increment`依然会触发`Todos`组件的重新渲染，脑壳痛，一顿调试，才发现问题在这

```javascript
// Main.js
...

const Provider = props => {
    // 用 useReducer 生成 state 与 dispatch
    const [state, dispatch] = useReducer(reducers, initialState)
    return (
        <Context.Provider value={[state, dispatch]}>
            <App />
            <Todos />
        </Context.Provider>
    )
}

...
```

更新`dispatch`的时候会导致`useReducer`创建新的`state`，触发`Provider`的重新渲染，从而导致`App`与`Todos`也会重新渲染

再优化下

```
// Provider.js
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

```

```jsx
// Main.js
import React from 'react';
import { render } from 'react-dom';
import App from './components/App.js';
import Todos from './components/Todos.js';
import Provider from './Provider';

render(
  <Provider>
      <Todos />
      <App />
  </Provider>,
  document.getElementById('root')
);

```

运行一下，完美，终于有了可以应用到开发中的样子，剩下的就是细节优化了，有时间再补吧~

### 总结

现在，来总结下，它们的异同点

相同点
1. 可以实现统一状态管理
2. 相同的`action`、`reducer`、`dispatch`用法
3. 一样的数据流

不同点
1. `React Hooks` UI 层获取 `state` 和 `dispatch` 是通过 useContext，而 Redux 是通过 HOC 依赖注入
2. `Redux` 在 `action` 之后改变视图本质上还是 `state` 注入的方式修改的组件内部 `state`，而 `hooks` 则是一对一的数据触发
3. `Redux` 的 `reducer` 处理在 `store` 里面，而 `React Hooks` 则是通过 `useReducer`
4. `Redux` 有很多为统一状态管理准备的工具，如`combineReducers`、`connect`、`compose`，还有各种`middleware`，生态也更加完善，相比`React Hooks`功能更加强大，开箱即用

### 我的理解

React Hooks 能替代 Redux 吗？结合上面的内容说下我的理解：

* `React Hooks`不是替代`Redux`，而是提供了一个新的更灵活的状态管理选择
* `React Hooks`比`Redux`语法更简洁、更优雅，能实现`Redux`的主要功能，也更加灵活。
    * 项目中有全局共享数据的需求，但是组件间数据交互并不是很复杂
    * 项目不需要全局共享数据，只是某个页面下多个非子组件间需要共享数据
    * 有复杂数据层级，需要复用的组件

    以上场景我觉得用`React Hooks`会更好
* `Redux`有各种`middleware`，功能更强大，拓展性更好
    * 项目中有大量、复杂的网络请求，`redux-saga`
    * 项目需要全局状态管理，用Hooks满足不了需求

    以上场景我觉得用`Redux`会更好

---

## 或许，这是更优解
React-Redux 也拥有自己的Hook 了，参考 [Clean Up Redux Code with React-Redux Hooks](https://medium.com/swlh/clean-up-redux-code-with-react-redux-hooks-71587cfcf87a)

`useSelector`对`store`进行切片保存到具体组件，可以看出我们上面实现的hook很像，但是这个生成的还是普通的`selector`，还是需要配合`createSelecter`使用;

`useDispatch`更方便的获取`dispatch`

hook的语法，代替了HOC的依赖注入方式，更简洁，更优雅

```jsx
// Main.js
import React from 'react';
import { createSelector } from 'reselect';
import * as actions from '../actions/actions';
import { useSelector, useDispatch } from 'react-redux';

const App = () => {
  const dispatch = useDispatch();
  const count = useSelector(createSelector(store => store.count, state => state));

  return (
    <div>
      <h1>The count is {count}</h1>
      <button onClick={() => dispatch(actions.increment(count))}>+</button>
      <button onClick={() => dispatch(actions.decrement(count))}>-</button>
    </div>
  );
}

export default App;
```
