import './scan'
import './styles/index.css'

import { ClickToComponent } from 'click-to-react-component'
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { setAppIsReady } from './atoms/app'
import { initializeApp } from './initialize'
import { router } from './router'

initializeApp().finally(() => {
  setAppIsReady(true)
})

const $container = document.querySelector('#root') as HTMLElement

createRoot($container).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ClickToComponent editor={'cursor'} />
  </React.StrictMode>,
)
