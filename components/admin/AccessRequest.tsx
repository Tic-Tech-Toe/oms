'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { db } from '@/app/config/firebase'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from 'firebase/firestore'
import { useToast } from '@/hooks/use-toast'

interface AccessRequest {
  id: string
  name: string
  email: string
  company?: string
}

const AccessRequests = () => {
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchRequests = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'access_requests'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<AccessRequest, 'id'>)
      }))
      setRequests(data)
    } catch (error) {
      console.error('Failed to fetch access requests:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleApprove = async (req: AccessRequest) => {
    setProcessingId(req.id)
    try {
      // Add to `users` collection
      await setDoc(doc(db, 'users', req.id), {
        name: req.name,
        email: req.email,
        company: req.company || '',
        role: 'member', // or 'user'
        createdAt: new Date()
      })

      // Remove from access_requests
      await deleteDoc(doc(db, 'access_requests', req.id))

      // Update UI
      setRequests(prev => prev.filter(r => r.id !== req.id))

      toast({
        title: 'Access Approved ✅',
        description: `${req.name} has been added to users.`,
      })
    } catch (err) {
      console.error('Approval failed:', err)
      toast({
        title: 'Error ❌',
        description: 'Could not approve this request.',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setProcessingId(id)
    try {
      await deleteDoc(doc(db, 'access_requests', id))
      setRequests(prev => prev.filter(r => r.id !== id))
      toast({
        title: 'Request Rejected ❌',
        description: 'The access request has been removed.',
      })
    } catch (err) {
      console.error('Rejection failed:', err)
      toast({
        title: 'Error ❌',
        description: 'Could not reject this request.',
        variant: 'destructive',
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <Loader2 className="animate-spin w-5 h-5 text-muted-foreground" />
      </div>
    )
  }

  if (!requests.length) {
    return <p className="text-muted-foreground text-sm">No pending requests</p>
  }

  return (
    <div className="grid gap-4">
      {requests.map((req) => (
        <div
          key={req.id}
          className="bg-card border rounded-xl p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-lg font-medium">{req.name}</h4>
              {req.company && (
                <p className="text-sm text-muted-foreground mt-1">
                  {req.company}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                disabled={processingId === req.id}
                className="bg-green-500 hover:bg-green-600 text-white transition"
                onClick={() => handleApprove(req)}
              >
                {processingId === req.id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  'Approve'
                )}
              </Button>
              <Button
                size="sm"
                disabled={processingId === req.id}
                variant="outline"
                className="border-red-500 text-red-500 hover:border-2"
                onClick={() => handleReject(req.id)}
              >
                {processingId === req.id ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  'Reject'
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AccessRequests
