import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FixPointCard, { FixPointCardDeck } from "@/components/membership/FixPointCard";
import {
  CreditCard,
  Shield,
  Zap,
  Clock,
  Award,
  Check,
  Users,
  Car,
  Loader2,
  AlertCircle
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const MembershipPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upgradeRequested, setUpgradeRequested] = useState(false);

  const handleUpgrade = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setUpgradeRequested(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            FixPoint Membership Program
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock premium vehicle services, exclusive benefits, and priority assistance with your FixPoint membership card.
          </p>
        </motion.div>

        <div className="mb-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-8">
              <TabsTrigger value="overview" className="text-sm flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">Membership</span> Overview
              </TabsTrigger>
              <TabsTrigger value="mycard" className="text-sm flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                My Card
              </TabsTrigger>
              <TabsTrigger value="benefits" className="text-sm flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                Benefits
              </TabsTrigger>
              <TabsTrigger value="faq" className="text-sm flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Community & FAQs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 bg-white rounded-xl border shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-6">FixPoint Membership</h2>
                <p className="text-gray-600 mb-4">
                  The FixPoint Membership Card is your key to a world of vehicle management benefits. 
                  Choose from three tiers designed to meet different vehicle ownership needs:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-blue-800">Basic</h3>
                      <p className="text-sm font-bold bg-blue-200 text-blue-800 px-3 py-1 rounded-full">
                        ₹1,999/yr
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Essential coverage for peace of mind on the road.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-blue-600 mr-2" />
                        <span>Basic roadside assistance</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-blue-600 mr-2" />
                        <span>24/7 customer support</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-blue-600 mr-2" />
                        <span>Standard service network</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-indigo-900 p-6 rounded-lg text-white">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold">Premium</h3>
                      <p className="text-sm font-bold bg-indigo-700 px-3 py-1 rounded-full">
                        ₹3,999/yr
                      </p>
                    </div>
                    <p className="text-sm text-indigo-200 mb-4">
                      Enhanced protection and priority service for busy vehicle owners.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-indigo-300 mr-2" />
                        <span>Premium roadside assistance</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-indigo-300 mr-2" />
                        <span>Priority service booking</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-indigo-300 mr-2" />
                        <span>Advanced maintenance plans</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-indigo-300 mr-2" />
                        <span>Nationwide service network</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-amber-800">Elite</h3>
                      <p className="text-sm font-bold bg-amber-200 text-amber-800 px-3 py-1 rounded-full">
                        ₹9,999/yr
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Luxury concierge service with global coverage for discerning vehicle owners.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Comprehensive protection</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Dedicated concierge service</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Expedited service & repairs</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Annual vehicle inspection</span>
                      </li>
                      <li className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-amber-600 mr-2" />
                        <span>Global assistance coverage</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <FixPointCardDeck />
            </TabsContent>

            <TabsContent value="mycard" className="p-6 bg-white rounded-xl border shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Your Membership Card</h2>
                  <p className="text-gray-600 mb-6">
                    Your FixPoint Premium membership gives you access to enhanced services and priority bookings at authorized service centers nationwide.
                  </p>

                  <div className="mb-6">
                    <FixPointCard
                      userName="Rajesh Kumar"
                      membershipType="premium"
                      membershipNumber="2241 8891 4412 5551"
                      vehicleCount={2}
                      points={1250}
                      onActivate={() => alert("Benefits activated")}
                      onManage={() => setActiveTab("benefits")}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <Button 
                      variant="outline" 
                      className="flex items-center justify-center gap-2"
                      onClick={() => setActiveTab("benefits")}
                    >
                      <Zap className="h-4 w-4" />
                      View Benefits
                    </Button>
                    <Button 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                      onClick={handleUpgrade}
                      disabled={isSubmitting || upgradeRequested}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : upgradeRequested ? (
                        <>
                          <Check className="h-4 w-4" />
                          Upgrade Requested
                        </>
                      ) : (
                        <>
                          <Award className="h-4 w-4" />
                          Upgrade to Elite
                        </>
                      )}
                    </Button>
                  </div>

                  {upgradeRequested && (
                    <Alert className="mt-6 bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle>Upgrade Request Received</AlertTitle>
                      <AlertDescription>
                        Your request to upgrade to Elite membership has been received. Our team will contact you within 24 hours to complete the process.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-bold mb-4">Activity & Points</h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Available Points</span>
                      <span className="text-2xl font-bold">1,250</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">750 more points to reach Gold tier</p>
                  </div>

                  <h4 className="font-medium text-gray-700 mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    {[
                      { date: "April 25, 2025", activity: "Service Booking", points: "+250" },
                      { date: "March 12, 2025", activity: "Tire Replacement", points: "+150" },
                      { date: "February 28, 2025", activity: "Oil Change", points: "+100" },
                      { date: "January 15, 2025", activity: "Annual Inspection", points: "+500" },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between p-3 bg-white rounded-lg border">
                        <div>
                          <p className="font-medium">{item.activity}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                        <p className="text-green-600 font-medium">{item.points}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-3">Registered Vehicles</h4>
                    <div className="space-y-3">
                      {[
                        { name: "Honda City", year: "2023", color: "Silver" },
                        { name: "Hyundai Creta", year: "2021", color: "White" },
                      ].map((vehicle, index) => (
                        <div key={index} className="flex items-center p-3 bg-white rounded-lg border">
                          <Car className="h-6 w-6 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium">{vehicle.name}</p>
                            <p className="text-xs text-gray-500">{vehicle.year} • {vehicle.color}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="p-6 bg-white rounded-xl border shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Premium Membership Benefits</h2>
                <p className="text-gray-600">
                  Your FixPoint Premium membership includes the following benefits and services designed to enhance your vehicle ownership experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-3">
                      <Shield className="h-6 w-6 text-indigo-600 mr-3" />
                      <h3 className="text-xl font-bold">Premium Roadside Assistance</h3>
                    </div>
                    <p className="text-gray-600 pl-9">
                      Enjoy 24/7 emergency assistance with faster response times and extended towing distances. Our premium service includes battery jump-starts, flat tire changes, fuel delivery, and lockout assistance nationwide.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <Zap className="h-6 w-6 text-indigo-600 mr-3" />
                      <h3 className="text-xl font-bold">Priority Service Booking</h3>
                    </div>
                    <p className="text-gray-600 pl-9">
                      Skip the queue with priority scheduling at all authorized service centers. Premium members get guaranteed same-day emergency appointments and expedited service completion.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center mb-3">
                      <Clock className="h-6 w-6 text-indigo-600 mr-3" />
                      <h3 className="text-xl font-bold">Advanced Maintenance Plans</h3>
                    </div>
                    <p className="text-gray-600 pl-9">
                      Receive customized maintenance schedules and reminders based on your specific vehicle model and driving patterns. Our predictive maintenance technology helps prevent breakdowns before they happen.
                    </p>
                  </div>
                </div>

                <div>
                  <div className="bg-indigo-50 p-6 rounded-xl mb-6">
                    <h3 className="text-lg font-bold mb-4">Exclusive Premium Discounts</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">20% off on all regular maintenance services</p>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">15% discount on genuine parts and accessories</p>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">Free annual vehicle inspection worth ₹2,500</p>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">Complimentary car wash with every service</p>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-indigo-600 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">10% off on premium car detailing services</p>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl text-white">
                    <h3 className="text-lg font-bold mb-2">FixPoint Premium Rewards</h3>
                    <p className="text-indigo-200 text-sm mb-4">
                      Earn points with every service and redeem them for exclusive rewards:
                    </p>
                    <ul className="space-y-3 mb-4">
                      <li className="flex items-start">
                        <Award className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-white text-sm">2x points accumulation compared to Basic members</p>
                      </li>
                      <li className="flex items-start">
                        <Award className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-white text-sm">Redeem points for service vouchers, accessories, or fuel cards</p>
                      </li>
                      <li className="flex items-start">
                        <Award className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                        <p className="text-white text-sm">Exclusive access to limited-edition merchandise</p>
                      </li>
                    </ul>
                    <Button className="w-full bg-white hover:bg-gray-100 text-indigo-900">
                      View Rewards Catalog
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="p-6 bg-white rounded-xl border shadow-sm">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-gray-600">
                  Find answers to common questions about the FixPoint Membership Program.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How do I upgrade my membership tier?",
                    answer: "You can upgrade your membership tier directly from your account dashboard or by contacting our customer support team at 1800-123-4567. Upgrades take effect immediately, and you'll be charged the prorated difference between your current tier and the new tier for the remainder of your billing cycle."
                  },
                  {
                    question: "Are membership benefits transferable to other vehicles?",
                    answer: "Yes, your membership benefits can be used with any vehicle registered under your account. Premium and Elite memberships allow you to register multiple vehicles (2 for Premium, 3 for Elite). Basic membership covers only one vehicle."
                  },
                  {
                    question: "How do I earn membership points?",
                    answer: "You earn points for every service booked through the FixPoint platform, including regular maintenance, emergency services, and parts purchases. Premium members earn 2x points, while Elite members earn 3x points compared to Basic tier members."
                  },
                  {
                    question: "What's the cancellation policy?",
                    answer: "You can cancel your membership at any time. If you cancel within the first 30 days, you'll receive a full refund. For cancellations after 30 days, you'll receive a prorated refund for the unused portion of your membership."
                  },
                  {
                    question: "How do I request roadside assistance?",
                    answer: "Roadside assistance can be requested through the FixPoint mobile app, website, or by calling our 24/7 assistance line at 1800-123-4567. Premium and Elite members receive priority handling of their assistance requests."
                  },
                  {
                    question: "Can I use FixPoint services outside of India?",
                    answer: "Basic and Premium memberships cover services within India only. Elite membership includes global assistance coverage in 45+ countries. Please check the coverage map in your account for specific country details."
                  },
                ].map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-12 bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Community Testimonials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Arjun Mehta",
                      city: "Mumbai",
                      quote: "The Premium membership has saved me countless hours with priority booking. When my car broke down on the highway, assistance arrived in just 15 minutes!",
                      rating: 5
                    },
                    {
                      name: "Priya Singh",
                      city: "Bangalore",
                      quote: "I love how the FixPoint card integrates with the app. The maintenance reminders have kept my vehicle in perfect condition, and the rewards program is generous.",
                      rating: 5
                    },
                    {
                      name: "Vikram Patel",
                      city: "Delhi",
                      quote: "Upgraded to Elite after two years as a Premium member. The concierge service alone is worth the price - they handle everything from scheduling to transportation while my car is in service.",
                      rating: 5
                    },
                    {
                      name: "Kavitha Rao",
                      city: "Chennai",
                      quote: "The discounts on parts and service have already paid for my Premium membership. Plus, the priority service means I'm never waiting long for appointments.",
                      rating: 4
                    },
                  ].map((testimonial, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold mr-3">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-xs text-gray-500">{testimonial.city}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">"{testimonial.quote}"</p>
                      <div className="flex text-amber-400">
                        {Array(testimonial.rating).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;