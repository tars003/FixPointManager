import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  BookOpen, 
  FileText, 
  Info, 
  Phone, 
  Search, 
  MessageCircle,
  Languages
} from 'lucide-react';
import LearnDriving from './LearnDriving';
import RTOServices from './RTOServices';
import AboutUs from './AboutUs';
import Contact from './Contact';

interface EducationDashboardProps {
  theme: 'light' | 'dark';
}

export default function EducationDashboard({ theme }: EducationDashboardProps) {
  const [activeTab, setActiveTab] = useState('learn');
  const [language, setLanguage] = useState('english');
  
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिंदी (Hindi)' },
    { code: 'tamil', name: 'தமிழ் (Tamil)' },
    { code: 'telugu', name: 'తెలుగు (Telugu)' },
    { code: 'bengali', name: 'বাংলা (Bengali)' },
    { code: 'marathi', name: 'मराठी (Marathi)' },
  ];
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Learn Driving & RTO Services
          </h1>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'} mt-1`}>
            Professional driving education and hassle-free RTO assistance across India
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <Languages className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
            <select 
              className={`text-sm px-2 py-1 rounded ${
                theme === 'light' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-gray-800 border border-gray-700 text-gray-200'
              }`}
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
      
      {/* Search Bar */}
      <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 shadow-sm'}`}>
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 h-5 w-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`} />
          <Input 
            placeholder="Search for driving lessons, RTO services, or specific questions..." 
            className={`pl-10 ${
              theme === 'light' 
                ? 'bg-gray-50 border-gray-100' 
                : 'bg-gray-700 border-gray-600'
            }`}
          />
          <Button className="absolute right-1 top-1">
            Search
          </Button>
        </div>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="learn" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-6">
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
          <TabsTrigger value="about" className="flex items-center gap-1">
            <Info className="h-4 w-4" />
            <span className="hidden sm:inline">About Us</span>
            <span className="sm:hidden">About</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Contact</span>
            <span className="sm:hidden">Contact</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="learn">
          <LearnDriving theme={theme} />
        </TabsContent>
        
        <TabsContent value="rto">
          <RTOServices theme={theme} />
        </TabsContent>
        
        <TabsContent value="about">
          <AboutUs theme={theme} />
        </TabsContent>
        
        <TabsContent value="contact">
          <Contact theme={theme} />
        </TabsContent>
      </Tabs>
      
      {/* Trust Indicators Section */}
      <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800 shadow-sm'} mt-8`}>
        <h2 className={`text-lg font-bold mb-4 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          Why Choose Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-700 border-gray-600'}>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-green-900/30 text-green-400'
                }`}>
                  <Car className="h-6 w-6" />
                </div>
              </div>
              <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                98% Success Rate
              </h3>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Our students clear driving tests in the first attempt
              </p>
            </CardContent>
          </Card>
          
          <Card className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-700 border-gray-600'}>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-blue-900/30 text-blue-400'
                }`}>
                  <FileText className="h-6 w-6" />
                </div>
              </div>
              <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                Zero Paperwork Hassle
              </h3>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                We handle all documentation and RTO formalities
              </p>
            </CardContent>
          </Card>
          
          <Card className={theme === 'light' ? 'bg-gray-50' : 'bg-gray-700 border-gray-600'}>
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-2">
                <div className={`rounded-full p-3 ${
                  theme === 'light' 
                    ? 'bg-amber-100 text-amber-600' 
                    : 'bg-amber-900/30 text-amber-400'
                }`}>
                  <MessageCircle className="h-6 w-6" />
                </div>
              </div>
              <h3 className={`font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
                24/7 Support
              </h3>
              <p className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
                Dedicated assistance via WhatsApp and phone
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}