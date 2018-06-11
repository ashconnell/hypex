import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import Router from './Router'
import store from './store'

const App = () => (
  <Provider store={store}>
    <Router />
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))
