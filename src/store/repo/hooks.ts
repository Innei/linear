import { selectRepo, selectRepoList } from './selectors'
import { useRepoStore } from './store'

export const useRepo = (id: number) => {
  return useRepoStore(selectRepo(id))
}

export const useRepoList = () => {
  return useRepoStore(selectRepoList)
}
