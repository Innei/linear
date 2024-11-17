import type { components } from '@octokit/openapi-types'

import { browserDB } from '../db'
import type { DB_Repo } from '../schemas'
import type { Hydratable } from './base'
import { BaseService } from './base'

class RepoServiceStatic extends BaseService<DB_Repo> implements Hydratable {
  constructor() {
    super(browserDB.repos)
  }

  async hydrate(): Promise<void> {
    // const repos = await getRepos()
  }

  async upsert(
    data: components['schemas']['minimal-repository'],
  ): Promise<unknown> {
    return super.upsert(data)
  }
}

export const RepoService = new RepoServiceStatic()
