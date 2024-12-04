import type { DB_Repo } from '~/database/schemas'
import { RepoService } from '~/database/services/repo'

import { createZustandStore } from '../utils/helper'

interface RepoStoreState {
  repos: Record<string, DB_Repo>
}
export const useRepoStore = createZustandStore<RepoStoreState>('repo')(() => ({
  repos: {},
}))

// const get = useRepoStore.getState
const set = useRepoStore.setState

class RepoStoreActionsStatic {
  upsertMany(data: DB_Repo[]) {
    set((state) => {
      const map = { ...state.repos }
      for (const n of data) {
        map[n.id] = n
      }

      return { ...state, repos: map }
    })
    RepoService.upsertMany(data)
  }
}

export const RepoStoreActions = new RepoStoreActionsStatic()
