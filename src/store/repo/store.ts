import type { DB_Notification, DB_Repo } from '~/database/schemas'
import { MetaKey, MetaService } from '~/database/services/meta'
import { NotificationService } from '~/database/services/notification'
import { octokit } from '~/lib/octokit'

import { createZustandStore } from '../utils/helper'

interface RepoStoreState {
  repos: Record<string, DB_Repo>
}
export const useRepoStore = createZustandStore<RepoStoreState>('repo')(() => ({
  repos: {},
}))

const get = useRepoStore.getState
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
  }
}

export const RepoStoreActions = new RepoStoreActionsStatic()
