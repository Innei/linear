import { setUser } from '~/atoms/user'
import { octokit } from '~/lib/octokit'

import { browserDB } from '../db'
import type { DB_User } from '../schemas'
import type { Hydratable } from './base'
import { BaseService } from './base'

class UserServiceStatic extends BaseService<DB_User> implements Hydratable {
  constructor() {
    super(browserDB.user)
  }

  async fetchMe() {
    const { data } = await octokit.rest.users.getAuthenticated()
    await this.upsert({
      avatarUrl: data.avatar_url,
      id: data.id,
      isMe: 1,
      login: data.login,
      name: data.name ?? data.login,
    })
    this.hydrate()
    return data
  }

  async upsertMany(users: DB_User[]) {
    return super.upsertMany(users)
  }

  async hydrate(): Promise<void> {
    const users = await this.table.where('isMe').equals(1).toArray()

    if (users[0]) {
      setUser(users[0])
    }
  }
}

export const UserService = new UserServiceStatic()
