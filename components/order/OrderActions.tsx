import { OrderType } from "@/types/orderType";
import {
  Copy,
  Delete,
  Edit,
  EllipsisVertical,
  MessageSquareShare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Row } from "@tanstack/react-table";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";

const OrderActions = ({ row }: { row: Row<OrderType> }) => {
  const { setSelectedOrder, setOpenEditDialog, openEditDialog } =
    useOrderStore();

  const menuItems = [
    { icon: <MessageSquareShare />, label: "Send", className: "" },
    { icon: <Copy />, label: "Copy", className: "" },
    { icon: <Edit />, label: "Edit", className: "" },
    {
      icon: <Delete className="text-lg" />,
      label: "Delete",
      className: "text-red-600",
    },
  ];

  async function handleClickedItem(item: string) {
    console.log(`Item clicked: ${item}`);
    if (item === "Edit") {
      console.log("Opening edit dialog...");
      setSelectedOrder(row.original);
      setOpenEditDialog(true);
      console.log(openEditDialog, row.original);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <EllipsisVertical className="h-4 w-4 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {menuItems.map((item, i) => (
          <DropdownMenuItem
            key={i}
            className={`flex items-center gap-2 p-[10px] ${item.className}`}
            onClick={() => handleClickedItem(item.label)}
          >
            {item.icon}
            <span>{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderActions;
