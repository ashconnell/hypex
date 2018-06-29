import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import Router from './Router'
import state from './state'

const App = () => (
  <Provider state={state}>
    <Router />
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))
