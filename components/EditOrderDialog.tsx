import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useOrderStore } from '@/hooks/useOrderStore';
import { OrderType } from '@/types/orderType';
import { useState, useEffect } from 'react';

const EditOrderDialog = () => {
  const { selectedOrder, openEditDialog, setOpenEditDialog, setSelectedOrder, updateOrder } = useOrderStore();

  if (!selectedOrder) return null;

  // Use local state to keep track of changes
  const [edits, setEdits] = useState<OrderType>(selectedOrder);

  // Sync local edits with selectedOrder when it changes in the store
  useEffect(() => {
    if (selectedOrder) {
      setEdits(selectedOrder); // Set the local state when selectedOrder is available
    }
  }, [selectedOrder]);

  // Handle change of order status in the select dropdown
  const handleChange = (field: keyof OrderType, value: any) => {
    setEdits((prevEdits) => ({
      ...prevEdits,
      [field]: value, // Update the status in local state
    }));
  };

  // Function to handle API call when order status is 'delivered'
  const sendOrderDeliveredMessageHandler = async () => {
    const { id, customer, totalAmount } = edits;
  
    if (!customer || !customer.whatsappNumber || !id || !totalAmount || !customer.name) {
      console.error('Missing required fields for order delivery message');
      return;
    }
  
    const messageBody = [
      customer.name,    // Customer's name
      id,               // Order ID
      `$${totalAmount}`, // Total amount
    ];
  
    try {
      const response = await fetch('/api/order-delivered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.whatsappNumber,
          orderId: id,
          customerName: customer.name,
          totalAmount: totalAmount,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('WhatsApp message sent successfully');
      } else {
        console.error('Failed to send WhatsApp message', result.message);
      }
    } catch (error) {
      console.error('Error while sending order delivered message:', error);
    }
  };

  // Function to handle API call when order status is 'shipped' (out for delivery)
  const sendOutForDeliveryMessageHandler = async () => {
    const { customer, totalAmount } = edits;

    if (!customer || !customer.whatsappNumber || !totalAmount || !customer.name) {
      console.error('Missing required fields for out for delivery message');
      return;
    }

    // Here, we assume that the delivery window will be passed as a string, e.g., "1-5 PM"
    const deliveryWindow = "1-5 PM";  // Example value, you could get this dynamically from your order data

    try {
      const response = await fetch('/api/order-out-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.whatsappNumber,
          customerName: customer.name,
          deliveryWindow,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Out for delivery WhatsApp message sent successfully');
      } else {
        console.error('Failed to send out for delivery message', result.message);
      }
    } catch (error) {
      console.error('Error while sending out for delivery message:', error);
    }
  };

  // Function to handle API call when order status is 'processing'
  const sendOrderProcessingMessageHandler = async () => {
    const { id, customer, orderDate } = edits;

    if (!customer || !customer.whatsappNumber || !id || !orderDate || !customer.name) {
      console.error('Missing required fields for order processing message');
      return;
    }

    const messageBody = [
      customer.name,    // Customer's name
      id,               // Order ID
      orderDate,        // Order date (e.g., "20th Jan 2025")
    ];

    try {
      const response = await fetch('/api/order-processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: customer.whatsappNumber,
          customerName: customer.name,
          orderId: id,
          orderDate: orderDate,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log('Order processing message sent successfully');
      } else {
        console.error('Failed to send order processing message', result.message);
      }
    } catch (error) {
      console.error('Error while sending order processing message:', error);
    }
  };

  // Save changes and update the order in the store
  const handleSave = () => {
    if (edits) {
      updateOrder(edits.id, edits); // Update the global store with the new data
      setSelectedOrder(edits); // Update the selected order in the store
      console.log('Updated order:', edits); // Log the changes for debugging

      // If the status is "delivered", send the WhatsApp message
      if (edits.status === 'delivered') {
        sendOrderDeliveredMessageHandler();
      }

      // If the status is "shipped", send the Out for Delivery message
      if (edits.status === 'shipped') {
        sendOutForDeliveryMessageHandler();
      }

      // If the status is "processing", send the Order Processing message
      if (edits.status === 'processing') {
        sendOrderProcessingMessageHandler();
      }

      setOpenEditDialog(false); // Close the dialog after saving
    }
  };

  return (
    <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
      <DialogContent>
        <DialogTitle>Edit Order</DialogTitle>

        {/* Display Order Details */}
        <div className="space-y-4 mt-6">
          <div>
            <h3 className="font-semibold text-lg">Order Details</h3>
            <div className="space-y-2">
              <p><strong>Order ID:</strong> {selectedOrder.id}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer.name}</p>
              <p><strong>WhatsApp Number:</strong> {selectedOrder.customer.whatsappNumber}</p>
              <p><strong>Total Amount:</strong> ₹ {selectedOrder.totalAmount.toFixed(2)}</p>
              <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus || 'Not specified'}</p>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-2">
            <label className="block">Order Status</label>
            <select
              className="w-full p-2 border rounded-md"
              value={edits.status} // Bind the select field to the edited order
              onChange={(e) => handleChange('status', e.target.value)} // Update the status in local state
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
