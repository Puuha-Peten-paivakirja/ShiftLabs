import { useAuth } from '../hooks/useAuth.js'
import { UserContext } from './UserContext.js'
import LoadingScreen from '../screens/LoadingScreen.js'

export function UserProvider({children}) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  )
}
