import { Octokit } from 'octokit'

import { getGHToken } from '~/atoms/app'

export const octokit = new Octokit({
  auth: getGHToken(),
})
