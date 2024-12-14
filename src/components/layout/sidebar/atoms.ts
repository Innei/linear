import { atomWithStorage } from 'jotai/utils'

import { getStorageNS } from '~/lib/ns'

export const groupItemsAtom = atomWithStorage(
  getStorageNS('sidebar-group-items'),
  true,
  undefined,
  {
    getOnInit: true,
  },
)
