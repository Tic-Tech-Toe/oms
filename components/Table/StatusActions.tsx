//@ts-nocheck

import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { OrderType } from "@/types/orderType";
import { Row } from "@tanstack/react-table";
import { useState } from "react";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const StatusActions = ({
  row,
  field,
  statuses,
  getStatusBadgeClass,
  isEditing,
}: {
  row: Row<OrderType>;
  field: "status" | "paymentStatus";
  statuses: string[];
  getStatusBadgeClass: (status: string) => string;
  isEditing: boolean;
}) => {
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const [selectedStatus, setSelectedStatus] = useState(
    row.original[field] || statuses[0]
  );
  const [open, setOpen] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    updateOrder(row.original.id, { [field]: newStatus });
    setOpen(false);
  };

  return (
    <div className="flex items-center justify-between md:w-2/3 space-x-1">
      <Badge
        className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(selectedStatus)}`}
      >
        {selectedStatus}
      </Badge>

      {isEditing && (
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <ChevronDown size={16} className="cursor-pointer" />
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 z-[50]">
            <DropdownMenuRadioGroup
              value={selectedStatus}
              onValueChange={handleStatusChange}
            >
              {statuses.map((status) => (
                <DropdownMenuRadioItem key={status} value={status}>
                  <Badge
                    className={`rounded-full font-normal select-none shadow-none ${getStatusBadgeClass(status)}`}
                  >
                    {status}
                  </Badge>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};


export default StatusActions;
