import { useRepoStore } from './store'

export const getRepoById = (id: number) => {
  return useRepoStore.getState().repos[id]
}
