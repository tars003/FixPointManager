import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Phone,
  Mail,
  MessageSquare,
  Shield,
  HelpCircle,
  FileText,
  Heart,
  Car,
  Map,
  Zap,
  UserCheck,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  Gamepad2,
  Users,
  BookOpen,
  Wrench,
  BookMarked,
  School,
  Smartphone,
  Building2,
  Scale,
  LifeBuoy,
  AlertCircle,
  ThumbsUp,
  ShoppingBag,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Footer: React.FC = () => {
  const [, navigate] = useLocation();
  
  const footerLinksLeft = [
    { title: 'About Us', href: '/about' },
    { title: 'Contact Us', href: '/contact' },
    { title: 'Careers', href: '/careers' },
    { title: 'Support', href: '/support' },
    { title: 'Safety', href: '/safety' },
  ];
  
  const footerLinksRight = [
    { title: 'Terms of Service', href: '/terms' },
    { title: 'Privacy Policy', href: '/privacy' },
    { title: 'Cookie Policy', href: '/cookies' },
    { title: 'Accessibility', href: '/accessibility' },
    { title: 'Community Guidelines', href: '/community-guidelines' },
  ];
  
  const quickLinks = [
    { title: 'Emergency Services', href: '/emergency', icon: Shield },
    { title: 'Help Center', href: '/help', icon: HelpCircle },
    { title: 'Documentation', href: '/docs', icon: FileText },
    { title: 'Feedback', href: '/feedback', icon: MessageSquare },
  ];
  
  // Social media links
  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const pulseVariants = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, repeatType: "mirror" as const }
    }
  };
  
  const hoverVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, y: -2 }
  };
  
  // Icon with pulse animation component
  const AnimatedIcon = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <motion.div
      className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shadow-md`}
      variants={pulseVariants}
      initial="initial"
      animate="pulse"
    >
      <Icon className="h-4 w-4 text-white" />
    </motion.div>
  );
  
  return (
    <footer className="bg-gradient-to-br from-white to-gray-100 border-t mt-auto relative overflow-hidden">
      {/* Decorative automotive-themed elements */}
      <motion.div 
        className="absolute -top-6 right-10 opacity-10"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -5, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      >
        <Car className="h-28 w-28 text-primary" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 -left-10 opacity-10"
        animate={{ 
          x: [-10, 10, -10], 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
      >
        <Map className="h-32 w-32 text-emerald-500" />
      </motion.div>
      
      {/* Main Footer */}
      <motion.div 
        className="container mx-auto px-4 py-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div 
              className="flex items-center"
              whileHover={{ x: 3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div className="ml-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">FixPoint</h3>
              </div>
            </motion.div>
            <p className="text-gray-600 text-sm">
              India's first comprehensive vehicle intelligence platform for smarter ownership and management.
            </p>
            <div className="flex items-center space-x-5 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label={social.label}
                  whileHover={{ y: -4, scale: 1.2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          {/* Links Column 1 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <AnimatedIcon icon={UserCheck} color="bg-blue-500" />
              <h4 className="font-semibold text-gray-900 ml-2">Company</h4>
            </div>
            <ul className="space-y-2 pl-10">
              {footerLinksLeft.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.button 
                    onClick={() => navigate(link.href)} 
                    className="text-gray-600 hover:text-primary text-sm transition-colors"
                    whileHover={{ x: 5, color: "#1E40AF" }}
                  >
                    {link.title}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Links Column 2 */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <AnimatedIcon icon={FileText} color="bg-indigo-500" />
              <h4 className="font-semibold text-gray-900 ml-2">Legal</h4>
            </div>
            <ul className="space-y-2 pl-10">
              {footerLinksRight.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.button 
                    onClick={() => navigate(link.href)} 
                    className="text-gray-600 hover:text-primary text-sm transition-colors"
                    whileHover={{ x: 5, color: "#1E40AF" }}
                  >
                    {link.title}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Contact & Quick Actions */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <AnimatedIcon icon={HeartHandshake} color="bg-teal-500" />
              <h4 className="font-semibold text-gray-900 ml-2">Contact & Help</h4>
            </div>
            <ul className="space-y-3 pl-10">
              <motion.li 
                className="flex items-center text-sm text-gray-600"
                whileHover={{ scale: 1.05, x: 3 }}
              >
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>+91 1800-000-0000</span>
              </motion.li>
              <motion.li 
                className="flex items-center text-sm text-gray-600"
                whileHover={{ scale: 1.05, x: 3 }}
              >
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>support@fixpoint.co.in</span>
              </motion.li>
            </ul>
            
            <h4 className="font-semibold text-gray-900 mt-5 mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="justify-start text-xs px-2 w-full bg-white shadow-sm border-gray-200"
                    onClick={() => navigate(link.href)}
                  >
                    <link.icon className="h-3.5 w-3.5 mr-1" />
                    {link.title}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Features, Explore, Community Sections - Simplified layout based on screenshots */}
      <div className="border-t border-gray-100 pt-8 pb-6 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Features Section */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Features</h3>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Car className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Vehicle Vault</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Store & manage all vehicle documents securely</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Wrench className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Service Booking</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Book verified service centers with live tracking</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Emergency Services</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">24/7 roadside assistance anywhere in India</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
                    onClick={() => navigate("/features")}
                  >
                    View all features 
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Explore Section */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Explore</h3>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <ShoppingBag className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Parts Marketplace</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Verified genuine parts with express delivery</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <School className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Driving School</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Learn from certified instructors near you</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <Shield className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Insurance Hub</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Compare & buy insurance with AI advisor</p>
                  </div>
                </div>
                
                <div className="mt-2">
                  <button 
                    className="text-xs text-green-600 hover:text-green-700 flex items-center"
                    onClick={() => navigate("/explore")}
                  >
                    Explore more
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Community Section */}
            <div className="relative">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Community</h3>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-medium text-gray-800 text-sm">Owner's Clubs</h4>
                        <div className="text-xs text-gray-400">•</div>
                      </div>
                      <p className="text-gray-500 text-xs">Connect with fellow owners, join local meetups</p>
                    </div>
                  </div>
                  <span className="px-1.5 text-[9px] bg-gray-100 text-gray-700 rounded h-4 flex items-center font-medium">
                    Popular
                  </span>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1">
                    <BookMarked className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-medium text-gray-800 text-sm">Knowledge Base</h4>
                      <div className="text-xs text-gray-400">•</div>
                    </div>
                    <p className="text-gray-500 text-xs">Vehicle guides, maintenance tips, videos</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <MessageSquare className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-medium text-gray-800 text-sm">Discussion Forums</h4>
                        <div className="text-xs text-gray-400">•</div>
                      </div>
                      <p className="text-gray-500 text-xs">Expert advice on vehicle topics</p>
                    </div>
                  </div>
                  <span className="px-1.5 text-[9px] bg-gray-100 text-gray-700 rounded h-4 flex items-center font-medium">
                    Active
                  </span>
                </div>
                
                <div className="mt-2">
                  <button 
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center"
                    onClick={() => navigate("/community")}
                  >
                    Join our community
                    <ArrowRight className="h-3 w-3 ml-1.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced App Promotion - matched to screenshot */}
      <div className="bg-blue-600 py-8 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center text-white">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mr-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold">Download the FixPoint App</h2>
                <div className="flex items-center mt-0.5">
                  <svg className="h-3 w-3 mr-1 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-xs text-blue-100">4.8/5 • 100K+ Downloads</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-auto">
              <div className="bg-blue-700/50 rounded p-3 flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-medium text-white">Real-time Alerts</h4>
                </div>
                <p className="text-[10px] text-blue-100">Service reminders, document expiry alerts</p>
              </div>
              
              <div className="bg-blue-700/50 rounded p-3 flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <Zap className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="text-xs font-medium text-white">Quick Access</h4>
                </div>
                <p className="text-[10px] text-blue-100">Emergency services at your fingertips</p>
              </div>
              
              <div className="bg-blue-700/50 rounded p-3 flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-xs font-medium text-white">Quick Verification</h4>
                </div>
                <p className="text-[10px] text-blue-100">Face ID login & document scanning</p>
              </div>
              
              <div className="bg-blue-700/50 rounded p-3 flex flex-col">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
                    <MapPin className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h4 className="text-xs font-medium text-white">Location Services</h4>
                </div>
                <p className="text-[10px] text-blue-100">Find nearby fuel stations & service centers</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap justify-between items-center">
            <p className="text-blue-100 text-xs max-w-md mb-4 md:mb-0">
              Join over 100,000 Indian vehicle owners who manage their vehicles smarter with FixPoint. 
              Download now for a complete suite of tools designed specifically for Indian roads and conditions.
            </p>
            
            <div className="flex flex-wrap gap-3 items-center">
              <a 
                href="#"
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg"
              >
                <div className="mr-2">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M17.5234 12.3582L14.5547 10.3239L14.1152 9.97376C13.5937 9.58813 13.5547 9.3082 13.5547 9.19542C13.5547 9.08264 13.6133 8.84042 14.1152 8.41709L17.4453 5.64146C17.6406 5.4614 17.9141 5.4614 18.1094 5.64146L23.8281 10.3239C24.0234 10.504 24.0624 10.7613 23.8672 10.9794L18.1484 16.047C17.9531 16.2651 17.6797 16.2651 17.4844 16.085L17.5234 12.3582ZM4.31248 0C6.24998 0 7.65622 0.676423 8.71873 1.95098L8.83591 2.10147L12.6952 9.15772C12.8124 9.38203 12.7538 9.64216 12.5585 9.82222L1.40622 19.7329C1.21092 19.8956 0.937475 19.913 0.742162 19.7329C0.546849 19.5903 0.507787 19.2982 0.624975 19.0739L4.25779 11.5853L0.624975 4.0967C0.468725 3.7699 0.351537 3.44309 0.273412 3.11629V2.86436C0.273412 1.27176 2.05466 0 4.31248 0Z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[8px]">GET IT ON</div>
                  <div className="text-sm font-semibold leading-tight">Google Play</div>
                </div>
              </a>
              
              <a 
                href="#"
                className="flex items-center bg-black text-white px-4 py-2 rounded-lg"
              >
                <div className="mr-2">
                  <svg viewBox="0 0 384 512" className="h-6 w-6" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[8px]">DOWNLOAD ON THE</div>
                  <div className="text-sm font-semibold leading-tight">App Store</div>
                </div>
              </a>
              
              <div className="flex items-center ml-2">
                <div className="flex -space-x-2">
                  {[
                    "bg-gradient-to-r from-yellow-400 to-orange-500",
                    "bg-gradient-to-r from-green-400 to-emerald-500",
                    "bg-gradient-to-r from-blue-400 to-indigo-500"
                  ].map((bgColor, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center border-2 border-white text-white text-[10px] font-medium`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-gray-600 text-[10px] font-medium">
                    +5k
                  </div>
                </div>
                <span className="ml-2 text-blue-100 text-[10px]">
                  People downloaded<br />in the last 24 hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Company, Legal, Contact Info - from screenshot */}
      <div className="border-t border-gray-100 pt-6 pb-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* FixPoint */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <span className="text-blue-600 font-bold text-lg">F</span>
                </div>
                <span className="text-lg font-bold text-gray-800">FixPoint</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                India's first comprehensive vehicle intelligence platform<br />
                for smarter ownership and management.
              </p>
              <div className="flex items-center gap-2 mb-6">
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  <Youtube size={18} />
                </a>
              </div>
            </div>
            
            {/* Company */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Building2 className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-semibold text-gray-800">Company</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <a href="/about" className="text-xs text-gray-600 hover:text-blue-600">About Us</a>
                </div>
                <div>
                  <a href="/contact" className="text-xs text-gray-600 hover:text-blue-600">Contact Us</a>
                </div>
                <div>
                  <a href="/careers" className="text-xs text-gray-600 hover:text-blue-600">Careers</a>
                </div>
                <div>
                  <a href="/support" className="text-xs text-gray-600 hover:text-blue-600">Support</a>
                </div>
                <div>
                  <a href="/safety" className="text-xs text-gray-600 hover:text-blue-600">Safety</a>
                </div>
              </div>
            </div>
            
            {/* Legal */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <Scale className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-semibold text-gray-800">Legal</span>
              </div>
              <div className="space-y-2.5">
                <div>
                  <a href="/terms" className="text-xs text-gray-600 hover:text-blue-600">Terms of Service</a>
                </div>
                <div>
                  <a href="/privacy" className="text-xs text-gray-600 hover:text-blue-600">Privacy Policy</a>
                </div>
                <div>
                  <a href="/cookies" className="text-xs text-gray-600 hover:text-blue-600">Cookie Policy</a>
                </div>
                <div>
                  <a href="/accessibility" className="text-xs text-gray-600 hover:text-blue-600">Accessibility</a>
                </div>
                <div>
                  <a href="/guidelines" className="text-xs text-gray-600 hover:text-blue-600">Community Guidelines</a>
                </div>
              </div>
            </div>
            
            {/* Contact & Help */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  <LifeBuoy className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-base font-semibold text-gray-800">Contact & Help</span>
              </div>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center">
                  <Phone className="h-3.5 w-3.5 mr-2 text-gray-500" />
                  <span className="text-xs text-gray-600">+91 1800-000-0000</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-3.5 w-3.5 mr-2 text-gray-500" />
                  <span className="text-xs text-gray-600">support@fixpoint.co.in</span>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Links</h5>
                <div className="grid grid-cols-2 gap-2">
                  <a 
                    href="/emergency" 
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 bg-gray-100 px-2 py-1.5 rounded"
                  >
                    <AlertCircle className="h-3 w-3 mr-1" /> Emergency Services
                  </a>
                  <a 
                    href="/help" 
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 bg-gray-100 px-2 py-1.5 rounded"
                  >
                    <HelpCircle className="h-3 w-3 mr-1" /> Help Center
                  </a>
                  <a 
                    href="/docs" 
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 bg-gray-100 px-2 py-1.5 rounded"
                  >
                    <FileText className="h-3 w-3 mr-1" /> Documentation
                  </a>
                  <a 
                    href="/feedback" 
                    className="flex items-center text-xs text-gray-600 hover:text-blue-600 bg-gray-100 px-2 py-1.5 rounded"
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" /> Feedback
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 py-4 border-t border-gray-100">
        <div className="flex flex-col md:flex-row items-center justify-between text-xs">
          <p className="text-gray-500 mb-2 md:mb-0">
            © {new Date().getFullYear()} FixPoint Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center">
            <span className="text-gray-500 flex items-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;