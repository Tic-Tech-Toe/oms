import { ItemType } from "@/types/orderType";

export const mockItemsData: ItemType[] = [
    {
      itemId: 'item001',
      name: 'Burger Boxes',
      price: 12.99, // Example price
      itemImage: '/products/burgerBox.webp',
      sku: 'BB-001', // Example SKU
      category: 'Packaging', // Example category
    },
    {
      itemId: 'item002',
      name: 'Clampshell Boxes',
      price: 9.49, // Example price
      itemImage: '/products/clampShell.png',
      sku: 'CSB-002', // Example SKU
      category: 'Packaging', // Example category
    },
    {
      itemId: 'item003',
      name: 'Plastic Container',
      price: 5.99, // Example price
      itemImage: '/products/plasticBoxes.png',
      sku: 'PC-003', // Example SKU
      category: 'Storage', // Example category
    },
    {
      itemId: 'item004',
      name: 'Roll Box',
      price: 15.49, // Example price
      itemImage: '/products/rollBox.png',
      sku: 'RB-004', // Example SKU
      category: 'Packaging', // Example category
    },
    {
      itemId: 'item005',
      name: 'Cling Roll',
      price: 8.99,
      itemImage: '/products/.png', // Assuming image is available for Cling Roll
      sku: 'CR-005', // Example SKU
      category: 'Packaging', // Example category
    },
  ];
  