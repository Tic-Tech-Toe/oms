//@ts-nocheck

'use client'

import { useEffect, useState } from 'react'
import { db } from '@/app/config/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role?: string
}

const AllUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<User, 'id'>)
        }))
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
      </div>
    )
  }

  if (!users.length) {
    return <p className="text-muted-foreground text-sm">No users found</p>
  }

  return (
    <div className="grid gap-4">
      {users.map((user) => {
        const isAdmin = user.email === ADMIN_EMAIL
        return (
          <div
            key={user.id}
            className="bg-card border rounded-xl p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium flex items-center gap-1">
                  {isAdmin && <span className="text-yellow-500">👑</span>}
                  {user.name}
                </h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AllUsers
