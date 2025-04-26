import { CustomerType, OrderType } from "@/types/orderType";

export function buildUpdatedCustomer(order: OrderType, newReward: number, redeem: boolean): CustomerType {
    const c = order.customer!;
    return {
      id: c.id,
      name: c.name,
      whatsappNumber: c.whatsappNumber,
      shippingAddress: c.shippingAddress,
      billingAddress: c.billingAddress,
      email: c.email,
      phoneNumber: c.phoneNumber,
      alternatePhoneNumber: c.alternatePhoneNumber,
      rewardPoint: (redeem ? 0 : c.rewardPoint ?? 0) + newReward,
    };
  }
  