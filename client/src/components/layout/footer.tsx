import React from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
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
  HeartHandshake
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
      transition: { duration: 2, repeat: Infinity, repeatType: "mirror" }
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
      
      {/* App Promotion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-6 border-t border-b relative overflow-hidden">
        <motion.div 
          className="absolute right-0 bottom-0 opacity-10"
          animate={{ 
            y: [0, 5, 0],
            scale: [1, 1.05, 1] 
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <Zap className="h-32 w-32 text-yellow-500" />
        </motion.div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 md:mb-0">
              <h4 className="font-semibold text-gray-900 text-lg">Download the FixPoint App</h4>
              <p className="text-sm text-gray-600">Get real-time updates and manage your vehicles on the go</p>
            </div>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                <Button className="bg-gradient-to-r from-gray-800 to-black text-white shadow-md" size="sm">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 mr-2" fill="currentColor">
                    <path d="M17.5234 12.3582L14.5547 10.3239L14.1152 9.97376C13.5937 9.58813 13.5547 9.3082 13.5547 9.19542C13.5547 9.08264 13.6133 8.84042 14.1152 8.41709L17.4453 5.64146C17.6406 5.4614 17.9141 5.4614 18.1094 5.64146L23.8281 10.3239C24.0234 10.504 24.0624 10.7613 23.8672 10.9794L18.1484 16.047C17.9531 16.2651 17.6797 16.2651 17.4844 16.085L17.5234 12.3582ZM4.31248 0C6.24998 0 7.65622 0.676423 8.71873 1.95098L8.83591 2.10147L12.6952 9.15772C12.8124 9.38203 12.7538 9.64216 12.5585 9.82222L1.40622 19.7329C1.21092 19.8956 0.937475 19.913 0.742162 19.7329C0.546849 19.5903 0.507787 19.2982 0.624975 19.0739L4.25779 11.5853L0.624975 4.0967C0.468725 3.7699 0.351537 3.44309 0.273412 3.11629V2.86436C0.273412 1.27176 2.05466 0 4.31248 0Z" />
                  </svg>
                  Google Play
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }}>
                <Button className="bg-gradient-to-r from-gray-800 to-black text-white shadow-md" size="sm">
                  <svg viewBox="0 0 384 512" className="h-4 w-4 mr-2" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  App Store
                </Button>
              </motion.div>
            </div>
          </motion.div>
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