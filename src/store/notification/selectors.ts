import type { DB_Notification } from '~/database'

import { createSelectorHelper } from '../utils/helper'
import type { useNotificationStore } from './store'

type StoreState = ReturnType<typeof useNotificationStore.getState>

const defineSelector = createSelectorHelper<StoreState>()

export const selectNotificationLength = defineSelector(
  (state) => Object.keys(state.notifications).length,
)

export const selectSortedNotification = (
  filter?: (notification: DB_Notification) => boolean,
) =>
  defineSelector((state) => {
    let result = Object.values(state.notifications)
    if (filter) {
      result = result.filter((element) => filter(element))
    }
    return result.sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  })
