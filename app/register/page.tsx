import { Suspense } from 'react'
import RegisterForm from './RegistrationForm'


export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
