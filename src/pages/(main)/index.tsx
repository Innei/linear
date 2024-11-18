import { redirect } from 'react-router-dom'

export const Component = () => {
  return null
}

export const loader = () => {
  return redirect('/notifications/all')
}
