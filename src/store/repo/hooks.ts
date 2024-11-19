import { selectRepo } from './selectors'
import { useRepoStore } from './store'

export const useRepo = (id: number) => {
  return useRepoStore(selectRepo(id))
}
