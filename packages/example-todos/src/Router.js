import React from 'react'
import { inject, observer } from 'mobx-react'
import TodoLists from './TodoLists'
import TodoList from './TodoList'

const components = {
  TodoLists: TodoLists,
  TodoList: TodoList,
}

const Router = ({ state }) => {
  if (!state.route) return null
  const Route = components[state.route.name]
  return <Route {...state.route.props} />
}

export default inject('state')(observer(Router))
