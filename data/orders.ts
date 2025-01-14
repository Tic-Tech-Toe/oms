export type Order = {
    id: string;                     
    customerId: string; 
    orderDate: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    totalAmount: number;          
    paymentStatus: "pending" | "paid" | "failed" | "refunded"; 
    shippingAddress: string;        
    billingAddress: string;   
    items: OrderItem[]; 
    paymentMethod?: "credit card" | "UPI" | "bank transfer" | "cash on delivery"; 
    trackingNumber?: string;       
    shippingDate?: string;        
    estimatedDeliveryDate?: string;
    deliveredDate?: string;        
    cancelationDate?: string;      
    createdAt: string;             
    updatedAt: string;            
  };

  // Mock order data
export const orders: Order[] = [
    {
      id: "ord001",
      customerId: "1",
      orderDate: "2025-01-01",
      status: "pending",
      totalAmount: 35,
      paymentStatus: "pending",
      shippingAddress: "123, Main Street, City A",
      billingAddress: "123, Main Street, City A",
      items: [
        {
          productId: "1", // Burger Boxes
          quantity: 2,
          price: 10,
          total: 20,
          name: "Burger Boxes",
          sku: "BB001",
          category: "Packaging",
        },
        {
          productId: "2", // Clampshell Boxes
          quantity: 1,
          price: 15,
          total: 15,
          name: "Clampshell Boxes",
          sku: "CSB001",
          category: "Packaging",
        },
      ],
      paymentMethod: "credit card",
      trackingNumber: "TRK123456789",
      shippingDate: "2025-01-03",
      estimatedDeliveryDate: "2025-01-10",
      createdAt: "2025-01-01T10:00:00Z",
      updatedAt: "2025-01-01T10:00:00Z",
    },
    {
      id: "ord002",
      customerId: "2",
      orderDate: "2025-01-02",
      status: "shipped",
      totalAmount: 20,
      paymentStatus: "paid",
      shippingAddress: "456, Secondary Road, City B",
      billingAddress: "456, Secondary Road, City B",
      items: [
        {
          productId: "3", // Plastic Containers
          quantity: 4,
          price: 5,
          total: 20,
          name: "Plastic Containers",
          sku: "PC001",
          category: "Containers",
        },
      ],
      paymentMethod: "UPI",
      trackingNumber: "TRK987654321",
      shippingDate: "2025-01-04",
      estimatedDeliveryDate: "2025-01-12",
      createdAt: "2025-01-02T09:00:00Z",
      updatedAt: "2025-01-02T09:00:00Z",
    },
    {
      id: "ord003",
      customerId: "3",
      orderDate: "2025-01-03",
      status: "delivered",
      totalAmount: 45,
      paymentStatus: "paid",
      shippingAddress: "789, Tertiary Lane, City C",
      billingAddress: "789, Tertiary Lane, City C",
      items: [
        {
          productId: "1", // Burger Boxes
          quantity: 3,
          price: 10,
          total: 30,
          name: "Burger Boxes",
          sku: "BB001",
          category: "Packaging",
        },
        {
          productId: "2", // Clampshell Boxes
          quantity: 1,
          price: 15,
          total: 15,
          name: "Clampshell Boxes",
          sku: "CSB001",
          category: "Packaging",
        },
      ],
      paymentMethod: "cash on delivery",
      trackingNumber: "TRK456789012",
      shippingDate: "2025-01-05",
      deliveredDate: "2025-01-07",
      createdAt: "2025-01-03T11:30:00Z",
      updatedAt: "2025-01-07T14:00:00Z",
    },
    {
      id: "ord004",
      customerId: "4",
      orderDate: "2025-01-05",
      status: "processing",
      totalAmount: 25,
      paymentStatus: "failed",
      shippingAddress: "101, Quaternary Blvd, City D",
      billingAddress: "101, Quaternary Blvd, City D",
      items: [
        {
          productId: "3", // Plastic Containers
          quantity: 5,
          price: 5,
          total: 25,
          name: "Plastic Containers",
          sku: "PC001",
          category: "Containers",
        },
      ],
      paymentMethod: "bank transfer",
      trackingNumber: "TRK1122334455",
      shippingDate: "2025-01-06",
      estimatedDeliveryDate: "2025-01-13",
      createdAt: "2025-01-05T08:00:00Z",
      updatedAt: "2025-01-05T08:30:00Z",
    },
  ];
  
  export type OrderItem = {
    productId: string;             
    quantity: number;              
    price: number;                 
    total: number;                 
    name: string;                 
    sku?: string;                   
    category?: string;              
  };
  