import { useOrderStore } from "@/hooks/useOrderStore";
import { OrderType } from "@/types/orderType";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


const StatusActions = ({
  row,
  field,
  statuses,
  getStatusBadgeClass,
}: {
  row: Row<OrderType>;
  field: "status" | "paymentStatus"; // Specify the field being updated
  statuses: string[]; // Possible status values
  getStatusBadgeClass: (status: string) => string; // Function to get class names
}) => {
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const [selectedStatus, setSelectedStatus] = useState(row.original[field] || statuses[0]);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus); // Immediate UI feedback
    updateOrder(row.original.id, { [field]: newStatus }); // ✅ Update Zustand store
  };

  return (
    <div className="flex items-center  justify-between md:w-2/3 space-x-1">
      <Badge className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(selectedStatus)}`}>
        {selectedStatus}
      </Badge>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <ChevronDown size={16} className="cursor-pointer" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup value={selectedStatus} onValueChange={handleStatusChange}>
            {statuses.map((status) => (
              <DropdownMenuRadioItem key={status} value={status}>
                <Badge className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(status)}`}>
                  {status}
                </Badge>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatusActions