import React from 'react';
import { X, Trash2, ShoppingCart, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface CartPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onCheckout?: () => void;
  likedItems?: string[];
  onToggleLike?: (id: string) => void;
  formatPrice?: (price: number) => string;
}

const CartPanel: React.FC<CartPanelProps> = ({
  isOpen = false,
  onClose = () => {},
  items,
  onRemoveItem,
  onCheckout = () => {},
  likedItems = [],
  onToggleLike = () => {},
  formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`
}) => {
  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const tax = subtotal * 0.18; // 18% GST for India
  const total = subtotal + tax;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
                <h2 className="font-bold text-lg">Your Configuration</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Body */}
            <ScrollArea className="flex-1 p-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <ShoppingCart className="h-8 w-8 text-blue-300" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Add items to your configuration to proceed with checkout
                  </p>
                  <Button variant="outline" onClick={onClose}>
                    Continue Customizing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="flex items-start justify-between border-b border-gray-100 pb-4">
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="font-medium">{formatPrice(item.price)}</span>
                        {item.category !== 'Base Vehicle' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-red-500"
                            onClick={() => onRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            
            {/* Summary */}
            {items.length > 0 && (
              <div className="border-t p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  onClick={onCheckout}
                >
                  Proceed to Checkout
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full mt-2"
                  onClick={onClose}
                >
                  Continue Customizing
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;