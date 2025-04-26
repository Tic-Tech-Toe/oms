import React, { useState } from "react";
import { Button } from "../ui/button"; // Assuming you have a Button component
import { Input } from "../ui/input"; // Assuming you have an Input component
import { CheckCircle } from "lucide-react"; // You can use your preferred icon library
import { useToast } from "@/hooks/use-toast";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { auth } from "@/app/config/firebase";

interface UpdateInvoiceProps {
  orderId: string;
  invoiceNumber: string;
}

const UpdateInvoice: React.FC<UpdateInvoiceProps> = ({ orderId, invoiceNumber }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInvoice, setNewInvoice] = useState(invoiceNumber);
  const [isSaved, setIsSaved] = useState(false);

  const {updateOrder} = useOrderStore();
  const user = auth.currentUser;
//   const userId= user.userId;
console.log(user)
const userId = user?.uid;
  const { toast } = useToast();
  

  const handleSave = async () => {
    if(newInvoice.trim() === ""){
        toast({
            title: "Invalid invoice",
            description: "Please enter a valid Invoice number",
            variant: "destructive",
          });
          return;
    }

    try {
        await updateOrder(userId || "", orderId, {invoiceNumber: newInvoice})
        setIsSaved(true)
        toast({
            title: "Invoice Updated Successfully",
            description: `#${newInvoice} has been saved`,
            variant: "default",
          });
    } catch (error) {
        toast({
          title: "Update Failed",
          description: "Could not update invoice. Try again.",
          variant: "destructive",
        });
      }
  };

  return (
    <div className="flex items-center gap-2">
      {!isEditing ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          className="rounded-full px-4 py-2 text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Add Invoice
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Input
            value={newInvoice}
            onChange={(e) => setNewInvoice(e.target.value)}
            className="rounded-full border-2 border-gray-300 focus:ring-2 focus:ring-primary transition-all duration-200"
            placeholder="Enter Invoice Number"
          />
          {newInvoice && !isSaved && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSave}
              className="rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-200"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateInvoice;
