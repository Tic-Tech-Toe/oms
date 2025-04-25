import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OrderStatus = ({ status, setStatus }) => {
  const statuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <div className="flex flex-col gap-2 mt-5">
      <Label htmlFor="order-status" className="text-slate-600">
        {`Order Status`}
      </Label>

      <Select value={status} onValueChange={(value) => setStatus(value)}>
        <SelectTrigger className="rounded-xl h-12 px-4">
          <SelectValue placeholder="Select order status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {statuses.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrderStatus;
