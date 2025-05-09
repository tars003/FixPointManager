import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle, ArrowRight, Sparkles, Star } from 'lucide-react';

interface PremiumCardProps {
  userName: string;
  memberSince?: string;
  cardNumber?: string;
  points?: number;
  status?: string;
  benefits?: string[];
  onViewMembership?: () => void;
  onUpgradeBenefits?: () => void;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  userName,
  memberSince = 'April 2025',
  cardNumber = '5234 86** **** 2382',
  points = 1250,
  status = 'Premium',
  benefits = [
    'Premium Roadside Assistance',
    'Priority Service Booking',
    'Rewards Program'
  ],
  onViewMembership,
  onUpgradeBenefits,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Mouse position values for 3D card effect (sales tactic #2: Visual appeal)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 100);
    y.set(yPct * 100);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 relative overflow-hidden shadow-xl border border-indigo-800/30">
      {/* Background patterns and effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%239C92AC\" fill-opacity=\"0.4\" fill-rule=\"evenodd\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"/%3E%3C/g%3E%3C/svg%3E')]"
        ></motion.div>
      </div>

      {/* Card content */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div>
            <motion.h2 
              className="text-xl font-bold text-white flex items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              FixPoint Premium Card 
              <motion.span 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="ml-2"
              >
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xs text-indigo-200 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Unlock premium vehicle insights, nationwide roadside assistance, and exclusive discounts. Earn points on every service.
            </motion.p>
          </div>
          
          {/* Premium icon */}
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
            className="text-yellow-300"
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
        </div>
        
        {/* Card 3D effect container */}
        <motion.div
          className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 shadow-lg mb-4 cursor-pointer"
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Card front */}
          <AnimatePresence initial={false}>
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative h-48"
              >
                <div className="flex justify-between items-start">
                  <div className="rounded-full bg-white/20 backdrop-blur-md p-2">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-indigo-200">Premium exclusive</div>
                    <div className="text-white font-medium">FixPoint</div>
                  </div>
                </div>
                
                {/* Chip and Contactless */}
                <div className="flex items-center space-x-2 mt-6">
                  <div className="w-10 h-7 bg-yellow-500/60 rounded opacity-90 relative overflow-hidden">
                    <div className="absolute top-1 left-1 w-8 h-1 bg-yellow-300/50 rounded-full"></div>
                    <div className="absolute top-3 left-1 w-6 h-1 bg-yellow-300/50 rounded-full"></div>
                    <div className="absolute top-5 left-1 w-4 h-1 bg-yellow-300/50 rounded-full"></div>
                  </div>
                  <div className="transform rotate-90">
                    <svg width="20" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17 12C17 9.2 14.8 7 12 7C9.2 7 7 9.2 7 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22 2L12 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {/* Card number */}
                <div className="mt-6">
                  <p className="text-sm text-indigo-100 tracking-widest font-mono">{cardNumber}</p>
                </div>
                
                {/* Card holder name */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end">
                  <div>
                    <p className="text-xs text-indigo-200 uppercase">Member</p>
                    <p className="text-sm text-white font-medium">{userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-indigo-200 uppercase">Since</p>
                    <p className="text-sm text-white font-medium">{memberSince}</p>
                  </div>
                </div>
                
                {/* Card shine effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative h-48"
              >
                <div className="text-center">
                  <div className="text-xs text-indigo-200 uppercase">Points</div>
                  <div className="text-2xl font-bold text-white">{points}</div>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs text-indigo-200 uppercase mb-1 text-center">Status</div>
                  <div className="bg-indigo-800/50 rounded-full h-6 p-1 relative">
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 1, delay: 0.2 }}
                    ></motion.div>
                    <div className="relative z-10 text-xs text-white text-center font-medium">
                      {status}
                    </div>
                  </div>
                </div>
                
                {/* Member initials */}
                <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white font-medium">{getInitials(userName)}</span>
                </div>
                
                {/* Card shine effect */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Benefits section - sales tactic #3: Value proposition */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white">Membership Benefits</h3>
            <span className="text-xs text-indigo-200">Tap card to view status</span>
          </div>
          
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="flex items-center"
              >
                <Star className="h-3.5 w-3.5 text-yellow-400 mr-2 flex-shrink-0" />
                <span className="text-xs text-indigo-100">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Action buttons - sales tactic #4: Clear call to action */}
        <div className="flex space-x-3 mt-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-indigo-100 hover:text-white hover:bg-indigo-800/50"
            onClick={onViewMembership}
          >
            View Membership
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
            onClick={onUpgradeBenefits}
          >
            Upgrade Benefits
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PremiumCard;