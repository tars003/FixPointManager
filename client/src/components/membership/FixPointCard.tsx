import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Shield,
  Zap,
  Clock,
  Settings,
  MapPin,
  PhoneCall,
  CalendarCheck,
  ChevronRight,
  Award,
  Car,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FixPointCardProps {
  userName?: string;
  memberSince?: string;
  membershipType?: 'basic' | 'premium' | 'elite';
  membershipNumber?: string;
  vehicleCount?: number;
  points?: number;
  expiryDate?: string;
  onActivate?: () => void;
  onManage?: () => void;
}

const FixPointCard: React.FC<FixPointCardProps> = ({
  userName = 'Rajesh Kumar',
  memberSince = 'April 2025',
  membershipType = 'premium',
  membershipNumber = '2241 8891 4412 5551',
  vehicleCount = 2,
  points = 1250,
  expiryDate = '04/28',
  onActivate,
  onManage
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const gradientBg = {
    basic: 'bg-gradient-to-br from-blue-600 to-blue-900',
    premium: 'bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700',
    elite: 'bg-gradient-to-br from-amber-500 via-orange-600 to-rose-700',
  };

  const borderHighlight = {
    basic: 'after:from-blue-400 after:to-transparent',
    premium: 'after:from-violet-400 after:to-transparent',
    elite: 'after:from-amber-400 after:to-transparent',
  };

  const cardType = {
    basic: 'Basic',
    premium: 'Premium',
    elite: 'Elite'
  };

  // Convert membership number to formatted display with spaces
  const formatMembershipNumber = (num: string) => {
    return num.match(/.{1,4}/g)?.join(' ') || num;
  };

  const benefits = {
    basic: [
      { icon: <Shield className="h-4 w-4" />, name: 'Basic Roadside Assistance' },
      { icon: <MapPin className="h-4 w-4" />, name: 'Standard Service Network' },
      { icon: <Clock className="h-4 w-4" />, name: '24/7 Customer Support' },
    ],
    premium: [
      { icon: <Shield className="h-4 w-4" />, name: 'Premium Roadside Assistance' },
      { icon: <Zap className="h-4 w-4" />, name: 'Priority Service Booking' },
      { icon: <Settings className="h-4 w-4" />, name: 'Advanced Maintenance Plans' },
      { icon: <MapPin className="h-4 w-4" />, name: 'Nationwide Service Network' },
    ],
    elite: [
      { icon: <Shield className="h-4 w-4" />, name: 'Comprehensive Protection' },
      { icon: <PhoneCall className="h-4 w-4" />, name: 'Dedicated Concierge Service' },
      { icon: <Zap className="h-4 w-4" />, name: 'Expedited Service & Repairs' },
      { icon: <CalendarCheck className="h-4 w-4" />, name: 'Annual Vehicle Inspection' },
      { icon: <MapPin className="h-4 w-4" />, name: 'Global Assistance Coverage' },
    ],
  };

  return (
    <div className="perspective-1000 w-full max-w-lg mx-auto">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={isFlipped ? 'back' : 'front'}
          className="relative w-full h-full cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {!isFlipped ? (
            <motion.div
              className={cn(
                "relative w-full overflow-hidden rounded-2xl shadow-xl",
                gradientBg[membershipType],
                "after:absolute after:inset-0 after:z-10 after:rounded-2xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:border after:border-opacity-40 after:bg-gradient-to-br",
                borderHighlight[membershipType]
              )}
              initial={{ rotateY: 180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -180 }}
              transition={{ duration: 0.4 }}
            >
              {/* Card Front Content */}
              <div className="relative z-20 p-6 min-h-[230px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-white text-xl font-bold">FixPoint</h3>
                      <Sparkles className="h-5 w-5 ml-1 text-yellow-300" />
                    </div>
                    <p className="text-white/70 text-xs uppercase tracking-wider font-medium">
                      {cardType[membershipType]} Membership
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <Car className="h-8 w-8 text-white/80" />
                    <CreditCard className="h-6 w-6 ml-1 text-white/80" />
                  </div>
                </div>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-white/90 uppercase text-sm tracking-wider font-medium">Member</p>
                    <p className="text-white/90 text-sm">Since {memberSince}</p>
                  </div>
                  <h2 className="text-white text-xl font-medium">{userName}</h2>
                </div>

                <div className="mt-6">
                  <p className="text-white/90 text-sm font-mono tracking-wider">
                    {formatMembershipNumber(membershipNumber)}
                  </p>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div>
                      <p className="text-white/70 text-xs">Vehicles</p>
                      <p className="text-white text-sm font-medium">{vehicleCount}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Points</p>
                      <p className="text-white text-sm font-medium">{points}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-xs">Exp</p>
                      <p className="text-white text-sm font-medium">{expiryDate}</p>
                    </div>
                  </div>
                </div>

                {/* Animated flicker effect */}
                <motion.div 
                  className="absolute right-0 top-0 w-40 h-20 rotate-45 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '300%'],
                    opacity: [0, 0.1, 0.2, 0.1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 8,
                  }}
                />

                {/* Card flip indicator */}
                <div className="absolute bottom-3 right-3 text-white/50 text-xs flex items-center">
                  <span>View Benefits</span>
                  <ChevronRight className="h-3 w-3 ml-1" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className={cn(
                "relative w-full overflow-hidden rounded-2xl shadow-xl",
                gradientBg[membershipType],
                "after:absolute after:inset-0 after:z-10 after:rounded-2xl after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-300 after:border after:border-opacity-40 after:bg-gradient-to-br",
                borderHighlight[membershipType]
              )}
              initial={{ rotateY: -180 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: 180 }}
              transition={{ duration: 0.4 }}
            >
              {/* Card Back Content */}
              <div className="relative z-20 p-6 min-h-[230px]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white text-lg font-bold flex items-center">
                      <Award className="h-4 w-4 mr-2 text-yellow-300" />
                      Membership Benefits
                    </h3>
                  </div>
                  
                  <div>
                    <p className="text-white/80 text-xs font-medium px-2 py-1 bg-white/10 rounded-full">
                      {cardType[membershipType]}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {benefits[membershipType].map((benefit, index) => (
                    <div key={index} className="flex items-center rounded-lg bg-white/10 backdrop-blur-sm p-2">
                      <div className="text-white/90 mr-3">
                        {benefit.icon}
                      </div>
                      <p className="text-white text-sm">{benefit.name}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <div className="flex gap-2 mt-3">
                    {onManage && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onManage();
                        }}
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        Manage Membership
                      </Button>
                    )}
                    {onActivate && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onActivate();
                        }}
                        variant="secondary" 
                        size="sm" 
                        className="w-full text-xs bg-white/20 hover:bg-white/30 text-white border-0"
                      >
                        Activate Benefits
                      </Button>
                    )}
                  </div>
                </div>

                {/* Card flip indicator */}
                <div className="absolute bottom-3 left-3 text-white/50 text-xs flex items-center">
                  <ChevronRight className="h-3 w-3 mr-1 rotate-180" />
                  <span>Back to Card</span>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// This CardDeck component showcases multiple card tiers together
export const FixPointCardDeck: React.FC = () => {
  return (
    <div className="space-y-12 py-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">FixPoint Membership Cards</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose a membership tier that suits your vehicle management needs, from basic coverage to elite concierge services.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 border shadow-sm">
          <h3 className="text-xl font-bold mb-4">Basic</h3>
          <p className="text-gray-600 mb-4">Essential coverage for peace of mind on the road.</p>
          <FixPointCard 
            userName="Rajesh Kumar"
            membershipType="basic"
            membershipNumber="8821 5541 9900 3321"
            vehicleCount={1}
            points={500} 
          />
          <div className="mt-6">
            <p className="text-xl font-bold mb-2">₹1,999<span className="text-sm font-normal text-gray-600">/year</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Basic roadside assistance</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">24/7 customer support</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">Standard service network</span>
              </li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Select Basic</Button>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/20 shadow-lg relative">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rounded-full">
            POPULAR
          </div>
          <h3 className="text-xl font-bold mb-4 text-white">Premium</h3>
          <p className="text-gray-400 mb-4">Enhanced protection and priority service for busy vehicle owners.</p>
          <FixPointCard 
            userName="Rajesh Kumar" 
            membershipType="premium"
            membershipNumber="2241 8891 4412 5551"
            vehicleCount={2}
            points={1250}
          />
          <div className="mt-6">
            <p className="text-xl font-bold mb-2 text-white">₹3,999<span className="text-sm font-normal text-gray-400">/year</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center text-gray-300">
                <Shield className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-sm">Premium roadside assistance</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Zap className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-sm">Priority service booking</span>
              </li>
              <li className="flex items-center text-gray-300">
                <Settings className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-sm">Advanced maintenance plans</span>
              </li>
              <li className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 text-indigo-400 mr-2" />
                <span className="text-sm">Nationwide service network</span>
              </li>
            </ul>
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">Select Premium</Button>
          </div>
        </div>
        
        <div className="p-6 rounded-xl bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-200 shadow-sm">
          <h3 className="text-xl font-bold mb-4">Elite</h3>
          <p className="text-gray-600 mb-4">Luxury concierge service with global coverage for discerning vehicle owners.</p>
          <FixPointCard 
            userName="Rajesh Kumar" 
            membershipType="elite"
            membershipNumber="7734 2215 8901 4432"
            vehicleCount={3}
            points={5000}
          />
          <div className="mt-6">
            <p className="text-xl font-bold mb-2">₹9,999<span className="text-sm font-normal text-gray-600">/year</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <Shield className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm">Comprehensive protection</span>
              </li>
              <li className="flex items-center">
                <PhoneCall className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm">Dedicated concierge service</span>
              </li>
              <li className="flex items-center">
                <Zap className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm">Expedited service & repairs</span>
              </li>
              <li className="flex items-center">
                <CalendarCheck className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm">Annual vehicle inspection</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                <span className="text-sm">Global assistance coverage</span>
              </li>
            </ul>
            <Button className="w-full bg-amber-600 hover:bg-amber-700">Select Elite</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixPointCard;