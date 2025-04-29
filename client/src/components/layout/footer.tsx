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
  AlertTriangle,
  ShoppingBag,
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
      
      {/* Features, Explore, Community Sections */}
      <div className="border-t border-gray-100 pt-12 pb-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="flex items-center mb-5">
                <motion.div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md mr-3"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Sparkles className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">Features</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    title: "Vehicle Vault", 
                    description: "Store & manage all vehicle documents securely", 
                    icon: Car,
                    color: "text-indigo-500",
                    href: "/vehicle-vault"
                  },
                  { 
                    title: "Service Booking", 
                    description: "Book verified service centers with live tracking", 
                    icon: Wrench,
                    color: "text-green-500",
                    href: "/service-booking"
                  },
                  { 
                    title: "Emergency Services", 
                    description: "24/7 roadside assistance anywhere in India", 
                    icon: AlertTriangle,
                    color: "text-red-500",
                    href: "/emergency"
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all p-3"
                    whileHover={{ x: 5, scale: 1.01 }}
                    onClick={() => navigate(feature.href)}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center text-sm">
                          {feature.title}
                          <ArrowRight className="h-3 w-3 ml-1 text-gray-400" />
                        </h4>
                        <p className="text-gray-600 text-xs">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button
                  className="w-full text-sm text-center text-primary hover:text-blue-700 mt-1 py-2"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate("/features")}
                >
                  View all features <ArrowRight className="inline h-3 w-3 ml-1" />
                </motion.button>
              </div>
            </motion.div>

            {/* Explore Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              <div className="flex items-center mb-5">
                <motion.div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md mr-3"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <BookOpen className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">Explore</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    title: "Parts Marketplace", 
                    description: "Verified genuine parts with express delivery", 
                    icon: ShoppingBag,
                    color: "text-blue-500",
                    href: "/parts-marketplace"
                  },
                  { 
                    title: "Driving School", 
                    description: "Learn from certified instructors near you", 
                    icon: School,
                    color: "text-amber-500",
                    href: "/driving-school"
                  },
                  { 
                    title: "Insurance Hub", 
                    description: "Compare & buy insurance with AI advisor", 
                    icon: Shield,
                    color: "text-green-500",
                    href: "/insurance"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all p-3"
                    whileHover={{ x: 5, scale: 1.01 }}
                    onClick={() => navigate(item.href)}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 flex items-center text-sm">
                          {item.title}
                          <ArrowRight className="h-3 w-3 ml-1 text-gray-400" />
                        </h4>
                        <p className="text-gray-600 text-xs">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button
                  className="w-full text-sm text-center text-green-600 hover:text-green-700 mt-1 py-2"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate("/explore")}
                >
                  Explore more <ArrowRight className="inline h-3 w-3 ml-1" />
                </motion.button>
              </div>
            </motion.div>

            {/* Community Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="flex items-center mb-5">
                <motion.div
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-md mr-3"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <Users className="h-5 w-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900">Community</h3>
              </div>
              
              <div className="space-y-3">
                {[
                  { 
                    title: "Owner's Clubs", 
                    description: "Connect with fellow owners, join local meetups", 
                    icon: Users,
                    color: "text-orange-500",
                    badge: "Popular",
                    href: "/owners-club"
                  },
                  { 
                    title: "Knowledge Base", 
                    description: "Vehicle guides, maintenance tips, videos", 
                    icon: BookMarked,
                    color: "text-blue-500",
                    href: "/knowledge-base"
                  },
                  { 
                    title: "Discussion Forums", 
                    description: "Expert advice on vehicle topics", 
                    icon: MessageSquare,
                    color: "text-indigo-500",
                    badge: "Active",
                    href: "/forums"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all p-3"
                    whileHover={{ x: 5, scale: 1.01 }}
                    onClick={() => navigate(item.href)}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div>
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 flex items-center text-sm">
                            {item.title}
                            <ArrowRight className="h-3 w-3 ml-1 text-gray-400" />
                          </h4>
                          {item.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-700 rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                <motion.button
                  className="w-full text-sm text-center text-purple-600 hover:text-purple-700 mt-1 py-2"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate("/community")}
                >
                  Join our community <ArrowRight className="inline h-3 w-3 ml-1" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced App Promotion */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 py-10 relative overflow-hidden">
        {/* Background elements */}
        <motion.div 
          className="absolute right-10 bottom-0 opacity-10"
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <Smartphone className="h-64 w-64 text-white" />
        </motion.div>
        
        <motion.div 
          className="absolute -left-10 top-10 opacity-5"
          animate={{ 
            x: [0, 10, 0],
            y: [0, -5, 0] 
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <MapPin className="h-48 w-48 text-white" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* App Details & Download */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <div className="flex items-center mb-6">
                <motion.div 
                  className="w-14 h-14 flex-shrink-0 rounded-full bg-white shadow-lg flex items-center justify-center mr-4"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">F</span>
                  </div>
                </motion.div>
                <div>
                  <h2 className="text-3xl font-bold">Download the FixPoint App</h2>
                  <div className="flex items-center mt-1 text-blue-100">
                    <svg className="h-4 w-4 mr-1 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    <span className="text-sm">4.8/5 • 100K+ Downloads</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="bg-blue-500 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Real-time Alerts</h4>
                    <p className="text-blue-100 text-sm">Service reminders, document expiry alerts</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="bg-indigo-500 rounded-full p-2 mr-3 flex-shrink-0">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Quick Access</h4>
                    <p className="text-blue-100 text-sm">Emergency services at your fingertips</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="bg-purple-500 rounded-full p-2 mr-3 flex-shrink-0">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Quick Verification</h4>
                    <p className="text-blue-100 text-sm">Face ID login & document scanning</p>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-start">
                  <div className="bg-green-500 rounded-full p-2 mr-3 flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Location Services</h4>
                    <p className="text-blue-100 text-sm">Find nearby fuel stations & service centers</p>
                  </div>
                </div>
              </div>
              
              <p className="text-blue-100 mb-6">
                Join over 100,000 Indian vehicle owners who manage their vehicles smarter with FixPoint. 
                Download now for a complete suite of tools designed specifically for Indian roads and conditions.
              </p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <motion.a
                  href="#"
                  className="flex items-center bg-black text-white px-5 py-2.5 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="mr-3">
                    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="currentColor">
                      <path d="M17.5234 12.3582L14.5547 10.3239L14.1152 9.97376C13.5937 9.58813 13.5547 9.3082 13.5547 9.19542C13.5547 9.08264 13.6133 8.84042 14.1152 8.41709L17.4453 5.64146C17.6406 5.4614 17.9141 5.4614 18.1094 5.64146L23.8281 10.3239C24.0234 10.504 24.0624 10.7613 23.8672 10.9794L18.1484 16.047C17.9531 16.2651 17.6797 16.2651 17.4844 16.085L17.5234 12.3582ZM4.31248 0C6.24998 0 7.65622 0.676423 8.71873 1.95098L8.83591 2.10147L12.6952 9.15772C12.8124 9.38203 12.7538 9.64216 12.5585 9.82222L1.40622 19.7329C1.21092 19.8956 0.937475 19.913 0.742162 19.7329C0.546849 19.5903 0.507787 19.2982 0.624975 19.0739L4.25779 11.5853L0.624975 4.0967C0.468725 3.7699 0.351537 3.44309 0.273412 3.11629V2.86436C0.273412 1.27176 2.05466 0 4.31248 0Z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs">GET IT ON</div>
                    <div className="text-lg font-semibold leading-tight">Google Play</div>
                  </div>
                </motion.a>
                
                <motion.a
                  href="#"
                  className="flex items-center bg-black text-white px-5 py-2.5 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="mr-3">
                    <svg viewBox="0 0 384 512" className="h-8 w-8" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs">DOWNLOAD ON THE</div>
                    <div className="text-lg font-semibold leading-tight">App Store</div>
                  </div>
                </motion.a>
                
                <motion.div 
                  className="flex items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex -space-x-4">
                    {[
                      "bg-gradient-to-br from-yellow-400 to-orange-500",
                      "bg-gradient-to-br from-green-400 to-emerald-500",
                      "bg-gradient-to-br from-blue-400 to-indigo-500"
                    ].map((bgColor, i) => (
                      <div key={i} className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center border-2 border-white text-white text-xs font-medium`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white text-gray-600 text-xs font-medium">
                      +5k
                    </div>
                  </div>
                  <span className="ml-3 text-blue-100 text-sm">People downloaded <br />in the last 24 hours</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* App Preview Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative max-w-[280px]">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-3xl blur-xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 0.8, 0.6] 
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                ></motion.div>
                
                <motion.div
                  className="relative z-10"
                  animate={{ 
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    repeatType: "mirror" 
                  }}
                >
                  <img 
                    src="https://images.unsplash.com/photo-1601972599720-36938d4ecd31?q=80&w=500&auto=format&fit=crop" 
                    alt="FixPoint App Preview"
                    className="rounded-3xl shadow-2xl border-8 border-white"
                  />
                  
                  {/* Floating feature badges */}
                  <motion.div
                    className="absolute -left-16 top-16 bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2"
                    animate={{ 
                      y: [0, 5, 0],
                      x: [0, -5, 0],
                      rotate: [0, -3, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      repeatType: "mirror" 
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">Service Alert</div>
                      <div className="text-gray-500">Oil change due</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    className="absolute -right-20 bottom-32 bg-white p-2 rounded-lg shadow-lg flex items-center space-x-2"
                    animate={{ 
                      y: [0, -5, 0],
                      x: [0, 5, 0],
                      rotate: [0, 3, 0]
                    }}
                    transition={{ 
                      duration: 8, 
                      repeat: Infinity,
                      repeatType: "mirror",
                      delay: 1
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">Nearby</div>
                      <div className="text-gray-500">3 service centers</div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} FixPoint Technologies Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center">
            <motion.span 
              className="text-gray-500 flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse" /> in India
            </motion.span>
            <span className="mx-3 text-gray-300">|</span>
            <motion.a 
              href="/animation-demo"
              className="text-primary hover:underline font-medium"
              whileHover={{ 
                scale: 1.1, 
                color: "#F97316",
                transition: { duration: 0.2 }
              }}
            >
              View Animations
            </motion.a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;