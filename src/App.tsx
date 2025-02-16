import type { FC } from 'react'
import {
  Fragment,
  useEffect,
  useInsertionEffect,
  useRef,
} from 'react'
import { Outlet } from 'react-router'

import { setGHToken, useAppIsReady, useGHToken } from './atoms/app'
import { useUISettingKey } from './atoms/settings/ui'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { appLog } from './lib/log'
import { RootProviders } from './providers/root-providers'

export const App: FC = () => {
  return (
    <RootProviders>
      <AppLayer />
    </RootProviders>
  )
}

const removeAppSkeleton = () => {
  const skeleton = document.querySelector('#skeleton')
  if (skeleton) {
    skeleton.remove()
  }
}

const AppLayer = () => {
  const appIsReady = useAppIsReady()

  useInsertionEffect(() => {
    removeAppSkeleton()
  }, [])
  useEffect(() => {
    const doneTime = Math.trunc(performance.now())
    appLog('App is ready', `${doneTime}ms`)
    // applyAfterReadyCallbacks()
  }, [appIsReady])

  return appIsReady ? <Outlet /> : <AppSkeleton />
}

const AppSkeleton = () => {
  const sidebarColWidth = useUISettingKey('sidebarColWidth')
  const ghtoken = useGHToken()
  return (
    <Fragment>
      <div
        className="flex absolute inset-y-0 z-[2] shrink-0 grow flex-col overflow-hidden bg-sidebar duration-200"
        style={{
          width: `${sidebarColWidth}px`,
        }}
      />
      {!ghtoken && (
        <div className="center grow">
          <GHTokenForm />
        </div>
      )}
    </Fragment>
  )
}

const GHTokenForm = () => {
  const tokenRef = useRef('')
  return (
    <div className="flex w-[300px] flex-col gap-2">
      <div className="text-center text-lg font-bold">GitHub Token</div>
      <div className="text-center text-sm text-gray-500">
        Please enter your GitHub token
      </div>

      <Input
        type="password"
        className="mb-4 text-sm [--a:var(--p)]"
        placeholder="GitHub Token"
        onChange={(e) => {
          tokenRef.current = e.target.value
        }}
      />

      <Button
        className="!text-base-100 [--a:var(--p)]"
        onClick={() => {
          setGHToken(tokenRef.current)
          window.location.reload()
        }}
      >
        Save
      </Button>
    </div>
  )
}

export default App
