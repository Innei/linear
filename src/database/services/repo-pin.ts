import { repoPinAction } from '~/store/repo-pin/store'

import { browserDB } from '../db'
import type { DB_RepoPin } from '../schemas'
import type { Hydratable } from './base'

class RepoPinServiceStatic implements Hydratable {
  public table = browserDB.repoPin

  async hydrate() {
    const data = await this.table.toArray()
    repoPinAction.upsertMany(data)
  }

  async upsertMany(data: DB_RepoPin[]) {
    await this.table.bulkPut(data)
  }

  async deleteMany(ids: string[]) {
    await this.table.bulkDelete(ids)
  }
}

export const RepoPinService = new RepoPinServiceStatic()
