import { App, Octokit } from 'octokit'

export const octokit = new Octokit({
  auth: import.meta.env.VITE_GH_TOKEN,
})
