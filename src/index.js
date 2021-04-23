import React from 'react'
import { render } from 'react-dom'
import { Provider, combineReducers } from '@maple-rc/redux-hook'
import App from './components/App.js'
import Todos from './components/Todos.js'

import { reducers, initState } from './reducers/index'

render(
  <Provider reducer={combineReducers(reducers)} initState={initState}>
      <Todos />
      <App />
  </Provider>,
  document.getElementById('root')
)