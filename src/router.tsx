import { createBrowserRouter, createHashRouter } from 'react-router'

import { App } from './App'
import { ErrorElement } from './components/common/ErrorElement'
import { NotFound } from './components/common/NotFound'
import { buildGlobRoutes } from './lib/route-builder'

const globTree = import.meta.glob('./pages/**/*.tsx')
const tree = buildGlobRoutes(globTree)

const routerCreator = window['__DEBUG_PROXY__']
  ? createHashRouter
  : createBrowserRouter

export const router = routerCreator([
  {
    path: '/',
    element: <App />,
    children: tree,
    errorElement: <ErrorElement />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])
