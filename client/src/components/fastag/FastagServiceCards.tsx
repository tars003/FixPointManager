import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Map, HelpCircle } from 'lucide-react';
import BuyNewFastagFlow from './BuyNewFastagFlow';
import TollCalculatorFlow from './TollCalculatorFlow';
import FastagSupportFlow from './FastagSupportFlow';

const FastagServiceCards = () => {
  const [activeFlow, setActiveFlow] = useState<'buy' | 'toll' | 'support' | null>(null);

  // Close any active flow
  const handleCloseFlow = () => {
    setActiveFlow(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Buy New FASTag */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setActiveFlow('buy')}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Buy New FASTag</h3>
            <p className="text-purple-600 dark:text-purple-400 text-sm mb-4">
              Purchase a new FASTag for your vehicle with easy online registration
            </p>
            <Button variant="outline" className="w-full">Apply Now</Button>
          </CardContent>
        </Card>
        
        {/* Toll Calculator */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setActiveFlow('toll')}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <Map className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Toll Calculator</h3>
            <p className="text-blue-600 dark:text-blue-400 text-sm mb-4">
              Calculate toll charges for your journey before you start driving
            </p>
            <Button variant="outline" className="w-full">Calculate Toll</Button>
          </CardContent>
        </Card>
        
        {/* FASTag Help */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => setActiveFlow('support')}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-purple-100 dark:bg-purple-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">FASTag Support</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-4">
              Need help with your FASTag? Contact customer support or read FAQs
            </p>
            <Button variant="outline" className="w-full">Get Support</Button>
          </CardContent>
        </Card>
      </div>

      {/* Flows */}
      {activeFlow === 'buy' && <BuyNewFastagFlow onClose={handleCloseFlow} />}
      {activeFlow === 'toll' && <TollCalculatorFlow onClose={handleCloseFlow} />}
      {activeFlow === 'support' && <FastagSupportFlow onClose={handleCloseFlow} />}
    </>
  );
};

export default FastagServiceCards;