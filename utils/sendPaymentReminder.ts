import { auth } from "@/app/config/firebase";
import { fetchUserData } from "./user/fetchUseData";
import { useCustomerStore } from "@/hooks/zustand_stores/useCustomerStore";
import { useCurrency } from "@/hooks/useCurrency";
// import { useCustomerStore } from "@/store/useCustomerStore";

export async function handleSendPaymentReminder(order, dueDate) {
  const user = await fetchUserData(auth?.currentUser);
  // console.log(user.uid)
  const { rewardPercentage } = user;

  if (!order) {
    console.log("Order data is missing.");
    return;
  }

  const phoneNumber = order.customer?.whatsappNumber;
  if (!phoneNumber) {
    alert("Customer WhatsApp number is missing.");
    return;
  }

  const getCustomerById = useCustomerStore.getState().getCustomerById;
  const customer = await getCustomerById(user?.uid, order.customer.id);
  // console.log(customer)
  const rewardPoint = customer?.rewardPoint ?? 0;
  const rewardEarned = (order.totalAmount / 100) * (rewardPercentage ?? 10);

  const messageBody = [
    customer?.name || "Customer",
    `${ order.totalAmount.toFixed(2)  - (order?.payment?.totalPaid || 0)}`,
    order.invoiceNumber || order.id,
    dueDate || "N/A",
    `${rewardEarned}`,
    `${rewardPoint}`,
  ];

  // console.log(messageBody)

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
}
