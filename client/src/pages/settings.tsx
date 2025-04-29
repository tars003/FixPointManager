import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/layout';
import { 
  Settings as SettingsIcon, 
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  Smartphone,
  CreditCard,
  Trash2,
  Save,
  ShieldCheck,
  Key,
  LogOut,
  Gauge,
  ToggleLeft,
  ToggleRight,
  Fuel,
  Wrench,
  Percent,
  Bus,
  Lightbulb,
  Mail,
  FileCheck,
  MapPin,
  Car,
  Calendar,
  Badge
} from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Mock preferences data
const userPreferences = {
  notifications: {
    email: true,
    sms: false,
    push: true,
    marketing: false,
    serviceReminders: true,
    documentExpiry: true,
  },
  appearance: {
    theme: 'light',
    language: 'en',
    distanceUnit: 'km',
    fuelUnit: 'liters',
    currency: 'INR'
  },
  privacy: {
    shareVehicleData: true,
    shareLocationData: false,
    dataCollectionConsent: true
  },
  security: {
    twoFactorAuth: false,
    passwordLastChanged: '2024-02-15',
    loginAlerts: true
  },
  payment: {
    defaultMethod: 'card',
    savedCards: [
      { id: 1, last4: '4242', type: 'Visa', expiryDate: '06/26' },
      { id: 2, last4: '1234', type: 'Mastercard', expiryDate: '08/25' }
    ]
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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

// Automotive themed animation components
const AnimatedGauge = () => (
  <motion.div 
    className="relative w-16 h-16 flex items-center justify-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Gauge className="w-16 h-16 text-gray-200" />
    <motion.div
      className="absolute"
      animate={{
        rotate: [-45, 120, -45]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    >
      <div className="w-8 h-0.5 bg-red-500 rounded-full origin-left" />
    </motion.div>
  </motion.div>
);

const AnimatedFuel = () => (
  <motion.div
    className="relative"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <Fuel className="w-12 h-12 text-amber-500" />
    <motion.div
      className="absolute bottom-0 left-0 right-0 bg-amber-500 rounded-b-md"
      initial={{ height: '10%' }}
      animate={{ height: ['10%', '85%', '10%'] }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "mirror"
      }}
      style={{ opacity: 0.3 }}
    />
  </motion.div>
);

const AnimatedSettings = () => (
  <motion.div
    animate={{
      rotate: 360
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      ease: "linear"
    }}
    className="text-primary"
  >
    <SettingsIcon className="w-14 h-14" />
  </motion.div>
);

const BatteryAnimation = () => (
  <motion.div className="relative w-16 h-8 border-2 border-gray-400 rounded-md flex items-center px-1">
    <motion.div 
      className="absolute right-[-5px] w-2 h-4 bg-gray-400 rounded-r-sm"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    />
    <motion.div 
      className="h-4 bg-green-500 rounded-sm"
      initial={{ width: '10%' }}
      animate={{ width: ['10%', '95%', '10%'] }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  </motion.div>
);

const LockAnimation = () => (
  <div className="relative w-16 h-16 flex items-center justify-center">
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    >
      <Lock className="w-12 h-12 text-blue-600" />
    </motion.div>
    <motion.div
      className="absolute inset-0 border-2 border-blue-400 rounded-full"
      initial={{ opacity: 0.5, scale: 0.8 }}
      animate={{
        opacity: [0.5, 0, 0.5],
        scale: [0.8, 1.5, 0.8]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  </div>
);

const LightAnimation = () => (
  <div className="relative">
    <Lightbulb className="w-12 h-12 text-yellow-400" />
    <motion.div
      className="absolute inset-0 bg-yellow-400 rounded-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.3, 0]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  </div>
);

const PulsingNotification = () => (
  <div className="relative">
    <Bell className="w-12 h-12 text-primary" />
    <motion.div
      className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"
      animate={{
        scale: [1, 1.5, 1]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  </div>
);

const SpinningWrench = () => (
  <motion.div
    animate={{
      rotate: [0, 360]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="text-indigo-600"
  >
    <Wrench className="w-12 h-12" />
  </motion.div>
);

const PercentageAnimation = () => (
  <motion.div className="relative flex items-center justify-center">
    <Percent className="w-12 h-12 text-green-500" />
    <motion.div
      className="absolute inset-0 bg-green-500 rounded-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 0.2, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror"
      }}
    />
  </motion.div>
);

const MovingBus = () => (
  <motion.div
    animate={{
      x: [-20, 20, -20]
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      repeatType: "mirror"
    }}
    className="text-orange-500"
  >
    <Bus className="w-16 h-12" />
  </motion.div>
);

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [preferences, setPreferences] = useState(userPreferences);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleToggleChange = (category: keyof typeof userPreferences, setting: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, any>),
        [setting]: value
      }
    }));
  };
  
  const handleSelectChange = (category: keyof typeof userPreferences, setting: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, any>),
        [setting]: value
      }
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = () => {
    // In a real app, you would send the updated preferences to your API
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully."
    });
  };
  
  const handleSavePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would send the password update request to your API
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully."
    });
    
    // Reset form
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-64 overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-700">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-10 left-1/4 w-40 h-40 rounded-full bg-indigo-500 opacity-20"
            animate={{ 
              scale: [1, 1.2, 1], 
              y: [0, -15, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          />
          <motion.div 
            className="absolute bottom-0 right-1/3 w-32 h-32 rounded-full bg-blue-500 opacity-20"
            animate={{ 
              scale: [1, 1.1, 1], 
              x: [0, 20, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.5 
            }}
          />
        </div>

        {/* Automotive themed animation */}
        <motion.div 
          className="absolute bottom-0 right-10 text-white opacity-10"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <AnimatedSettings />
        </motion.div>

        <div className="container relative z-10 h-full flex items-end">
          <div className="pb-5">
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Settings
            </motion.h1>
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Customize your preferences and account settings
            </motion.p>
          </div>
        </div>
      </section>

      {/* Settings Content */}
      <section className="bg-gray-50 min-h-screen py-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Settings Menu - Left Sidebar */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-md sticky top-24">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg">Settings Menu</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <Tabs defaultValue="notifications" orientation="vertical" className="w-full">
                      <TabsList className="flex flex-col h-auto w-full justify-start items-start p-0 bg-transparent gap-1">
                        <TabsTrigger 
                          value="notifications" 
                          className="w-full justify-start border border-transparent data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 rounded-md h-10 px-3"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger 
                          value="appearance" 
                          className="w-full justify-start border border-transparent data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 rounded-md h-10 px-3"
                        >
                          <Sun className="h-4 w-4 mr-2" />
                          Appearance
                        </TabsTrigger>
                        <TabsTrigger 
                          value="privacy" 
                          className="w-full justify-start border border-transparent data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 rounded-md h-10 px-3"
                        >
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Privacy
                        </TabsTrigger>
                        <TabsTrigger 
                          value="security" 
                          className="w-full justify-start border border-transparent data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 rounded-md h-10 px-3"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Security
                        </TabsTrigger>
                        <TabsTrigger 
                          value="payment" 
                          className="w-full justify-start border border-transparent data-[state=active]:border-blue-100 data-[state=active]:bg-blue-50 rounded-md h-10 px-3"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payment Methods
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>

                    <div className="mt-8 pt-8 border-t space-y-4">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => navigate('/logout')}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-gray-500 mb-4">
                              Please type "DELETE" to confirm account deletion:
                            </p>
                            <Input placeholder="Type DELETE to confirm" />
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Delete Account</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>

                {/* Animated elements */}
                <div className="mt-8 hidden lg:block">
                  <div className="space-y-6">
                    <motion.div 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center"
                      whileHover={{ y: -3 }}
                    >
                      <AnimatedGauge />
                    </motion.div>
                    <motion.div 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center"
                      whileHover={{ y: -3 }}
                    >
                      <BatteryAnimation />
                    </motion.div>
                    <motion.div 
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center"
                      whileHover={{ y: -3 }}
                    >
                      <AnimatedFuel />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Settings Content - Right Panel */}
            <div className="lg:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border-none shadow-md">
                  <CardContent className="p-0">
                    <Tabs defaultValue="notifications" className="w-full">
                      {/* Notifications Tab */}
                      <TabsContent value="notifications" className="pt-0 px-0">
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Notification Preferences</h3>
                            <p className="text-gray-500 text-sm">Manage how and when you receive notifications</p>
                          </div>
                          <div className="flex items-center">
                            <PulsingNotification />
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.div 
                            className="space-y-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants}>
                              <h4 className="text-md font-medium mb-4">Notification Channels</h4>
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="email-notifications" 
                                    checked={preferences.notifications.email}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'email', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Smartphone className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="sms-notifications" 
                                    checked={preferences.notifications.sms}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'sms', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Bell className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                                      <p className="text-sm text-gray-500">Receive notifications on your device</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="push-notifications" 
                                    checked={preferences.notifications.push}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'push', checked)}
                                  />
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <h4 className="text-md font-medium mb-4">Notification Types</h4>
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Wrench className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="service-reminders" className="text-base">Service Reminders</Label>
                                      <p className="text-sm text-gray-500">Get notified about upcoming maintenance</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="service-reminders" 
                                    checked={preferences.notifications.serviceReminders}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'serviceReminders', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <FileCheck className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="document-expiry" className="text-base">Document Expiry</Label>
                                      <p className="text-sm text-gray-500">Get notified before your documents expire</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="document-expiry" 
                                    checked={preferences.notifications.documentExpiry}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'documentExpiry', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <ToggleLeft className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="marketing-notifications" className="text-base">Marketing Updates</Label>
                                      <p className="text-sm text-gray-500">Receive marketing and promotional messages</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="marketing-notifications" 
                                    checked={preferences.notifications.marketing}
                                    onCheckedChange={(checked) => handleToggleChange('notifications', 'marketing', checked)}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </TabsContent>

                      {/* Appearance Tab */}
                      <TabsContent value="appearance" className="pt-0 px-0">
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Appearance Settings</h3>
                            <p className="text-gray-500 text-sm">Customize how FixPoint looks and feels</p>
                          </div>
                          <div className="flex items-center">
                            <LightAnimation />
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.div 
                            className="space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants} className="space-y-4">
                              <div>
                                <h4 className="text-md font-medium mb-2">Theme</h4>
                                <p className="text-sm text-gray-500 mb-4">Choose between light and dark mode</p>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div 
                                  className={cn(
                                    "border rounded-lg p-4 cursor-pointer transition-all",
                                    preferences.appearance.theme === 'light' 
                                      ? "border-primary bg-blue-50" 
                                      : "border-gray-200 hover:border-gray-300"
                                  )}
                                  onClick={() => handleSelectChange('appearance', 'theme', 'light')}
                                >
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                      <Sun className="h-5 w-5 text-amber-500 mr-2" />
                                      <span className="font-medium">Light Mode</span>
                                    </div>
                                    {preferences.appearance.theme === 'light' && (
                                      <div className="w-4 h-4 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <div className="bg-white border border-gray-200 rounded h-20" />
                                </div>
                                
                                <div 
                                  className={cn(
                                    "border rounded-lg p-4 cursor-pointer transition-all",
                                    preferences.appearance.theme === 'dark' 
                                      ? "border-primary bg-blue-50" 
                                      : "border-gray-200 hover:border-gray-300"
                                  )}
                                  onClick={() => handleSelectChange('appearance', 'theme', 'dark')}
                                >
                                  <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center">
                                      <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                                      <span className="font-medium">Dark Mode</span>
                                    </div>
                                    {preferences.appearance.theme === 'dark' && (
                                      <div className="w-4 h-4 rounded-full bg-primary" />
                                    )}
                                  </div>
                                  <div className="bg-gray-800 border border-gray-700 rounded h-20" />
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t space-y-6">
                              <h4 className="text-md font-medium mb-4">Language & Units</h4>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="language" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                    <Globe className="h-4 w-4 inline mr-1.5" />
                                    Language
                                  </Label>
                                  <Select 
                                    value={preferences.appearance.language}
                                    onValueChange={(value) => handleSelectChange('appearance', 'language', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="en">English</SelectItem>
                                      <SelectItem value="hi">Hindi</SelectItem>
                                      <SelectItem value="ta">Tamil</SelectItem>
                                      <SelectItem value="te">Telugu</SelectItem>
                                      <SelectItem value="mr">Marathi</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label htmlFor="distance-unit" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                      <MapPin className="h-4 w-4 inline mr-1.5" />
                                      Distance Unit
                                    </Label>
                                    <Select 
                                      value={preferences.appearance.distanceUnit}
                                      onValueChange={(value) => handleSelectChange('appearance', 'distanceUnit', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="km">Kilometers (km)</SelectItem>
                                        <SelectItem value="mi">Miles (mi)</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <Label htmlFor="fuel-unit" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                      <Fuel className="h-4 w-4 inline mr-1.5" />
                                      Fuel Unit
                                    </Label>
                                    <Select 
                                      value={preferences.appearance.fuelUnit}
                                      onValueChange={(value) => handleSelectChange('appearance', 'fuelUnit', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select unit" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="liters">Liters</SelectItem>
                                        <SelectItem value="gallons">Gallons</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label htmlFor="currency" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                    <PercentageAnimation />
                                    Currency
                                  </Label>
                                  <Select 
                                    value={preferences.appearance.currency}
                                    onValueChange={(value) => handleSelectChange('appearance', 'currency', value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </TabsContent>

                      {/* Privacy Tab */}
                      <TabsContent value="privacy" className="pt-0 px-0">
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Privacy Settings</h3>
                            <p className="text-gray-500 text-sm">Manage your data privacy and sharing preferences</p>
                          </div>
                          <div className="flex items-center">
                            <ShieldCheck className="h-12 w-12 text-green-500" />
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.div 
                            className="space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants}>
                              <h4 className="text-md font-medium mb-4">Data Sharing</h4>
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Car className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="share-vehicle-data" className="text-base">Vehicle Data Sharing</Label>
                                      <p className="text-sm text-gray-500">Share anonymous vehicle data to improve services</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="share-vehicle-data" 
                                    checked={preferences.privacy.shareVehicleData}
                                    onCheckedChange={(checked) => handleToggleChange('privacy', 'shareVehicleData', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <MapPin className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="share-location-data" className="text-base">Location Data Sharing</Label>
                                      <p className="text-sm text-gray-500">Share your location data for improved nearby services</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="share-location-data" 
                                    checked={preferences.privacy.shareLocationData}
                                    onCheckedChange={(checked) => handleToggleChange('privacy', 'shareLocationData', checked)}
                                  />
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                  <div className="mr-3 mt-0.5">
                                    <MovingBus />
                                  </div>
                                  <div>
                                    <h5 className="font-medium text-blue-900">Your data is always protected</h5>
                                    <p className="text-sm text-blue-700 mt-1">
                                      FixPoint uses industry-leading security measures to protect your personal information. 
                                      Your data is encrypted and securely stored according to our privacy policy. 
                                      We never sell your personal information to third parties.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="data-collection-consent" className="text-base">Data Collection Consent</Label>
                                      <p className="text-sm text-gray-500">Allow collection of usage data to improve your experience</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="data-collection-consent" 
                                    checked={preferences.privacy.dataCollectionConsent}
                                    onCheckedChange={(checked) => handleToggleChange('privacy', 'dataCollectionConsent', checked)}
                                  />
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <h4 className="text-md font-medium mb-4">Data Management</h4>
                              <div className="space-y-4">
                                <Button 
                                  variant="outline" 
                                  className="border-primary text-primary hover:bg-primary/5"
                                >
                                  Download My Data
                                </Button>
                                <p className="text-sm text-gray-500">
                                  Request a complete copy of all your personal data. This may take up to 48 hours to process.
                                </p>
                              </div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </TabsContent>

                      {/* Security Tab */}
                      <TabsContent value="security" className="pt-0 px-0">
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Security Settings</h3>
                            <p className="text-gray-500 text-sm">Protect your account with additional security measures</p>
                          </div>
                          <div className="flex items-center">
                            <LockAnimation />
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.div 
                            className="space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants}>
                              <h4 className="text-md font-medium mb-4">Password</h4>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="current-password" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Current Password
                                      </Label>
                                      <Input 
                                        type="password" 
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="new-password" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        New Password
                                      </Label>
                                      <Input 
                                        type="password" 
                                        id="newPassword"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full"
                                      />
                                    </div>

                                    <div>
                                      <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Confirm New Password
                                      </Label>
                                      <Input 
                                        type="password" 
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full"
                                      />
                                    </div>

                                    <div className="pt-2">
                                      <Button 
                                        onClick={handleSavePassword}
                                        className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary"
                                      >
                                        <Key className="h-4 w-4 mr-2" />
                                        Update Password
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <div className="mt-4 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1.5" />
                                Password last changed: {new Date(preferences.security.passwordLastChanged).toLocaleDateString()}
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <h4 className="text-md font-medium mb-4">Additional Security</h4>
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Smartphone className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="two-factor-auth" className="text-base">Two-Factor Authentication</Label>
                                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="two-factor-auth" 
                                    checked={preferences.security.twoFactorAuth}
                                    onCheckedChange={(checked) => handleToggleChange('security', 'twoFactorAuth', checked)}
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex flex-1 items-center space-x-2">
                                    <Bell className="h-5 w-5 text-gray-500" />
                                    <div>
                                      <Label htmlFor="login-alerts" className="text-base">Login Alerts</Label>
                                      <p className="text-sm text-gray-500">Get notified about new sign-ins to your account</p>
                                    </div>
                                  </div>
                                  <Switch 
                                    id="login-alerts" 
                                    checked={preferences.security.loginAlerts}
                                    onCheckedChange={(checked) => handleToggleChange('security', 'loginAlerts', checked)}
                                  />
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <h4 className="text-md font-medium mb-4">Sessions</h4>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                      <div>
                                        <p className="font-medium">Current Session</p>
                                        <p className="text-sm text-gray-500">Web Browser • Delhi, India</p>
                                      </div>
                                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
                                        Active Now
                                      </span>
                                    </div>
                                    
                                    <Button 
                                      variant="outline" 
                                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                    >
                                      Sign Out of All Other Devices
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </motion.div>
                        </div>
                      </TabsContent>

                      {/* Payment Methods Tab */}
                      <TabsContent value="payment" className="pt-0 px-0">
                        <div className="p-6 border-b flex justify-between items-center">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">Payment Methods</h3>
                            <p className="text-gray-500 text-sm">Manage your payment methods and billing preferences</p>
                          </div>
                          <div className="flex items-center">
                            <SpinningWrench />
                          </div>
                        </div>

                        <div className="p-6">
                          <motion.div 
                            className="space-y-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            <motion.div variants={itemVariants}>
                              <h4 className="text-md font-medium mb-4">Saved Payment Methods</h4>
                              <div className="space-y-4">
                                {preferences.payment.savedCards.map((card, index) => (
                                  <div 
                                    key={card.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                                  >
                                    <div className="flex items-center">
                                      <div className="mr-4">
                                        {card.type === 'Visa' ? (
                                          <div className="w-12 h-8 bg-blue-700 rounded flex items-center justify-center text-white font-bold">
                                            VISA
                                          </div>
                                        ) : (
                                          <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold text-xs">
                                            MASTER
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <p className="font-medium">•••• •••• •••• {card.last4}</p>
                                        <p className="text-sm text-gray-500">Expires {card.expiryDate}</p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-gray-500 hover:text-gray-700"
                                      >
                                        Edit
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                ))}

                                <div className="mt-6">
                                  <Button 
                                    className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary"
                                  >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Add New Payment Method
                                  </Button>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="pt-6 border-t">
                              <h4 className="text-md font-medium mb-4">Billing Information</h4>
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="billing-name" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Full Name
                                      </Label>
                                      <Input 
                                        id="billing-name"
                                        defaultValue="Rahul Sharma"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Label htmlFor="billing-address" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                        Billing Address
                                      </Label>
                                      <Input 
                                        id="billing-address"
                                        defaultValue="123 Koramangala, Bengaluru, Karnataka 560034"
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label htmlFor="gstin" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                          GSTIN (Optional)
                                        </Label>
                                        <Input 
                                          id="gstin"
                                          placeholder="Enter GSTIN if applicable"
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="billing-email" className="text-sm font-medium text-gray-700 mb-1.5 block">
                                          Billing Email
                                        </Label>
                                        <Input 
                                          id="billing-email"
                                          type="email"
                                          defaultValue="rahul.s@example.com"
                                        />
                                      </div>
                                    </div>
                                    
                                    <div className="pt-2">
                                      <Button 
                                        className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary"
                                      >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Billing Information
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </motion.div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Save All Settings Button */}
                <motion.div 
                  className="mt-6 flex justify-end"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Button 
                    onClick={handleSaveSettings}
                    className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary"
                    size="lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save All Changes
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SettingsPage;