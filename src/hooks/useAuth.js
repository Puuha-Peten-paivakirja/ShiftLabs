import { useState, useEffect } from 'react'
import { auth, onAuthStateChanged } from '../firebase/config'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setLoading(false)
      }
      else {
        setUser(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  return { user, loading }
}
