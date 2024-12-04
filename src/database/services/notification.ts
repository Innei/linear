import type { components } from '@octokit/openapi-types'

import { NotificationStoreActions } from '~/store/notification/store'
import { RepoStoreActions } from '~/store/repo/store'

import type { BrowserDBTable } from '../db'
import { browserDB } from '../db'
import type { DB_Notification } from '../schemas'
import type { Hydratable } from './base'

class NotificationServiceStatic implements Hydratable {
  private table: BrowserDBTable<'notifications'>

  constructor() {
    this.table = browserDB.notifications
  }

  async hydrate(): Promise<void> {
    const notifications = await this.table.toArray()
    NotificationStoreActions.upsertMany(notifications)
  }

  async markRead(id: string) {
    await this.table.update(id, {
      unread: false,
      last_read_at: new Date().toISOString(),
    })
  }

  async upsertMany(data: components['schemas']['thread'][]) {
    const insertedData: DB_Notification[] = data.map(
      ({ repository, ...n }) => ({
        repositoryId: repository.id,
        ...n,
      }),
    )

    const repos = data.map(({ repository }) => repository)
    await Promise.all([
      this.table.bulkPut(insertedData),

      RepoStoreActions.upsertMany(repos),
    ])
    return insertedData
  }
}

export const NotificationService = new NotificationServiceStatic()
