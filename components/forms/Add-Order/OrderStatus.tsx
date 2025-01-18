import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrderStatus = ({status, setStatus}) => {
  const statuses = ["pending" , "processing" , "shipped" , "delivered" , "cancelled"]
 

  return (
    <div className="mt-5 flex flex-col gap-2 ">
      <Label htmlFor="customer-name" className="text-slate-600">
        {`Order Status`}
      </Label>
      
        <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger>
                <SelectValue placeholder="Select order status" />
            </SelectTrigger>
                <SelectContent>
                {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                        {s}
                    </SelectItem>
                ))}
                </SelectContent>
            
        </Select>
      </div>
    
   )}

   export default OrderStatus;

 
   
