import { issueAction } from '~/store/issue/store'

import { browserDB } from '../db'
import type { DB_Issue } from '../schemas'
import type { Hydratable } from './base'

class IssueServiceStatic implements Hydratable {
  public table = browserDB.issues

  async upsertMany(data: DB_Issue[]) {
    await this.table.bulkPut(data)
  }

  async hydrate() {
    const data = await this.table.toArray()
    issueAction.upsertMany(data)
  }
}

export const issueService = new IssueServiceStatic()
