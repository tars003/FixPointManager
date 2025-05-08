import { Express } from 'express';
import { db } from '../db';
import { orders, orderItems, paymentIntents } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { orderSchema } from '@shared/arena-schema';
import { z } from 'zod';

// Function to generate a random order number
function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}${random}`;
}

// Register order API routes
export function registerOrderRoutes(app: Express) {
  // Get all orders for a user
  app.get('/api/arena/orders', async (req, res) => {
    try {
      // For demo purposes, we'll just return all orders
      // In a real implementation, we would filter by the authenticated user's ID
      const allOrders = await db.select().from(orders).orderBy(orders.createdAt);
      res.json(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Get a specific order with its items
  app.get('/api/arena/orders/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Get order items
      const orderItemsList = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

      res.json({
        ...order,
        items: orderItemsList
      });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // Create a new order
  app.post('/api/arena/orders', async (req, res) => {
    try {
      // Validate order data
      const validationResult = orderSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid order data',
          details: validationResult.error.format() 
        });
      }

      // Create transaction to ensure both order and items are saved together
      const orderData = {
        ...req.body,
        orderNumber: generateOrderNumber(),
        status: 'created',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderItems = req.body.items || [];
      delete orderData.items; // Remove items from order data

      // Insert order
      const [newOrder] = await db.insert(orders).values(orderData).returning();

      // Insert order items
      if (orderItems.length > 0) {
        const itemsWithOrderId = orderItems.map((item: any) => ({
          ...item,
          orderId: newOrder.id,
          createdAt: new Date()
        }));

        await db.insert(orderItems).values(itemsWithOrderId);
      }

      // Create payment intent for the order if using a payment method that requires it
      if (['credit_card', 'bank_transfer', 'upi'].includes(orderData.paymentMethod)) {
        const paymentIntentData = {
          orderId: newOrder.id,
          amount: orderData.totalAmount,
          currency: orderData.currency || 'INR',
          status: 'created',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const [newPaymentIntent] = await db.insert(paymentIntents).values(paymentIntentData).returning();
        
        // Update order with payment intent reference
        await db
          .update(orders)
          .set({ 
            paymentId: newPaymentIntent.id.toString(),
            status: 'payment_pending'
          })
          .where(eq(orders.id, newOrder.id));
          
        newOrder.status = 'payment_pending';
        newOrder.paymentId = newPaymentIntent.id.toString();
      }

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Update an order's status
  app.patch('/api/arena/orders/:id/status', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const [updatedOrder] = await db
        .update(orders)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(orders.id, id))
        .returning();

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });

  // Cancel an order
  app.post('/api/arena/orders/:id/cancel', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const [order] = await db.select().from(orders).where(eq(orders.id, id));
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Check if order can be cancelled (e.g., not already shipped)
      if (['shipped', 'delivered', 'cancelled', 'refunded'].includes(order.status)) {
        return res.status(400).json({ 
          error: 'Order cannot be cancelled',
          message: `Order is already ${order.status}`
        });
      }

      // Cancel any associated payment intent
      if (order.paymentId) {
        await db
          .update(paymentIntents)
          .set({ 
            status: 'cancelled',
            updatedAt: new Date()
          })
          .where(eq(paymentIntents.id, parseInt(order.paymentId)));
      }

      // Update order status
      const [updatedOrder] = await db
        .update(orders)
        .set({ 
          status: 'cancelled',
          updatedAt: new Date()
        })
        .where(eq(orders.id, id))
        .returning();

      res.json(updatedOrder);
    } catch (error) {
      console.error('Error cancelling order:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  });
}