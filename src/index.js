import React from 'react'
import { render } from 'react-dom'
import App from './components/App.js'
import Todos from './components/Todos.js'
import Provider from './Provider'

render(
  <Provider>
      <Todos />
      <App />
  </Provider>,
  document.getElementById('root')
)