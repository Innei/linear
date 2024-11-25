import type { FC } from 'react'
import { useEffect } from 'react'
import { Outlet } from 'react-router'

import { useAppIsReady } from './atoms/app'
import { appLog } from './lib/log'
import { RootProviders } from './providers/root-providers'

export const App: FC = () => {
  return (
    <RootProviders>
      <AppLayer />
    </RootProviders>
  )
}
const AppLayer = () => {
  const appIsReady = useAppIsReady()

  useEffect(() => {
    // removeAppSkeleton()
    const doneTime = Math.trunc(performance.now())
    appLog('App is ready', `${doneTime}ms`)
    // applyAfterReadyCallbacks()
  }, [appIsReady])

  return appIsReady ? <Outlet /> : <AppSkeleton />
}

const AppSkeleton = () => {
  return null
}
export default App
