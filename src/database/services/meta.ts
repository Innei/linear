import { useNotificationStore } from '~/store/notification/store'

import { browserDB } from '../db'
import type { Hydratable } from './base'

export enum MetaKey {
  LastModified = 'last-modified',
}
interface MetaKeyMap {
  [MetaKey.LastModified]: string
}

class MetaServiceStatic implements Hydratable {
  public table = browserDB.meta

  async set<K extends MetaKey>(name: K, value: MetaKeyMap[K]) {
    await this.table.put({ name, value })
  }

  async get<K extends MetaKey>(name: K): Promise<MetaKeyMap[K] | undefined> {
    const value = await this.table.get(name)
    return value?.value
  }

  async hydrate() {
    const lastModified = await this.get(MetaKey.LastModified)
    if (lastModified) {
      useNotificationStore.setState((state) => ({
        ...state,
        lastModified: new Date(lastModified),
      }))
    }
  }
}

export const MetaService = new MetaServiceStatic()
