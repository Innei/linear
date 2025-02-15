import type { DB_RepoPin } from '~/database'
import { RepoPinService } from '~/database/services/repo-pin'

import { createImmerSetter, createZustandStore } from '../utils/helper'

type RepoId = number
export interface RepoPinState {
  data: Record<RepoId, DB_RepoPin>
  order: RepoId[]
}
export const useRepoPinStore = createZustandStore<RepoPinState>('repoPin')(
  () => {
    return {
      data: {},
      order: [],
    }
  },
)

const get = useRepoPinStore.getState
const immerSet = createImmerSetter(useRepoPinStore)
class RepoPinAction {
  upsertMany(data: DB_RepoPin[]) {
    immerSet((draft) => {
      for (const item of data) {
        draft.data[item.id] = item
      }

      const newOrderId = Object.values(draft.data)
        .sort((a, b) => a.order - b.order)
        .map((i) => i.id)
      draft.order = newOrderId
    })
  }

  pinRepo(id: RepoId) {
    immerSet((draft) => {
      const index = draft.order.indexOf(id)
      if (index !== -1) {
        return
      }
      draft.order.push(id)
      draft.data[id] = {
        createdAt: new Date(),
        id,
        order: draft.order.length,
      }
    })
    RepoPinService.upsertMany(Object.values(get().data))
  }

  unPinRepo(id: RepoId) {
    immerSet((draft) => {
      const index = draft.order.indexOf(id)
      if (index === -1) {
        return
      }

      draft.order.splice(index, 1)
      delete draft.data[id]

      const list = Object.values(draft.data)
      for (const [i, element] of list.entries()) {
        const { id } = element
        draft.data[id].order = i
      }
    })
    RepoPinService.deleteMany([id.toString()])
  }

  reorder(id: RepoId, index: number) {
    immerSet((draft) => {
      const oldIndex = draft.order.indexOf(id)
      if (oldIndex === -1) return

      // Remove from old position and insert at new position
      draft.order.splice(oldIndex, 1)
      draft.order.splice(index, 0, id)

      // Update order numbers for all items
      const list = Object.values(draft.data)
      for (const [i, element] of list.entries()) {
        draft.data[element.id].order = i
      }
    })
    RepoPinService.upsertMany(Object.values(get().data))
  }
}

export const repoPinAction = new RepoPinAction()
