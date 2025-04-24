import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  FileText, 
  Search, 
  MessageCircle,
  Languages,
  Car,
  MapPin,
  CreditCard,
  Award,
  UserCheck,
  Bike
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import LearnDriving from './learn-driving';
import RTOServices from './rto-services';

const DrivingEducation = () => {
  const [activeTab, setActiveTab] = useState('learn');
  const [language, setLanguage] = useState('english');
  const [location, setLocation] = useLocation();
  
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिंदी (Hindi)' },
    { code: 'tamil', name: 'தமிழ் (Tamil)' },
    { code: 'telugu', name: 'తెలుగు (Telugu)' },
    { code: 'bengali', name: 'বাংলা (Bengali)' },
    { code: 'marathi', name: 'मराठी (Marathi)' },
  ];
  
  const quickLinks = [
    {
      title: 'Learn Two-Wheeler',
      icon: <Bike className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-600',
      darkColor: 'dark:bg-blue-900/30 dark:text-blue-400',
      tab: 'learn'
    },
    {
      title: 'Learn Car Driving',
      icon: <Car className="h-5 w-5" />,
      color: 'bg-green-100 text-green-600',
      darkColor: 'dark:bg-green-900/30 dark:text-green-400',
      tab: 'learn'
    },
    {
      title: 'Apply for License',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-600',
      darkColor: 'dark:bg-purple-900/30 dark:text-purple-400',
      tab: 'rto'
    },
    {
      title: 'Renew License',
      icon: <CreditCard className="h-5 w-5" />,
      color: 'bg-amber-100 text-amber-600',
      darkColor: 'dark:bg-amber-900/30 dark:text-amber-400',
      tab: 'rto'
    },
    {
      title: 'Find RTO Office',
      icon: <MapPin className="h-5 w-5" />,
      color: 'bg-red-100 text-red-600',
      darkColor: 'dark:bg-red-900/30 dark:text-red-400',
      tab: 'rto'
    },
    {
      title: 'RTO Test Prep',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-indigo-100 text-indigo-600',
      darkColor: 'dark:bg-indigo-900/30 dark:text-indigo-400',
      tab: 'learn'
    }
  ];
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-dark">
              Learn Driving & RTO Services
            </h1>
            <p className="text-neutral-light mt-1">
              Professional driving education and hassle-free RTO assistance across India
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Languages className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
              <select 
                className="text-sm px-2 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-gray-200"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
            
            <Button className="bg-green-500 hover:bg-green-600" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp Support
            </Button>
          </div>
        </div>
        
        {/* Hero Banner */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-80">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3" 
              alt="Driving Education" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 max-w-xl">
                Learn to Drive and Navigate RTO Processes with Ease
              </h2>
              <p className="text-white/80 max-w-xl mb-6">
                Professional driving education and hassle-free RTO assistance across India, in your language, on your schedule
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => setActiveTab('learn')}
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/20 hover:bg-white/20"
                  onClick={() => setActiveTab('rto')}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  RTO Services
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Search Bar */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <Input 
                placeholder="Search for driving lessons, RTO services, or specific questions..." 
                className="pl-10 bg-gray-50 border-gray-100 dark:bg-gray-700 dark:border-gray-600"
              />
              <Button className="absolute right-1 top-1">
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {quickLinks.map((link, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveTab(link.tab)}
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className={`rounded-full p-2 mb-2 ${link.color} ${link.darkColor}`}>
                  {link.icon}
                </div>
                <span className="text-sm font-medium">{link.title}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="learn" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="learn" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Learn Driving</span>
              <span className="sm:hidden">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="rto" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">RTO Services</span>
              <span className="sm:hidden">RTO</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="learn">
            <LearnDriving />
          </TabsContent>
          
          <TabsContent value="rto">
            <RTOServices />
          </TabsContent>
        </Tabs>
        
        {/* Call to Action Section */}
        <div className="mt-12 mb-8 bg-primary/5 rounded-xl p-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-neutral-light mb-6">
              Join thousands of satisfied learners who have mastered driving skills and navigated RTO processes with our help.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-dark"
                onClick={() => setActiveTab('learn')}
              >
                Book a Driving Lesson
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setActiveTab('rto')}
              >
                Schedule RTO Assistance
              </Button>
            </div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">98% Success Rate</h3>
              <p className="text-neutral-light">
                Our students clear driving tests in the first attempt with expert guidance
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Certified Instructors</h3>
              <p className="text-neutral-light">
                Learn from experienced, RTO-certified driving professionals
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Languages className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-lg mb-2">Multilingual Support</h3>
              <p className="text-neutral-light">
                Services available in 10+ Indian languages for your convenience
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DrivingEducation;