import { browserDB } from '../db'

export enum MetaKey {
  LastModified = 'last-modified',
}
interface MetaKeyMap {
  [MetaKey.LastModified]: string
}

class MetaServiceStatic {
  public table = browserDB.meta

  async set<K extends MetaKey>(name: K, value: MetaKeyMap[K]) {
    await this.table.put({ name, value })
  }

  async get<K extends MetaKey>(name: K): Promise<MetaKeyMap[K] | undefined> {
    const value = await this.table.get(name)
    return value?.value
  }
}

export const MetaService = new MetaServiceStatic()
