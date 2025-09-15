// Add this import at the top
import { auth } from "@/app/config/firebase";
import { useToast } from "@/hooks/use-toast";
import { useOrderStore } from "@/hooks/zustand_stores/useOrderStore";
import { generateUniqueInvoiceNumber } from "@/utils/invoiceUtils";
import { Loader2 } from "lucide-react"; // Import a loading spinner icon
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface UpdateInvoiceProps {
  orderId: string;
  invoiceNumber: string;
}

const UpdateInvoice: React.FC<UpdateInvoiceProps> = ({ orderId, invoiceNumber }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newInvoice, setNewInvoice] = useState(invoiceNumber);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {updateOrder} = useOrderStore();
  const user = auth.currentUser;
  const userId = user?.uid;
  const { toast } = useToast();
  
  // This is the manual save handler (existing logic)
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
      setIsLoading(true);
      await updateOrder(userId || "", orderId, {invoiceNumber: newInvoice});
      setIsSaved(true);
      setIsEditing(false); // Exit editing mode
      toast({
        title: "Invoice Updated Successfully",
        description: `#${newInvoice} has been saved`,
        variant: "default",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Update Failed",
        description: "Could not update invoice. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This is the new function to automatically generate an ID
  const handleGenerateAndSave = async () => {
    if (!userId) {
      toast({
        title: "User not authenticated",
        description: "Please log in to generate an invoice.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      // Generate a new, unique invoice number using the Firebase transaction
      const generatedInvoice = await generateUniqueInvoiceNumber(userId);
      setNewInvoice(generatedInvoice); // Update the state with the new ID
      
      // Save the generated ID to Firestore
      await updateOrder(userId, orderId, { invoiceNumber: generatedInvoice });
      
      setIsSaved(true);
      setIsEditing(false); // Exit editing mode
      toast({
        title: "Invoice Generated & Saved",
        description: `#${generatedInvoice} has been automatically saved.`,
        variant: "default",
      });
      
    } catch (error) {
      console.error("Failed to generate and save invoice:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate invoice. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      
        <div className="flex gap-2">
            
            <Button
                size="sm"
                onClick={handleGenerateAndSave}
                disabled={isLoading}
                className="rounded-full px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700"
            >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Invoice"}
            </Button>
        </div>
      
    </div>
  );
};

export default UpdateInvoice;