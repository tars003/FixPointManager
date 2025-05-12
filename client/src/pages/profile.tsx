import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/layout';
import { 
  User, 
  Car, 
  Edit, 
  Save, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Key,
  FileCheck,
  Sparkles,
  Clock,
  ShieldCheck,
  BadgeCheck,
  RotateCw
} from 'lucide-react';
import { useLocation } from 'wouter';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock user data - in a real app, this would come from your auth context or API
const userProfile = {
  id: 1,
  name: "Rahul Sharma",
  email: "rahul.s@example.com",
  phone: "+91 9876543210",
  address: "123 Koramangala, Bengaluru, Karnataka 560034",
  bio: "Automotive enthusiast and proud car owner. Love exploring new places with my family and taking good care of my vehicles.",
  joinedDate: "January 2023",
  profileImage: "",
  coverImage: "",
  vehicles: [
    { id: 1, name: "Honda City", year: 2022, type: "Sedan", color: "Silver", regNumber: "KA-01-AB-1234" },
    { id: 2, name: "Hyundai Creta", year: 2023, type: "SUV", color: "White", regNumber: "KA-01-CD-5678" }
  ],
  preferences: {
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    darkMode: false,
    language: "English"
  },
  documents: [
    { id: 1, name: "Driver's License", verified: true, expiryDate: "2028-05-20" },
    { id: 2, name: "Insurance Policy", verified: true, expiryDate: "2025-12-15" },
    { id: 3, name: "Vehicle Registration", verified: true, expiryDate: "2027-08-10" }
  ],
  serviceHistory: [
    { id: 1, date: "2024-03-15", type: "Regular Maintenance", vehicleName: "Honda City", status: "Completed" },
    { id: 2, date: "2023-11-20", type: "Tyre Replacement", vehicleName: "Hyundai Creta", status: "Completed" }
  ]
};

const ProfilePage: React.FC = () => {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userProfile.name,
    email: userProfile.email,
    phone: userProfile.phone,
    address: userProfile.address,
    bio: userProfile.bio
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would send this data to your API
    // For this demo, we'll just update the local state and show a toast
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully."
    });
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

  const profileAnimationVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 25,
        duration: 0.5 
      } 
    }
  };

  return (
    <Layout>
      {/* Hero Section with Profile Cover */}
      <section className="relative h-64 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"
            animate={{ 
              scale: [1, 1.2, 1], 
              x: [0, 10, 0], 
              y: [0, -10, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          />
          <motion.div 
            className="absolute top-20 right-20 w-32 h-32 rounded-full bg-indigo-500 opacity-20"
            animate={{ 
              scale: [1, 1.3, 1], 
              x: [0, -15, 0], 
              y: [0, 5, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 1 
            }}
          />
          <motion.div 
            className="absolute bottom-10 left-1/4 w-24 h-24 rounded-full bg-sky-400 opacity-20"
            animate={{ 
              scale: [1, 1.2, 1], 
              x: [0, 20, 0], 
              y: [0, 10, 0] 
            }}
            transition={{ 
              duration: 7, 
              repeat: Infinity,
              repeatType: "mirror",
              delay: 0.5 
            }}
          />
        </div>

        {/* Automotive themed animations */}
        <motion.div 
          className="absolute bottom-5 right-10 text-white opacity-10"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            repeatType: "mirror" 
          }}
        >
          <Car className="w-32 h-32" />
        </motion.div>

        <div className="container relative z-10 h-full flex items-end">
          <div className="pb-5">
            <motion.h1 
              className="text-3xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              My Profile
            </motion.h1>
            <motion.p 
              className="text-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Manage your personal information and preferences
            </motion.p>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="bg-gray-50 min-h-screen">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Profile Card & Avatar - Left Column */}
            <div className="lg:col-span-4">
              <motion.div 
                className="relative -mt-20 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex justify-center">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src="/assets/indian-avatar.png" alt={userProfile.name} />
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-blue-700 text-white">
                        {userProfile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Animation for the avatar */}
                    <motion.div 
                      className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-0"
                      animate={{ 
                        opacity: [0, 0.5, 0],
                        scale: [0.8, 1.1, 0.8],
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror"
                      }}
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                variants={profileAnimationVariants}
                initial="initial"
                animate="animate"
              >
                <Card className="mb-6 shadow-md border-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary to-blue-700" />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl flex items-center">
                        <User className="mr-2 h-5 w-5 text-primary" />
                        Personal Info
                      </CardTitle>
                      {!isEditing ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-500 hover:text-primary"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700"
                          onClick={handleSave}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      )}
                    </div>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">
                            Full Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="text-sm font-medium text-gray-700 block mb-1">
                            Phone
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="address" className="text-sm font-medium text-gray-700 block mb-1">
                            Address
                          </label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="bio" className="text-sm font-medium text-gray-700 block mb-1">
                            Bio
                          </label>
                          <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            className="w-full"
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{userProfile.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{userProfile.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5" />
                          <span className="text-sm">{userProfile.address}</span>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-gray-600">{userProfile.bio}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-gray-50 border-t">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Joined {userProfile.joinedDate}
                    </div>
                  </CardFooter>
                </Card>

                {/* Documents Card */}
                <Card className="mb-6 shadow-md border-none">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-green-500 to-emerald-600" />
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl flex items-center">
                      <FileCheck className="mr-2 h-5 w-5 text-green-500" />
                      Documents
                    </CardTitle>
                    <CardDescription>Your verified documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="space-y-3"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {userProfile.documents.map((doc, index) => (
                        <motion.div 
                          key={doc.id} 
                          className="flex justify-between items-center p-3 bg-white rounded-md border border-gray-100 shadow-sm"
                          variants={itemVariants}
                          whileHover={{ 
                            x: 3,
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                          }}
                        >
                          <div className="flex items-center">
                            <div className="mr-3">
                              <motion.div 
                                className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ duration: 5, repeat: Infinity, delay: index * 0.5 }}
                              >
                                <Key className="h-5 w-5 text-blue-600" />
                              </motion.div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            <BadgeCheck className="h-3 w-3 mr-1" /> 
                            Verified
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Tabs Section - Right Column */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-md border-none">
                  <CardContent className="p-0">
                    <Tabs defaultValue="vehicles" className="w-full">
                      <TabsList className="w-full justify-start rounded-none border-b bg-white p-0">
                        <TabsTrigger 
                          value="vehicles" 
                          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                        >
                          <Car className="h-4 w-4 mr-2" />
                          My Vehicles
                        </TabsTrigger>
                        <TabsTrigger 
                          value="service" 
                          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Service History
                        </TabsTrigger>
                        <TabsTrigger 
                          value="activity" 
                          className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none py-3"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Activity
                        </TabsTrigger>
                      </TabsList>

                      {/* My Vehicles Tab */}
                      <TabsContent value="vehicles" className="p-6">
                        <div className="mb-4 flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-gray-900">Registered Vehicles</h3>
                          <Button 
                            className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary"
                            onClick={() => navigate('/vehicle-vault')}
                          >
                            <Car className="h-4 w-4 mr-2" />
                            Add Vehicle
                          </Button>
                        </div>

                        <motion.div 
                          className="grid grid-cols-1 md:grid-cols-2 gap-5"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {userProfile.vehicles.map((vehicle, index) => (
                            <motion.div 
                              key={vehicle.id}
                              className="relative overflow-hidden rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                              variants={itemVariants}
                            >
                              {/* Car animation */}
                              <div className="absolute top-2 right-2">
                                <motion.div
                                  animate={{
                                    y: [0, -5, 0],
                                    scale: [1, 1.05, 1]
                                  }}
                                  transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "mirror",
                                    delay: index * 0.3
                                  }}
                                >
                                  <Car className={cn(
                                    "h-8 w-8",
                                    index % 2 === 0 ? "text-blue-500" : "text-indigo-500"
                                  )} />
                                </motion.div>
                              </div>

                              <div className="p-5">
                                <div className="flex items-center mb-3">
                                  <div className={cn(
                                    "w-2 h-10 rounded-full mr-3",
                                    index % 2 === 0 ? "bg-blue-500" : "bg-indigo-500"
                                  )} />
                                  <div>
                                    <h4 className="text-lg font-semibold">{vehicle.name}</h4>
                                    <p className="text-gray-500 text-sm">{vehicle.year} • {vehicle.type}</p>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-500">Registration</p>
                                    <p className="font-medium">{vehicle.regNumber}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500">Color</p>
                                    <p className="font-medium">{vehicle.color}</p>
                                  </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-primary hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => navigate(`/vehicle-vault/${vehicle.id}`)}
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* Add New Vehicle Card */}
                          <motion.div 
                            className="rounded-lg border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors h-full min-h-[200px] flex items-center justify-center cursor-pointer"
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => navigate('/vehicle-vault')}
                          >
                            <div className="text-center p-6">
                              <motion.div 
                                className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, 0, -5, 0]
                                }}
                                transition={{
                                  duration: 4,
                                  repeat: Infinity,
                                  repeatType: "mirror"
                                }}
                              >
                                <Car className="h-8 w-8 text-primary" />
                              </motion.div>
                              <h4 className="text-primary font-semibold">Add New Vehicle</h4>
                              <p className="text-gray-500 text-sm mt-1">Click to register a new vehicle</p>
                            </div>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      {/* Service History Tab */}
                      <TabsContent value="service" className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Service History</h3>
                          <p className="text-gray-500">All service and maintenance records for your vehicles</p>
                        </div>

                        <motion.div 
                          className="space-y-4"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {userProfile.serviceHistory.map((service, index) => (
                            <motion.div 
                              key={service.id} 
                              className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden"
                              variants={itemVariants}
                            >
                              <div className="flex flex-col md:flex-row">
                                <div className="bg-gray-50 p-4 md:w-1/4 flex items-center md:border-r border-gray-100">
                                  <div className="w-full">
                                    <p className="text-gray-500 text-sm">Service Date</p>
                                    <p className="font-semibold">{new Date(service.date).toLocaleDateString('en-IN', { 
                                      day: 'numeric', 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })}</p>
                                    
                                    <div className="mt-3 flex items-center">
                                      <motion.div
                                        animate={{
                                          rotate: 360
                                        }}
                                        transition={{
                                          duration: 8,
                                          repeat: Infinity,
                                          ease: "linear",
                                          delay: index * 0.5
                                        }}
                                      >
                                        <RotateCw className="h-4 w-4 text-primary mr-1" />
                                      </motion.div>
                                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                        {service.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-4 md:flex-1">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{service.type}</h4>
                                      <p className="text-sm text-gray-500">Vehicle: {service.vehicleName}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-primary hover:text-blue-700"
                                    >
                                      View Details
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          <motion.div 
                            className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-4"
                            variants={itemVariants}
                          >
                            <Button 
                              variant="outline" 
                              className="border-primary text-primary hover:bg-primary/5"
                              onClick={() => navigate('/book-service')}
                            >
                              Schedule New Service
                            </Button>
                          </motion.div>
                        </motion.div>
                      </TabsContent>

                      {/* Activity Tab */}
                      <TabsContent value="activity" className="p-6">
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">Recent Activity</h3>
                          <p className="text-gray-500">Your recent actions and notifications</p>
                        </div>

                        <motion.div 
                          className="relative pl-8 space-y-8 before:absolute before:left-4 before:top-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-indigo-500 before:to-blue-100"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {[
                            { 
                              id: 1, 
                              title: "Service Completed", 
                              description: "Regular maintenance for Honda City completed successfully", 
                              date: "2 days ago",
                              icon: ShieldCheck,
                              iconColor: "bg-green-500"
                            },
                            { 
                              id: 2, 
                              title: "Document Updated", 
                              description: "Vehicle insurance policy renewed and updated", 
                              date: "1 week ago",
                              icon: FileCheck,
                              iconColor: "bg-blue-500"
                            },
                            { 
                              id: 3, 
                              title: "New Vehicle Added", 
                              description: "Added Hyundai Creta to your vehicle collection", 
                              date: "2 months ago",
                              icon: Car,
                              iconColor: "bg-indigo-500"
                            }
                          ].map((activity, index) => (
                            <motion.div 
                              key={activity.id} 
                              className="relative"
                              variants={itemVariants}
                            >
                              <motion.div 
                                className={cn(
                                  "absolute -left-10 w-8 h-8 rounded-full flex items-center justify-center z-10",
                                  activity.iconColor
                                )}
                                animate={{ 
                                  scale: [1, 1.2, 1],
                                  boxShadow: [
                                    "0 0 0 0 rgba(59, 130, 246, 0.5)",
                                    "0 0 0 10px rgba(59, 130, 246, 0)",
                                    "0 0 0 0 rgba(59, 130, 246, 0)"
                                  ]
                                }}
                                transition={{ 
                                  duration: 3, 
                                  repeat: Infinity,
                                  repeatType: "mirror",
                                  delay: index * 0.5
                                }}
                              >
                                <activity.icon className="h-4 w-4 text-white" />
                              </motion.div>
                              
                              <div className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm ml-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                                  </div>
                                  <span className="text-xs text-gray-400">{activity.date}</span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;