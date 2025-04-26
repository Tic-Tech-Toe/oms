import { auth } from "@/app/config/firebase";
import { fetchUserData } from "./user/fetchUseData";
import { useToast } from "@/hooks/use-toast";


export async function  handleSendPaymentReminder(order,dueDate){
  const user  =  await fetchUserData(auth?.currentUser)
//   const { toast } = useToast();
  const { rewardPercentage } = user
    if (!order) {
      console.log("Order data is missing.");
      return;
    }

    const phoneNumber = order.customer?.whatsappNumber;

    if (!phoneNumber) {
      alert("Customer WhatsApp number is missing.");
      return;
    }

    const messageBody = [
      order.customer?.name || "Customer",
      `${(order.totalAmount - (order?.payment?.totalPaid || 0))}`,
      order.invoiceNumber || order.id,
      dueDate || "N/A", // Due date
      `${(order.totalAmount/100)*rewardPercentage || 0}`, // Reward point that will be earned
      `${order.customer.rewardPoint}`, // Customer's current reward point
    ];

    try {
      const res = await fetch("/api/payment-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, messageBody }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Payment reminder sent successfully!");
      } else {
        alert("❌ Failed to send reminder: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong while sending the reminder.");
    }
  };