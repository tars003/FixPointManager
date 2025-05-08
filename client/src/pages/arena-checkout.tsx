import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/formatters';
import { Order, OrderItem, CustomizationProject, VehicleModelData, CustomizationPartData } from '@shared/arena-schema';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart, 
  CheckCircle2, 
  ChevronLeft, 
  CreditCard, 
  Loader2, 
  Package, 
  ShoppingBag, 
  ShoppingCart, 
  Truck
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Form validation schema
const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.object({
    street: z.string().min(2, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
  }),
  billingAddressSameAsShipping: z.boolean().default(true),
  billingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'upi', 'cod']),
  notes: z.string().optional(),
  terms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

// Shipping method options
const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 500, deliveryTime: '3-5 business days' },
  { id: 'express', name: 'Express Shipping', price: 1200, deliveryTime: '1-2 business days' },
  { id: 'premium', name: 'Premium Shipping', price: 2000, deliveryTime: 'Next day delivery' }
];

// Main component
const ArenaCheckout = () => {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartItems, setCartItems] = useState<CustomizationPartData[]>([]);
  const [selectedProject, setSelectedProject] = useState<CustomizationProject | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModelData | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(shippingMethods[0]);
  
  // Default form values
  const defaultValues: Partial<CheckoutFormValues> = {
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
    },
    billingAddressSameAsShipping: true,
    paymentMethod: 'credit_card',
    terms: false,
  };

  // Form setup
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues,
  });

  // Get cart items from localStorage on mount
  useEffect(() => {
    try {
      const storedCartItems = localStorage.getItem('arena_cart_items');
      if (storedCartItems) {
        setCartItems(JSON.parse(storedCartItems));
      }

      const storedProject = localStorage.getItem('arena_current_project');
      if (storedProject) {
        setSelectedProject(JSON.parse(storedProject));
      }

      const storedVehicle = localStorage.getItem('arena_selected_vehicle');
      if (storedVehicle) {
        setSelectedVehicle(JSON.parse(storedVehicle));
      }
    } catch (error) {
      console.error('Error loading cart data:', error);
    }
  }, []);

  // Calculate prices
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price || 0), 0) + (selectedVehicle?.basePrice || 0);
  const shippingCost = selectedShippingMethod.price;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shippingCost + tax;

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(
        'POST',
        '/api/arena/orders',
        data
      );
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/arena/orders'] });
      toast({
        title: 'Order placed successfully!',
        description: `Your order #${data.orderNumber} has been created.`,
      });
      
      // Clear cart and redirect
      localStorage.removeItem('arena_cart_items');
      setLocation(`/arena-order-confirmation/${data.id}`);
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      toast({
        title: 'Failed to create order',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
      setIsProcessing(false);
    },
  });

  // Submit handler
  const onSubmit = (values: CheckoutFormValues) => {
    setIsProcessing(true);
    
    // Prepare order items
    const orderItems: Partial<OrderItem>[] = [
      // Add vehicle as order item if selected
      ...(selectedVehicle ? [{
        itemType: 'vehicle' as const,
        itemId: selectedVehicle.id as number,
        name: `${selectedVehicle.manufacturer} ${selectedVehicle.name}`,
        description: `Base vehicle - ${selectedVehicle.year}`,
        quantity: 1,
        unitPrice: selectedVehicle.basePrice || 0,
        totalPrice: selectedVehicle.basePrice || 0,
        thumbnailUrl: selectedVehicle.thumbnailUrl,
      }] : []),
      
      // Add customization parts
      ...cartItems.map(part => ({
        itemType: 'part' as const,
        itemId: part.id as number,
        name: part.name,
        description: `${part.category} - ${part.subcategory}`,
        quantity: 1,
        unitPrice: part.price || 0,
        totalPrice: part.price || 0,
        thumbnailUrl: part.thumbnailUrl,
      })),
    ];
    
    // Create order object
    const orderData = {
      userId: 1, // We'll use a placeholder user ID for the sample
      projectId: selectedProject?.id,
      subtotal: subtotal,
      tax: tax,
      shipping: shippingCost,
      discount: 0,
      totalAmount: total,
      currency: 'INR',
      paymentMethod: values.paymentMethod,
      shippingAddress: values.address,
      billingAddressSameAsShipping: values.billingAddressSameAsShipping,
      billingAddress: values.billingAddressSameAsShipping ? values.address : values.billingAddress,
      notes: values.notes,
      items: orderItems,
    };
    
    createOrderMutation.mutate(orderData);
  };

  // If there are no items to checkout
  if (cartItems.length === 0 && !selectedVehicle) {
    return (
      <div className="container max-w-5xl py-12">
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-4">You haven't added any customization parts or selected a vehicle</p>
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
    <div className="bg-gray-50 min-h-screen">
      <div className="container max-w-7xl py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/arena-studio/premium">
                <ChevronLeft size={18} />
                <span className="ml-1">Back to Customizer</span>
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500">Complete your purchase from Premium Arena™</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Enter your contact details for this order
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                    <CardDescription>
                      Enter the address where you want your items delivered
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main Street" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Mumbai" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="Maharashtra" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="address.postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="400001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address.country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="India">India</SelectItem>
                                <SelectItem value="United States">United States</SelectItem>
                                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                <SelectItem value="Canada">Canada</SelectItem>
                                <SelectItem value="Australia">Australia</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4 block">
                    <FormField
                      control={form.control}
                      name="billingAddressSameAsShipping"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Billing address is the same as shipping address
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardFooter>
                </Card>

                {/* Billing Address (shown if different from shipping) */}
                {!form.watch('billingAddressSameAsShipping') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing Address</CardTitle>
                      <CardDescription>
                        Enter your billing address details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="billingAddress.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Billing Street" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="billingAddress.city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Mumbai" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingAddress.state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="Maharashtra" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="billingAddress.postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input placeholder="400001" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="billingAddress.country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value || "India"}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="India">India</SelectItem>
                                  <SelectItem value="United States">United States</SelectItem>
                                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                  <SelectItem value="Canada">Canada</SelectItem>
                                  <SelectItem value="Australia">Australia</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Shipping Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Method</CardTitle>
                    <CardDescription>
                      Choose how you want your order delivered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {shippingMethods.map((method) => (
                        <div
                          key={method.id}
                          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:border-blue-500 ${
                            selectedShippingMethod.id === method.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedShippingMethod(method)}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${
                              selectedShippingMethod.id === method.id
                                ? 'bg-blue-500 ring-2 ring-blue-200'
                                : 'border border-gray-300'
                            }`} />
                            <div>
                              <p className="font-medium">{method.name}</p>
                              <p className="text-sm text-gray-500">{method.deliveryTime}</p>
                            </div>
                          </div>
                          <p className="font-medium">
                            {formatCurrency(method.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Select your preferred payment method
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <Tabs
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="w-full"
                          >
                            <TabsList className="grid grid-cols-4 mb-4">
                              <TabsTrigger value="credit_card">Credit Card</TabsTrigger>
                              <TabsTrigger value="bank_transfer">Net Banking</TabsTrigger>
                              <TabsTrigger value="upi">UPI</TabsTrigger>
                              <TabsTrigger value="cod">Cash on Delivery</TabsTrigger>
                            </TabsList>
                            <TabsContent value="credit_card">
                              <div className="space-y-4">
                                <div className="bg-gray-50 border p-4 rounded-lg">
                                  <p className="text-sm text-gray-500">
                                    Since Stripe keys aren't configured yet, we're showing a placeholder credit card form. In a real implementation, this would be replaced with Stripe Elements.
                                  </p>
                                </div>
                                <div className="space-y-3">
                                  <Input placeholder="Card Number" />
                                  <div className="grid grid-cols-3 gap-3">
                                    <Input placeholder="MM/YY" />
                                    <Input placeholder="CVC" />
                                    <Input placeholder="ZIP" />
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="bank_transfer">
                              <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                  <p className="text-sm text-gray-500">
                                    You'll be redirected to your bank's website to complete the payment after placing your order.
                                  </p>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  {['HDFC Bank', 'ICICI Bank', 'SBI'].map((bank) => (
                                    <div key={bank} className="p-3 border rounded-lg text-center cursor-pointer hover:border-blue-500">
                                      {bank}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="upi">
                              <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg border">
                                  <p className="text-sm text-gray-500">
                                    Pay securely using UPI apps like Google Pay, PhonePe, Paytm etc.
                                  </p>
                                </div>
                                <div className="flex flex-col items-center space-y-3">
                                  <p className="text-md">Enter your UPI ID</p>
                                  <Input placeholder="yourname@upi" className="max-w-md" />
                                </div>
                              </div>
                            </TabsContent>
                            <TabsContent value="cod">
                              <div className="p-4 bg-gray-50 rounded-lg border">
                                <p className="text-sm text-gray-500">
                                  Pay with cash when your order is delivered. Additional COD fee of ₹50 may apply.
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Additional Information</CardTitle>
                    <CardDescription>
                      Add any special instructions for your order
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order Notes (Optional)</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder="Special instructions for delivery or installation"
                              {...field}
                            ></textarea>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* Submit Button - Mobile Only */}
                <div className="lg:hidden">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order • {formatCurrency(total)}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Order Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vehicle Summary */}
                  {selectedVehicle && (
                    <div className="pb-3 border-b">
                      <div className="flex items-start gap-3">
                        {selectedVehicle.thumbnailUrl && (
                          <div className="h-16 w-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                            <img 
                              src={selectedVehicle.thumbnailUrl} 
                              alt={selectedVehicle.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-sm">{selectedVehicle.manufacturer} {selectedVehicle.name}</h4>
                          <p className="text-xs text-gray-500">{selectedVehicle.year} Model</p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {formatCurrency(selectedVehicle.basePrice || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Parts List */}
                  {cartItems.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Customization Parts ({cartItems.length})</h4>
                      <ScrollArea className={`h-${cartItems.length > 3 ? '32' : '20'} rounded-md`}>
                        <div className="space-y-3 pr-2">
                          {cartItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-3">
                              {item.thumbnailUrl && (
                                <div className="h-12 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  <img 
                                    src={item.thumbnailUrl} 
                                    alt={item.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm truncate">{item.name}</h5>
                                <p className="text-xs text-gray-500">{item.category} - {item.subcategory}</p>
                              </div>
                              <p className="text-sm font-medium whitespace-nowrap">
                                {formatCurrency(item.price || 0)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2 pt-3 mt-3 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax (18% GST)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {/* Submit Button - Desktop Only */}
                  <Button 
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    className="w-full hidden lg:flex" 
                    size="lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {/* Order Process */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">What happens next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Order Confirmation</h4>
                      <p className="text-xs text-gray-500">You'll receive an email with your order details</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <BarChart className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Processing</h4>
                      <p className="text-xs text-gray-500">We'll prepare your customization parts</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Packing</h4>
                      <p className="text-xs text-gray-500">Your items are carefully packed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Shipping</h4>
                      <p className="text-xs text-gray-500">We'll send you tracking information</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArenaCheckout;