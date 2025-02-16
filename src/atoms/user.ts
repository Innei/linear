import { atom } from 'jotai'

import type { DB_User } from '~/database'
import { createAtomHooks } from '~/lib/jotai'

export const [, , useUser, , getUser, setUser] = createAtomHooks(
  atom<DB_User | null>(null),
)
