import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, CheckCircle, Heart, Trash2 } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartPanelProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  likedItems: string[];
  onToggleLike: (id: string) => void;
}

const CartPanel: React.FC<CartPanelProps> = ({
  items,
  onRemoveItem,
  onCheckout,
  likedItems,
  onToggleLike
}) => {
  // Calculate total price
  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
  
  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Your Cart</span>
          </div>
          {items.length > 0 && (
            <Badge>{items.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <p className="text-xs text-muted-foreground mt-1">
              Selected items will appear here
            </p>
          </div>
        ) : (
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="flex items-center justify-between bg-muted/40 p-2 rounded-md"
              >
                <div className="flex items-center gap-2">
                  <div className="bg-background rounded-md p-1.5 w-8 h-8 flex items-center justify-center text-xs font-medium">
                    {item.image || item.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatPrice(item.price)}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onToggleLike(item.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedItems.includes(item.id)
                          ? 'fill-red-500 text-red-500'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-red-500 hover:bg-red-50"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            <Separator className="my-3" />
            
            <div className="flex justify-between items-center font-medium">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          className="w-full gap-2"
          size="lg"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          <CheckCircle className="h-4 w-4" />
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartPanel;