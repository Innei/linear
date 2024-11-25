import { redirect } from 'react-router'

export const Component = () => {
  return null
}

export const loader = () => {
  return redirect('/notifications/all')
}
