import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Scale, 
  Heart, 
  Passport, 
  FileText, 
  Plane, 
  AlertTriangle,
  Languages,
  LandPlot
} from 'lucide-react';

interface InternationalEmergencyProps {
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  theme: 'light' | 'dark';
  onShowProfile: () => void;
}

type EmergencyCategory = 
  | 'none'
  | 'accident'
  | 'legal'
  | 'medical'
  | 'border'
  | 'document'
  | 'transport'
  | 'natural'
  | 'language'
  | 'embassy';

export default function InternationalEmergency({ 
  location, 
  theme,
  onShowProfile
}: InternationalEmergencyProps) {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('none');
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  const handleCategorySelect = (category: EmergencyCategory) => {
    setSelectedCategory(category);
  };

  const handleGoBack = () => {
    setSelectedCategory('none');
  };

  // Categories with icons, colors and descriptions for international emergencies
  const emergencyCategories = [
    {
      id: 'accident',
      name: 'Accident/Breakdown',
      icon: <Car />,
      color: 'red',
      description: 'Vehicle collision or mechanical issue'
    },
    {
      id: 'legal',
      name: 'Police/Legal',
      icon: <Scale />,
      color: 'blue',
      description: 'Legal assistance or police matter'
    },
    {
      id: 'medical',
      name: 'Medical',
      icon: <Heart />,
      color: 'pink',
      description: 'Health emergency during international travel'
    },
    {
      id: 'border',
      name: 'Border/Customs',
      icon: <Passport />,
      color: 'indigo',
      description: 'Border crossing or customs issues'
    },
    {
      id: 'document',
      name: 'Documentation',
      icon: <FileText />,
      color: 'cyan',
      description: 'Lost or damaged travel/vehicle documents'
    },
    {
      id: 'transport',
      name: 'Vehicle Transport',
      icon: <Plane />,
      color: 'amber',
      description: 'Vehicle shipping or transport issues'
    },
    {
      id: 'natural',
      name: 'Natural Disaster',
      icon: <AlertTriangle />,
      color: 'orange',
      description: 'Weather emergency or natural disaster'
    },
    {
      id: 'language',
      name: 'Language Help',
      icon: <Languages />,
      color: 'green',
      description: 'Communication assistance in foreign country'
    },
    {
      id: 'embassy',
      name: 'Embassy Contact',
      icon: <LandPlot />,
      color: 'purple',
      description: 'Connect with Indian embassy or consulate'
    }
  ];

  // Available languages for translation
  const languages = [
    { code: 'english', name: 'English' },
    { code: 'spanish', name: 'Spanish' },
    { code: 'french', name: 'French' },
    { code: 'german', name: 'German' },
    { code: 'japanese', name: 'Japanese' },
    { code: 'arabic', name: 'Arabic' },
    { code: 'russian', name: 'Russian' },
    { code: 'chinese', name: 'Chinese' }
  ];

  const renderEmergencyContent = () => {
    switch(selectedCategory) {
      case 'accident':
        return <InternationalAccidentBreakdown location={location} theme={theme} onGoBack={handleGoBack} />;
      case 'legal':
        return <InternationalLegalHelp location={location} theme={theme} onGoBack={handleGoBack} />;
      // We would implement all other category components for production
      case 'none':
      default:
        return renderCategoryGrid();
    }
  };

  const renderCategoryGrid = () => {
    return (
      <>
        {/* Language selector for international emergency */}
        <div className="mb-6">
          <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Languages className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
                  Language / Idioma / Langue / 语言
                </span>
              </div>
              <select 
                className={`text-sm px-2 py-1 rounded ${theme === 'light' ? 'bg-white border border-gray-200' : 'bg-gray-800 border border-gray-700 text-gray-200'}`}
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {emergencyCategories.map((category) => (
            <CategoryCard 
              key={category.id}
              category={category}
              onClick={() => handleCategorySelect(category.id as EmergencyCategory)}
              theme={theme}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {selectedCategory === 'none' && (
        <div className="text-center mb-6">
          <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            International Emergency Assistance
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Select the type of emergency assistance you need
          </p>
        </div>
      )}

      {renderEmergencyContent()}

      {selectedCategory === 'none' && (
        <div className={`text-center text-sm mt-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>For immediate emergency assistance, call the universal emergency number: 112/911</p>
          <p className="mt-1">Indian Embassy Emergency Hotline: +91 1800-11-3090</p>
        </div>
      )}
    </motion.div>
  );
}

// Placeholder components for emergency categories
function InternationalAccidentBreakdown({ location, theme, onGoBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          International Accident/Breakdown
        </h2>
        <Button variant="outline" size="sm" onClick={onGoBack}>
          Back to Categories
        </Button>
      </div>
      
      <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800 border-gray-700'}>
        <CardContent className="p-4">
          <h3 className={`font-bold mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            Country-Specific Protocol
          </h3>
          <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Based on your location, here are the local accident reporting requirements and procedures.
          </p>
          
          <div className={`mt-4 p-3 rounded-lg ${theme === 'light' ? 'bg-amber-50 border border-amber-100' : 'bg-amber-900/20 border border-amber-900/30'}`}>
            <p className={`text-sm font-medium ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
              Accident reporting is mandatory in this country. You must:
            </p>
            <ul className={`mt-2 text-sm space-y-1 ${theme === 'light' ? 'text-amber-700' : 'text-amber-300'}`}>
              <li>• Call local police: 112</li>
              <li>• Exchange information with all parties</li>
              <li>• Take photographs of all vehicles and the scene</li>
              <li>• Do not move vehicles until police arrive (for serious accidents)</li>
              <li>• Complete an accident report form (provided by police)</li>
            </ul>
          </div>
          
          {/* More content would be here in the full implementation */}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button 
          className={`h-14 ${theme === 'light' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-700 hover:bg-red-800'} text-white`}
          onClick={() => window.open('tel:112', '_self')}
        >
          <Car className="h-5 w-5 mr-2" />
          Call Local Emergency (112)
        </Button>
        
        <Button 
          className={`h-14 ${theme === 'light' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-700 hover:bg-blue-800'} text-white`}
          onClick={() => window.open('tel:+911800113090', '_self')}
        >
          <LandPlot className="h-5 w-5 mr-2" />
          Call Indian Embassy Emergency
        </Button>
      </div>
    </motion.div>
  );
}

function InternationalLegalHelp({ location, theme, onGoBack }: any) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          International Legal Assistance
        </h2>
        <Button variant="outline" size="sm" onClick={onGoBack}>
          Back to Categories
        </Button>
      </div>
      
      <div className={`p-4 rounded-lg ${theme === 'light' ? 'bg-blue-50 border border-blue-100' : 'bg-blue-900/20 border border-blue-900/30'}`}>
        <h3 className={`font-bold mb-2 flex items-center ${theme === 'light' ? 'text-blue-800' : 'text-blue-300'}`}>
          <Scale className="h-5 w-5 mr-2" />
          Know Your Rights Internationally
        </h3>
        <p className={`text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
          As an Indian citizen traveling abroad, you have certain rights. The Vienna Convention protects your 
          right to consular assistance. You have the right to:
        </p>
        <ul className={`mt-2 text-sm space-y-1 ${theme === 'light' ? 'text-blue-700' : 'text-blue-300'}`}>
          <li>• Contact your embassy or consulate</li>
          <li>• Have access to legal representation</li>
          <li>• Request an interpreter if needed</li>
          <li>• Be treated fairly and according to local laws</li>
        </ul>
      </div>
      
      {/* More content would be here in the full implementation */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Button 
          className={`h-14 ${theme === 'light' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-700 hover:bg-indigo-800'} text-white`}
        >
          <Languages className="h-5 w-5 mr-2" />
          Translate Legal Terms
        </Button>
        
        <Button 
          className={`h-14 ${theme === 'light' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-700 hover:bg-purple-800'} text-white`}
          onClick={() => window.open('tel:+911800113090', '_self')}
        >
          <LandPlot className="h-5 w-5 mr-2" />
          Contact Embassy Legal Help
        </Button>
      </div>
    </motion.div>
  );
}

// Category Card Component
interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
  };
  onClick: () => void;
  theme: 'light' | 'dark';
}

function CategoryCard({ category, onClick, theme }: CategoryCardProps) {
  // Map color names to Tailwind classes
  const colorMap: Record<string, { bg: string, text: string, border: string, darkBg: string, darkText: string }> = {
    red: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      border: 'border-red-200',
      darkBg: 'dark:bg-red-900/30',
      darkText: 'dark:text-red-400'
    },
    orange: { 
      bg: 'bg-orange-100', 
      text: 'text-orange-700', 
      border: 'border-orange-200',
      darkBg: 'dark:bg-orange-900/30',
      darkText: 'dark:text-orange-400' 
    },
    blue: { 
      bg: 'bg-blue-100', 
      text: 'text-blue-700', 
      border: 'border-blue-200',
      darkBg: 'dark:bg-blue-900/30',
      darkText: 'dark:text-blue-400' 
    },
    pink: { 
      bg: 'bg-pink-100', 
      text: 'text-pink-700', 
      border: 'border-pink-200',
      darkBg: 'dark:bg-pink-900/30',
      darkText: 'dark:text-pink-400' 
    },
    purple: { 
      bg: 'bg-purple-100', 
      text: 'text-purple-700', 
      border: 'border-purple-200',
      darkBg: 'dark:bg-purple-900/30',
      darkText: 'dark:text-purple-400' 
    },
    cyan: { 
      bg: 'bg-cyan-100', 
      text: 'text-cyan-700', 
      border: 'border-cyan-200',
      darkBg: 'dark:bg-cyan-900/30',
      darkText: 'dark:text-cyan-400' 
    },
    amber: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-700', 
      border: 'border-amber-200',
      darkBg: 'dark:bg-amber-900/30',
      darkText: 'dark:text-amber-400' 
    },
    green: { 
      bg: 'bg-green-100', 
      text: 'text-green-700', 
      border: 'border-green-200',
      darkBg: 'dark:bg-green-900/30',
      darkText: 'dark:text-green-400' 
    },
    indigo: { 
      bg: 'bg-indigo-100', 
      text: 'text-indigo-700', 
      border: 'border-indigo-200',
      darkBg: 'dark:bg-indigo-900/30',
      darkText: 'dark:text-indigo-400' 
    }
  };

  const colorClasses = colorMap[category.color] || colorMap.blue;

  return (
    <Card 
      className={`cursor-pointer transition-all overflow-hidden ${
        theme === 'light' 
        ? `border hover:border-${category.color}-300 hover:shadow-md` 
        : 'bg-gray-800/80 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className={`p-4 flex flex-col items-center justify-center ${theme === 'light' ? colorClasses.bg : colorClasses.darkBg}`}>
          <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} mb-2`}>
            <div className={`w-10 h-10 flex items-center justify-center ${theme === 'light' ? colorClasses.text : colorClasses.darkText}`}>
              {category.icon}
            </div>
          </div>
          <h3 className={`font-bold text-center ${theme === 'light' ? colorClasses.text : colorClasses.darkText}`}>
            {category.name}
          </h3>
        </div>
        <div className={`px-3 py-2 text-xs text-center ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
          {category.description}
        </div>
      </CardContent>
    </Card>
  );
}