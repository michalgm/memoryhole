import { expect, renderHook, useAuth, waitFor } from '@redwoodjs/testing/web'
// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  currentUser: { email: 'foo@bar.com', name: 'Mr. FDoo', roles: 'User' },
})

const mockUser = async (currentUser) => {
  const { result } = renderHook(() => useAuth())
  mockCurrentUser(currentUser)
  await waitFor(() => expect(result.current.currentUser).toEqual(currentUser))
}

export default mockUser
