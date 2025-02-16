import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { createAtomHooks } from '~/lib/jotai'
import { getStorageNS } from '~/lib/ns'

export const [, , useAppIsReady, , appIsReady, setAppIsReady] = createAtomHooks(
  atom(false),
)

export const [, , useAppSearchOpen, , , setAppSearchOpen] = createAtomHooks(
  atom(false),
)

export const [
  ,
  ,
  useAppPollingInterval,
  ,
  getAppPollingInterval,
  setAppPollingInterval,
] = createAtomHooks(atom(60 * 1000))

export const [, , useGHToken, , getGHToken, setGHToken] = createAtomHooks(
  atomWithStorage(getStorageNS('gh-token'), '', undefined, {
    getOnInit: true,
  }),
)
