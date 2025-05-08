import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';
import { Order, OrderItem } from '@shared/arena-schema';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle, 
  Download, 
  Package, 
  Printer, 
  Receipt, 
  ShoppingBag, 
  Truck, 
  Share2 
} from 'lucide-react';

const ArenaOrderConfirmation = () => {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const orderId = parseInt(id || '0');

  // Fetch order data from API
  const { 
    data: orderData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['/api/arena/orders', orderId],
    queryFn: async () => {
      if (orderId <= 0) return null;
      const response = await fetch(`/api/arena/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return response.json();
    },
    enabled: orderId > 0,
  });

  // Extract order and orderItems from the API response
  const order = orderData as Order | null;
  const orderItems = orderData?.items as OrderItem[] || [];

  // Save order to localStorage when it loads
  useEffect(() => {
    if (order && !isLoading) {
      try {
        const existingOrders = JSON.parse(localStorage.getItem('arena_orders') || '[]');
        if (!existingOrders.some((o: any) => o.id === order.id)) {
          localStorage.setItem('arena_orders', JSON.stringify([...existingOrders, order]));
        }
        
        // Clear cart after successful order
        localStorage.removeItem('arena_cart_items');
      } catch (error) {
        console.error('Error saving order to localStorage:', error);
      }
    }
  }, [order, isLoading]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: `Order #${order?.orderNumber}`,
        text: `Check out my vehicle customization order from Premium Arena™`,
        url: window.location.href,
      })
      .catch((error) => {
        console.log('Error sharing:', error);
        toast({
          title: 'Sharing failed',
          description: 'Could not share this order',
          variant: 'destructive',
        });
      });
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast({
            title: 'Link copied to clipboard',
            description: 'You can now share this link with others',
          });
        })
        .catch(() => {
          toast({
            title: 'Copy failed',
            description: 'Could not copy the link to clipboard',
            variant: 'destructive',
          });
        });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent mb-4"></div>
          <h2 className="text-2xl font-bold">Loading your order...</h2>
        </div>
      </div>
    );
  }

  // Show error if order not found
  if (!order) {
    return (
      <div className="container max-w-4xl py-16">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn't find the order you're looking for</p>
          <Button asChild>
            <Link to="/arena-studio/premium">
              Return to Premium Arena™
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container max-w-4xl">
        {/* Header with Success Message */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your purchase and will begin processing it right away.
          </p>
        </div>
        
        {/* Order Info Card */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="border-b pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">Order #{order.orderNumber}</CardTitle>
                <CardDescription>
                  Placed on {new Intl.DateTimeFormat('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                  }).format(new Date(order.createdAt || new Date()))}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handleShareOrder}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
                <TabsTrigger value="summary">Order Summary</TabsTrigger>
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              
              {/* Order Summary Tab */}
              <TabsContent value="summary" className="p-6">
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">Your order is being prepared</p>
                      <p className="text-sm text-blue-700">
                        Estimated delivery by {new Intl.DateTimeFormat('en-IN', {
                          dateStyle: 'long'
                        }).format(new Date(order.estimatedDeliveryDate || new Date()))}
                      </p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Items ({orderItems.length})</h3>
                    <div className="space-y-4">
                      {orderItems.map((item) => (
                        <div key={item.id} className="flex gap-4">
                          {item.thumbnailUrl && (
                            <div className="h-20 w-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                              <img 
                                src={item.thumbnailUrl} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-sm">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-medium">
                                {formatCurrency(item.totalPrice || 0)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span>{formatCurrency(order.subtotal || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span>{formatCurrency(order.shipping || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Tax (18% GST)</span>
                        <span>{formatCurrency(order.tax || 0)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount</span>
                          <span>-{formatCurrency(order.discount || 0)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span className="text-lg">{formatCurrency(order.totalAmount || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Tracking Tab */}
              <TabsContent value="tracking" className="p-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-center text-gray-600">
                      Tracking information will be available once your order ships.
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-medium text-gray-900">Order Status</h3>
                    <p className="text-sm text-gray-500">Your order is currently being processed</p>
                  </div>
                  
                  {/* Order Timeline */}
                  <div className="relative">
                    <div className="absolute top-0 left-[9px] bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-8">
                      {/* Order Placed Step */}
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-green-500 border-4 border-green-100 flex items-center justify-center"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Order Placed</h4>
                          <p className="text-sm text-gray-500">
                            {new Intl.DateTimeFormat('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            }).format(new Date(order.createdAt || new Date()))}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Your order has been confirmed and is being processed
                          </p>
                        </div>
                      </div>
                      
                      {/* Processing Step */}
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-gray-300 border-4 border-gray-100 flex items-center justify-center"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Processing Order</h4>
                          <p className="text-sm text-gray-500">Estimated: Within 48 hours</p>
                          <p className="text-sm text-gray-500 mt-1">
                            We're preparing your order and gathering all items
                          </p>
                        </div>
                      </div>
                      
                      {/* Shipping Step */}
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-gray-300 border-4 border-gray-100 flex items-center justify-center"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Shipping</h4>
                          <p className="text-sm text-gray-500">Estimated: In 3-5 days</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Your order will be shipped via {order.paymentMethod === 'cod' ? 'standard delivery' : 'express shipping'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Delivery Step */}
                      <div className="relative pl-6">
                        <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-gray-300 border-4 border-gray-100 flex items-center justify-center"></div>
                        <div>
                          <h4 className="font-medium text-gray-900">Delivery</h4>
                          <p className="text-sm text-gray-500">
                            Estimated: {new Intl.DateTimeFormat('en-IN', {
                              dateStyle: 'long'
                            }).format(new Date(order.estimatedDeliveryDate || new Date()))}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Your order will be delivered to your shipping address
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Details Tab */}
              <TabsContent value="details" className="p-6">
                <div className="space-y-6">
                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-medium">{order.shippingAddress?.name}</p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress?.street}<br />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                        {order.shippingAddress?.country}<br />
                        {order.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Payment Information</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-medium">
                        {order.paymentMethod === 'credit_card' && 'Credit Card'}
                        {order.paymentMethod === 'bank_transfer' && 'Net Banking'}
                        {order.paymentMethod === 'upi' && 'UPI Payment'}
                        {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.paymentMethod === 'credit_card' && 'Card ending in ****'}
                        {order.paymentMethod === 'bank_transfer' && 'Payment through net banking'}
                        {order.paymentMethod === 'upi' && 'UPI transaction'}
                        {order.paymentMethod === 'cod' && 'Payment will be collected upon delivery'}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Total Amount: {formatCurrency(order.totalAmount || 0)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  {order.notes && (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Order Notes</h3>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" size="sm" asChild>
              <Link to="/arena-studio/premium">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Premium Arena™
              </Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard-enhanced">
                <ShoppingBag className="h-4 w-4 mr-2" />
                View All Orders
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Support Section */}
        <div className="text-center py-6">
          <h3 className="font-medium text-gray-900 mb-2">Need help with your order?</h3>
          <p className="text-sm text-gray-500 mb-4">Our customer support team is here to help you</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
            <Button variant="outline" size="sm">
              FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaOrderConfirmation;