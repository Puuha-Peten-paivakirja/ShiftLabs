import { useState, useEffect } from 'react'
import { auth, onAuthStateChanged } from '../firebase/config'

export function useAuth() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      }
      else {
        setUser(null)
      }
    })

    return unsubscribe
  }, [])

  return { user }
}
