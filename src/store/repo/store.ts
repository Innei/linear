import type { DB_Repo } from '~/database/schemas'
import { RepoService } from '~/database/services/repo'
import { octokit } from '~/lib/octokit'

import { createZustandStore } from '../utils/helper'
import { AsyncQueue } from '../utils/queue'

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

class RepoRequestStatic {
  private q = new AsyncQueue(10)
  fetchByIds(data: { owner: string; repo: string }[]) {
    this.q.addMultiple(
      data.map(
        ({ owner, repo }) =>
          () =>
            octokit.rest.repos.get({ owner, repo }),
      ),
    )
  }
}

export const repoRequest = new RepoRequestStatic()

export const RepoStoreActions = new RepoStoreActionsStatic()
