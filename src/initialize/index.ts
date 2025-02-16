import { enableMapSet } from 'immer'

import { getGHToken } from '~/atoms/app'
import { appLog } from '~/lib/log'

import { hydrateDatabaseToStore } from './hydrate'
import { initializeJobs } from './jobs'

export const initializeApp = async () => {
  if (!getGHToken()) {
    throw new Error('No GitHub token found')
  }
  appLog(`Initialize ${APP_NAME}...`)

  const now = Date.now()

  // Enable Map/Set in immer
  enableMapSet()

  const loadingTime = Date.now() - now

  await hydrateDatabaseToStore()
  initializeJobs()

  appLog(`Initialize ${APP_NAME} done,`, `${loadingTime}ms`)
}
