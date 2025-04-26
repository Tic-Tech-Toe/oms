import { User } from "lucide-react"
import { CustomerType } from "@/types/orderType"



export function OrderCustomerRel({ customer }: {customer: CustomerType}) {
  return (
    <>
      <div className="border-b-2 border-gray-300 py-4 text-5xl font-bold text-amber-400 flex flex-col items-center">
        <span className="font-bold text-center text-2xl text-dark-background dark:text-white">
          Rewards
        </span>
        <span>{customer.rewardPoint}</span>
      </div>
      <div className="mt-2">
        <span className="text-xl font-semibold">Customer</span>
        <div className="p-2">
          <div className="flex gap-2 items-center">
            <User size={14}/>
            <span className="text-sm text-gray-600 font-medium dark:text-gray-300">
              {customer.name}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}
