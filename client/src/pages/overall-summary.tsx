import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutGrid, HeartPulse, CircleDollarSign, Wrench, FileText, Activity, 
  Car, Gauge, BarChart2, BarChart3, IndianRupee, Fuel, CheckCircle,
  Clock, AlertTriangle, RefreshCw
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const OverallSummary = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Fleet summary data
  const fleetSummary = {
    totalVehicles: 12,
    activeVehicles: 9,
    inMaintenanceVehicles: 3,
    averageHealthScore: 87,
    totalValue: '₹1.68 Crore',
    appreciation: '+₹12,35,000',
    depreciation: '-₹4,75,000',
    fuelConsumption: {
      monthly: '1,845 L',
      change: '-3.2%'
    },
    serviceMetrics: {
      efficiency: '92%',
      upToDate: 9,
      upcoming: 2,
      overdue: 1
    }
  };
  
  // Fleet usage data
  const fleetUsage = {
    fuelEfficiency: '16.8 km/L',
    totalKilometers: '21,432',
    averageKmPerVehicle: '1,786',
    mostUsedVehicle: 'Tata Nexon'
  };
  
  // News updates
  const newsUpdates = [
    { 
      title: 'EV Subsidy Program Extended', 
      desc: 'Government extends FAME III subsidy for electric vehicles until 2026.',
      color: 'emerald'
    },
    { 
      title: 'New Safety Regulations', 
      desc: 'BNVSAP safety norms to be mandatory for all vehicles from October.',
      color: 'amber'
    },
    { 
      title: 'Fuel Price Update', 
      desc: 'Petrol prices reduced by ₹2.50 per liter across all states.',
      color: 'blue'
    }
  ];
  
  // Health score timeline
  const healthTimeline = [
    { month: 'Dec', score: 81 },
    { month: 'Jan', score: 79 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 84 },
    { month: 'Apr', score: 86 },
    { month: 'May', score: 87 }
  ];
  
  // Service reminders
  const serviceReminders = [
    {
      vehicle: 'Tata Nexon',
      type: 'Regular Maintenance',
      dueDate: 'May 15, 2025',
      daysLeft: 14,
      status: 'upcoming'
    },
    {
      vehicle: 'Hyundai Creta',
      type: 'Oil Change',
      dueDate: 'May 22, 2025',
      daysLeft: 21,
      status: 'upcoming'
    }
  ];
  
  // Document renewals
  const documentRenewals = [
    {
      vehicle: 'Maruti Brezza',
      document: 'Insurance Policy',
      expiryDate: 'May 30, 2025',
      daysLeft: 29,
      status: 'expiring-soon'
    },
    {
      vehicle: 'Toyota Innova',
      document: 'Pollution Certificate',
      expiryDate: 'June 15, 2025',
      daysLeft: 45,
      status: 'valid'
    }
  ];
  
  // Helper functions
  const getHealthScoreColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 75) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-rose-600';
  };
  
  const getHealthScoreBgColor = (score: number): string => {
    if (score >= 90) return 'bg-emerald-100';
    if (score >= 75) return 'bg-green-100';
    if (score >= 60) return 'bg-amber-100';
    return 'bg-rose-100';
  };
  
  const getHealthScoreTextColor = (score: number): string => {
    if (score >= 90) return 'text-emerald-700';
    if (score >= 75) return 'text-green-700';
    if (score >= 60) return 'text-amber-700';
    return 'text-rose-700';
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-100 text-amber-700';
      case 'overdue':
        return 'bg-rose-100 text-rose-700';
      case 'expiring-soon':
        return 'bg-amber-100 text-amber-700';
      case 'valid':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-900 pt-24 pb-32 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 text-white mb-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white p-0 hover:bg-transparent hover:text-blue-200"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <span className="text-blue-300">/</span>
            <span>Fleet Analytics</span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Fleet Overview & Analytics</h1>
          <p className="text-blue-200 max-w-2xl">
            Comprehensive insights into your fleet's performance, health, and financial metrics to optimize operations and make data-driven decisions.
          </p>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-10">
        {/* Simple Tab System */}
        <div className="w-full">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-lg p-1 mb-6">
            <div className="grid grid-cols-5 w-full">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-blue-50 text-blue-800" : "text-gray-600"}`}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("health")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "health" ? "bg-blue-50 text-blue-800" : "text-gray-600"}`}
              >
                <HeartPulse className="h-4 w-4 mr-2" />
                Health
              </button>
              <button 
                onClick={() => setActiveTab("financial")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "financial" ? "bg-blue-50 text-blue-800" : "text-gray-600"}`}
              >
                <CircleDollarSign className="h-4 w-4 mr-2" />
                Financial
              </button>
              <button 
                onClick={() => setActiveTab("maintenance")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "maintenance" ? "bg-blue-50 text-blue-800" : "text-gray-600"}`}
              >
                <Wrench className="h-4 w-4 mr-2" />
                Maintenance
              </button>
              <button 
                onClick={() => setActiveTab("documents")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${activeTab === "documents" ? "bg-blue-50 text-blue-800" : "text-gray-600"}`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </button>
            </div>
          </div>
          
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 mt-4">
              {/* Key Metrics */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      <Car className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Fleet Size</div>
                      <div className="text-2xl font-bold">{fleetSummary.totalVehicles}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-emerald-500">{fleetSummary.activeVehicles} Active</span> · {fleetSummary.inMaintenanceVehicles} In maintenance
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-amber-100 rounded-full p-3">
                      <Gauge className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Health Score</div>
                      <div className="text-2xl font-bold">
                        <span className={getHealthScoreColor(fleetSummary.averageHealthScore)}>
                          {fleetSummary.averageHealthScore}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Fleet average · <span className="text-emerald-500">+2% this month</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-emerald-100 rounded-full p-3">
                      <IndianRupee className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Total Value</div>
                      <div className="text-2xl font-bold">{fleetSummary.totalValue}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-emerald-500">{fleetSummary.appreciation} gain</span> this quarter
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden"
                  variants={itemVariants}
                >
                  <div className="p-5 flex items-center gap-4">
                    <div className="bg-cyan-100 rounded-full p-3">
                      <Fuel className="h-6 w-6 text-cyan-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Fuel Consumption</div>
                      <div className="text-2xl font-bold">{fleetSummary.fuelConsumption.monthly}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="text-emerald-500">{fleetSummary.fuelConsumption.change}</span> vs. last month
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Main Dashboard Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Trends - New Design */}
                <motion.div 
                  className="relative rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg p-0"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                      className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-indigo-600 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-purple-500 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  
                  {/* Header section */}
                  <div className="relative p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                          <BarChart3 className="h-5 w-5 text-purple-300" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Current Trends</h3>
                        <div className="text-xs text-purple-200">Automotive news & updates</div>
                      </div>
                    </div>
                    
                    <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      Latest News
                    </div>
                  </div>
                  
                  {/* News content with glassmorphism */}
                  <div className="relative px-4 pt-2 pb-4">
                    <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                      
                      <div className="space-y-3 max-h-44 overflow-auto pr-1 relative z-10">
                        {newsUpdates.map((item, i) => (
                          <motion.div 
                            key={i}
                            className="flex items-start gap-3 bg-white/5 p-3 backdrop-blur-sm rounded-lg cursor-pointer"
                            whileHover={{ x: 3, backgroundColor: "rgba(255,255,255,0.1)" }}
                          >
                            <motion.div 
                              className={`w-2 h-2 rounded-full bg-${item.color}-400 mt-1.5 flex-shrink-0`}
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.7, 1, 0.7] 
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.5 
                              }}
                            />
                            <div>
                              <h5 className="text-sm font-medium text-white">{item.title}</h5>
                              <p className="text-xs text-white/70 mt-0.5">{item.desc}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <div className="flex items-center text-white/70">
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="text-xs">Updated 3 hours ago</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                          onClick={() => window.open('/automotive-news', '_blank')}
                        >
                          View All
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Vehicle Value Trend */}
                <motion.div 
                  className="relative rounded-xl overflow-hidden bg-gradient-to-br from-blue-900 to-teal-900 shadow-lg p-0"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                      className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-teal-600 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-blue-500 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  
                  {/* Header section */}
                  <div className="relative p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <IndianRupee className="h-5 w-5 text-teal-300" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Vehicle Net Value</h3>
                        <div className="text-xs text-teal-200">Market valuation trends</div>
                      </div>
                    </div>
                    
                    <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      As of Today
                    </div>
                  </div>
                  
                  {/* Value display with glassmorphism */}
                  <div className="relative px-4 pt-2 pb-4">
                    <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                      
                      <div className="relative z-10">
                        {/* Total value */}
                        <motion.div 
                          className="text-center py-3"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: [0.9, 1, 0.9] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <div className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-teal-200 to-blue-300 text-transparent bg-clip-text">
                            {fleetSummary.totalValue}
                          </div>
                          <div className="text-xs text-white/70 mt-1">Total Fleet Value</div>
                        </motion.div>
                        
                        {/* Value progress bar */}
                        <div className="w-full h-2 bg-white/10 rounded-full mt-3 mb-5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-teal-400 to-blue-400"
                            style={{ width: '65%' }}
                            initial={{ x: -100 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                        
                        {/* Value breakdown */}
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Current", value: "₹21,35,250", color: "white" },
                            { label: "Appreciation", value: fleetSummary.appreciation, color: "emerald-400" },
                            { label: "Depreciation", value: fleetSummary.depreciation, color: "rose-400" }
                          ].map((item, i) => (
                            <motion.div 
                              key={i}
                              className="p-2 rounded-lg bg-white/5 text-center backdrop-blur-sm"
                              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                            >
                              <div className={`text-sm font-medium text-${item.color}`}>{item.value}</div>
                              <div className="text-[10px] text-white/60">{item.label}</div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center text-white/70">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            <span className="text-xs">Last updated: Today</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                            onClick={() => setActiveTab('financial')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Health Score Tracker */}
                <motion.div 
                  className="relative rounded-xl overflow-hidden bg-gradient-to-br from-emerald-900 to-teal-900 shadow-lg p-0"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Decorative background elements */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div 
                      className="absolute -right-16 -bottom-16 w-32 h-32 rounded-full bg-emerald-600 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div 
                      className="absolute -left-8 -top-8 w-24 h-24 rounded-full bg-teal-500 opacity-20"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: [0.8, 1.2, 0.8], rotate: [360, 180, 0] }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  
                  {/* Header section */}
                  <div className="relative p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                        <motion.div
                          animate={{ 
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          <Activity className="h-5 w-5 text-emerald-300" />
                        </motion.div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Health Score</h3>
                        <div className="text-xs text-emerald-200">Fleet performance tracker</div>
                      </div>
                    </div>
                    
                    <div className="text-xs font-medium text-white bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                      6-Month Trend
                    </div>
                  </div>
                  
                  {/* Health score display with glassmorphism */}
                  <div className="relative px-4 pt-2 pb-4">
                    <div className="relative bg-white/5 backdrop-blur-md rounded-xl p-4">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent rounded-xl" />
                      
                      <div className="relative z-10">
                        {/* Health score */}
                        <motion.div 
                          className="flex items-center justify-center gap-4 py-3"
                          initial={{ scale: 0.9 }}
                          animate={{ scale: [0.9, 1, 0.9] }}
                          transition={{ repeat: Infinity, duration: 3 }}
                        >
                          <div className="text-center">
                            <div className="relative inline-flex items-center justify-center">
                              <svg className="w-24 h-24">
                                <circle 
                                  className="text-white/10" 
                                  strokeWidth="6" 
                                  stroke="currentColor" 
                                  fill="transparent" 
                                  r="36" 
                                  cx="48" 
                                  cy="48" 
                                />
                                <motion.circle 
                                  className="text-emerald-400" 
                                  strokeWidth="6" 
                                  strokeDasharray={36 * 2 * Math.PI} 
                                  strokeDashoffset={36 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100)} 
                                  strokeLinecap="round" 
                                  stroke="currentColor" 
                                  fill="transparent" 
                                  r="36" 
                                  cx="48" 
                                  cy="48"
                                  initial={{ strokeDashoffset: 36 * 2 * Math.PI }}
                                  animate={{ strokeDashoffset: 36 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100) }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                              </svg>
                              <span className="absolute text-2xl font-bold text-white">{fleetSummary.averageHealthScore}%</span>
                            </div>
                            <div className="text-xs text-emerald-200 mt-2">Overall Health</div>
                          </div>
                          
                          <div className="flex-1">
                            <div className="text-xs text-white/80 mb-1">Health Breakdown</div>
                            <div className="space-y-2">
                              {[
                                { label: "Engine", score: 90 },
                                { label: "Battery", score: 85 },
                                { label: "Brakes", score: 82 }
                              ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                  <div className="flex justify-between text-[10px]">
                                    <span className="text-white/70">{item.label}</span>
                                    <span className={`text-${getHealthScoreColor(item.score).split('-')[0]}-300`}>{item.score}%</span>
                                  </div>
                                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div 
                                      className={`h-full bg-${getHealthScoreColor(item.score).split('-')[0]}-400`}
                                      style={{ width: `${item.score}%` }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${item.score}%` }}
                                      transition={{ duration: 1, delay: i * 0.2 }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                        
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <div className="flex items-center text-white/70">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            <span className="text-xs">Last updated: Today</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-7 px-3 text-white hover:bg-white/10 border border-white/20 rounded-full"
                              onClick={() => setActiveTab('health')}
                            >
                              View Details
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm" 
                              className="text-xs h-7 px-3 text-white bg-purple-600 hover:bg-purple-700 border border-purple-500 rounded-full"
                              onClick={() => setActiveTab('maintenance')}
                            >
                              Schedule Service
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Service and Document Alerts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Reminders */}
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden p-5"
                  variants={itemVariants}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold">Upcoming Service Reminders</h3>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {serviceReminders.length} Upcoming
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {serviceReminders.map((reminder, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Car className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{reminder.vehicle}</h4>
                            <p className="text-sm text-gray-500">{reminder.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{reminder.dueDate}</div>
                          <Badge className={getStatusColor(reminder.status)}>
                            {reminder.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveTab('maintenance')}
                      className="text-blue-600 rounded-full"
                    >
                      View All Services
                    </Button>
                  </div>
                </motion.div>
                
                {/* Document Renewals */}
                <motion.div 
                  className="bg-white rounded-xl shadow-sm overflow-hidden p-5"
                  variants={itemVariants}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <h3 className="font-semibold">Document Renewals</h3>
                    </div>
                    <Badge className="bg-amber-100 text-amber-700">
                      {documentRenewals.filter(d => d.status === 'expiring-soon').length} Expiring Soon
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {documentRenewals.map((document, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="bg-indigo-100 p-2 rounded-full">
                            <FileText className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{document.vehicle}</h4>
                            <p className="text-sm text-gray-500">{document.document}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{document.expiryDate}</div>
                          <Badge className={getStatusColor(document.status)}>
                            {document.daysLeft} days left
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setActiveTab('documents')}
                      className="text-indigo-600 rounded-full"
                    >
                      View All Documents
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
          
          {/* Health Tab */}
          {activeTab === "health" && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-emerald-100 p-2 rounded-full">
                        <Activity className="h-4 w-4 text-emerald-600" />
                      </div>
                      Fleet Health Score
                    </CardTitle>
                    <CardDescription>Overall health assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center py-4">
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-36 h-36">
                          <circle 
                            className="text-gray-100" 
                            strokeWidth="8" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="56" 
                            cx="72" 
                            cy="72" 
                          />
                          <motion.circle 
                            className={`text-${getHealthScoreColor(fleetSummary.averageHealthScore).split('-')[0]}-500`}
                            strokeWidth="8" 
                            strokeDasharray={56 * 2 * Math.PI} 
                            strokeDashoffset={56 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100)} 
                            strokeLinecap="round" 
                            stroke="currentColor" 
                            fill="transparent" 
                            r="56" 
                            cx="72" 
                            cy="72"
                            initial={{ strokeDashoffset: 56 * 2 * Math.PI }}
                            animate={{ strokeDashoffset: 56 * 2 * Math.PI * (1 - fleetSummary.averageHealthScore/100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-4xl font-bold">{fleetSummary.averageHealthScore}%</span>
                          <span className={`text-sm ${getHealthScoreColor(fleetSummary.averageHealthScore)}`}>Excellent</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t flex justify-between">
                    <span className="text-sm text-gray-500">Last updated: Today</span>
                    <Badge className={`${getHealthScoreBgColor(fleetSummary.averageHealthScore)} ${getHealthScoreTextColor(fleetSummary.averageHealthScore)}`}>
                      +2% this month
                    </Badge>
                  </CardFooter>
                </Card>
                
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <BarChart2 className="h-4 w-4 text-blue-600" />
                      </div>
                      Health Score Trends
                    </CardTitle>
                    <CardDescription>6-month historical data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 flex items-end justify-between px-2">
                      {healthTimeline.map((month, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="relative w-12">
                            <motion.div 
                              className={`w-12 bg-${getHealthScoreColor(month.score).split('-')[0]}-500 rounded-t-lg`}
                              style={{ height: `${month.score * 0.5}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${month.score * 0.5}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                            >
                              <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                                {month.score}%
                              </div>
                            </motion.div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">{month.month}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <span className="text-sm text-gray-500">Score trending upward from last quarter</span>
                  </CardFooter>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-green-100 p-2 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      Maintenance Status
                    </CardTitle>
                    <CardDescription>Service compliance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Service Compliance</span>
                          <span className="text-sm font-medium">{fleetSummary.serviceMetrics.efficiency}</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="bg-emerald-50 p-3 rounded-lg text-center">
                          <div className="text-emerald-600 font-semibold">{fleetSummary.serviceMetrics.upToDate}</div>
                          <div className="text-xs text-gray-500">Up-to-date</div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg text-center">
                          <div className="text-amber-600 font-semibold">{fleetSummary.serviceMetrics.upcoming}</div>
                          <div className="text-xs text-gray-500">Upcoming</div>
                        </div>
                        <div className="bg-rose-50 p-3 rounded-lg text-center">
                          <div className="text-rose-600 font-semibold">{fleetSummary.serviceMetrics.overdue}</div>
                          <div className="text-xs text-gray-500">Overdue</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-full"
                      onClick={() => setActiveTab('maintenance')}
                    >
                      Schedule Service
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-rose-100 p-2 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                      </div>
                      Issue Alerts
                    </CardTitle>
                    <CardDescription>Potential problems detected</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-800">Tata Nexon</h5>
                          <p className="text-sm text-gray-500">Battery voltage below optimal range</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-800">Hyundai Creta</h5>
                          <p className="text-sm text-gray-500">Brake pad wear detected</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-full"
                    >
                      View All Issues
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="bg-cyan-100 p-2 rounded-full">
                        <Gauge className="h-4 w-4 text-cyan-600" />
                      </div>
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Avg. Fuel Economy</div>
                        <div className="font-medium">{fleetUsage.fuelEfficiency}</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Total Distance</div>
                        <div className="font-medium">{fleetUsage.totalKilometers} km</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Avg per Vehicle</div>
                        <div className="font-medium">{fleetUsage.averageKmPerVehicle} km</div>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Most Used</div>
                        <div className="font-medium">{fleetUsage.mostUsedVehicle}</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full rounded-full"
                    >
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
          
          {/* Add other tabs here similarly */}
          {activeTab === "financial" && (
            <div className="p-8 text-center">
              <div className="text-lg font-semibold mb-2">Financial Tab</div>
              <p className="text-gray-500">Financial analytics content will be displayed here.</p>
            </div>  
          )}
          
          {activeTab === "maintenance" && (
            <div className="p-8 text-center">
              <div className="text-lg font-semibold mb-2">Maintenance Tab</div>
              <p className="text-gray-500">Maintenance schedule and service history content will be displayed here.</p>
            </div>  
          )}
          
          {activeTab === "documents" && (
            <div className="p-8 text-center">
              <div className="text-lg font-semibold mb-2">Documents Tab</div>
              <p className="text-gray-500">Vehicle documents and renewal information will be displayed here.</p>
            </div>  
          )}
        </div>
      </div>
    </div>
  );
};

export default OverallSummary;