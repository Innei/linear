import type { DB_Notification, DB_PullRequest } from '~/database'
import { pullRequestService } from '~/database/services/pull-request'
import { octokit } from '~/lib/octokit'
import { queryClient } from '~/lib/query-client'

import { createZustandStore } from '../utils/helper'
import { AsyncQueue } from '../utils/queue'

interface PullRequestStoreState {
  pullRequests: Record<string, DB_PullRequest>
}

export const usePullRequestStore = createZustandStore<PullRequestStoreState>(
  'pullRequest',
)(() => ({
  pullRequests: {},
}))

const set = usePullRequestStore.setState
const get = usePullRequestStore.getState

class PullRequestStoreActionStatic {
  upsertMany(data: DB_PullRequest[]) {
    const current = get().pullRequests
    const newPullRequests = data.reduce(
      (acc, pr) => {
        acc[pr.id] = pr
        return acc
      },
      {} as Record<string, DB_PullRequest>,
    )

    set(() => {
      return {
        pullRequests: { ...current, ...newPullRequests },
      }
    })
  }

  collect(notifications: DB_Notification[]) {
    const tasks = [] as {
      owner: string
      repo: string
      pull_number: number
    }[]

    for (const item of notifications) {
      const { type } = item.subject
      if (type !== 'PullRequest') continue

      const { url } = item.subject
      const { pathname } = new URL(url)
      const [, , owner, repo, , pull_number] = pathname.split('/')

      tasks.push({
        owner,
        repo,
        pull_number: +pull_number,
      })
    }

    pullRequestRequest.fetchByIds(tasks)
  }
}

export const pullRequestAction = new PullRequestStoreActionStatic()

class PullRequestRequestStatic {
  private q = new AsyncQueue(10)

  fetchByIds(data: { owner: string; repo: string; pull_number: number }[]) {
    this.q.addMultiple(
      data.map(({ owner, repo, pull_number }) => async () => {
        const res = await queryClient.fetchQuery({
          queryKey: ['pullRequests', owner, repo, pull_number],
          queryFn: () => octokit.rest.pulls.get({ owner, repo, pull_number }),
          staleTime: 1000 * 60 * 10,
        })

        pullRequestAction.upsertMany([res.data])
        pullRequestService.upsertMany([res.data])
      }),
    )
  }

  async fetchById({
    owner,
    repo,
    pull_number,
  }: {
    owner: string
    repo: string
    pull_number: number
  }) {
    const res = await octokit.rest.pulls.get({ owner, repo, pull_number })
    pullRequestAction.upsertMany([res.data])
    pullRequestService.upsertMany([res.data])
    return res.data
  }
}

export const pullRequestRequest = new PullRequestRequestStatic()
