import { useAuth } from '../hooks/useAuth.js'
import { UserContext } from './UserContext.js'

export function UserProvider({children}) {
  const { user } = useAuth()

  return (
    <UserContext.Provider value={{user}}>
      {children}
    </UserContext.Provider>
  )
}
