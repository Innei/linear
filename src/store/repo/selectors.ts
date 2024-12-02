import type { DB_Repo } from '~/database'

import { createSelectorHelper } from '../utils/helper'
import type { useRepoStore } from './store'

type StoreState = ReturnType<typeof useRepoStore.getState>

const defineSelector = createSelectorHelper<StoreState>()

export const selectRepo = (id: number) =>
  defineSelector((state) => state.repos[id])

export const selectRepoList = defineSelector((state) => {
  const iterables = Object.values(state.repos)

  const repos = [] as Pick<
    DB_Repo,
    'id' | 'name' | 'full_name' | 'owner' | 'updated_at' | 'html_url'
  >[]
  for (const repo of iterables) {
    repos.push({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      owner: repo.owner,
      updated_at: repo.updated_at,
      html_url: repo.html_url,
    })
  }
  return repos
})
