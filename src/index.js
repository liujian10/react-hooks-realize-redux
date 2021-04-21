import React from 'react'
import { render } from 'react-dom'
import { Provider } from '@maple-rc/redux-hook'
import App from './components/App.js'
import Todos from './components/Todos.js'
import Demo from './components/Demo.js'

import { reducers, initState } from './reducers/index'

render(
  <Provider reducers={reducers} initState={initState}>
      <Todos />
      <App />
      <Demo />
  </Provider>,
  document.getElementById('root')
)