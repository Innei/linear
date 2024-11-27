import type { components } from '@octokit/openapi-types'
import { atom } from 'jotai'

import { createAtomHooks } from '~/lib/jotai'

type AuthenticatedUser = components['schemas']['public-user']
export const [, , useUser, , getUser, setUser] = createAtomHooks(
  atom<AuthenticatedUser | null>(null),
)
