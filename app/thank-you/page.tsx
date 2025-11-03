import { Button } from '@/components/ui/button'
import { Clock, Mail, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
     <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-xl w-full bg-white p-10 md:p-12 rounded-2xl shadow-2xl border border-gray-100 text-center space-y-8 transform transition-all duration-300 hover:shadow-3xl">
        
        {/* Header Icon */}
        <div className="flex justify-center">
          <ShieldCheck className="w-16 h-16 text-[#4f46e5] opacity-90 p-2 bg-[#4f46e5]/10 rounded-full" />
        </div>

        {/* Title and main message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Thank You for Registering!
          </h1>
          <p className="text-xl text-gray-600">
            Your access request has been successfully submitted.
          </p>
        </div>

        {/* Status Box */}
        <div className="bg-blue-50 border-l-4 border-[#4f46e5] p-6 rounded-lg text-left shadow-inner">
          <div className="flex items-start space-x-4">
            <Clock className="w-6 h-6 text-[#4f46e5] flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Awaiting Administrator Approval
              </h2>
              <p className="text-gray-700 mt-1 text-sm">
                To keep ShipTrack secure, a system administrator needs to review and approve your submission. This usually takes less than 24 hours.
              </p>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="space-y-4 pt-2">
            <p className="text-md text-gray-700 font-semibold flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2 text-green-500" />
                We will notify you via email when your account is ready.
            </p>

            {/* FIX: Corrected Link usage to avoid potential compilation issues */}
            <Link href="/" passHref legacyBehavior> 
                <Button 
                    className="w-full sm:w-auto bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white transition-all duration-300 shadow-lg hover:shadow-xl py-6 px-10 rounded-xl text-lg"
                    size="lg"
                    
                >
                    Return to Homepage
                </Button>
            </Link>
        </div>

        <p className="text-xs text-gray-400 mt-6">
            If you have any questions, please check your invitation email for contact details.
        </p>

      </div>
    </div>
  )
}

export default page