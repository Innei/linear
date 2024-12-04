import type { DB_Repo } from '~/database'

import { selectRepo, selectRepoList } from './selectors'
import { useRepoStore } from './store'

export const useRepo = (id: number) => {
  return useRepoStore(selectRepo(id)) as Nullable<DB_Repo>
}

export const useRepoList = () => {
  return useRepoStore(selectRepoList) as DB_Repo[]
}
