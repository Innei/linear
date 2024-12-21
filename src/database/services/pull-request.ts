import { pullRequestAction } from '~/store/pull-request/store'

import { browserDB } from '../db'
import type { DB_PullRequest } from '../schemas'
import type { Hydratable } from './base'

class PullRequestServiceStatic implements Hydratable {
  public table = browserDB.pullRequests

  async upsertMany(data: DB_PullRequest[]) {
    await this.table.bulkPut(data)
  }

  async hydrate() {
    const data = await this.table.toArray()
    pullRequestAction.upsertMany(data)
  }
}

export const pullRequestService = new PullRequestServiceStatic()
