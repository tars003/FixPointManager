import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Car, 
  Scale, 
  Heart, 
  BookCopy as Passport, 
  FileText, 
  PlaneTakeoff as Plane, 
  AlertTriangle,
  Languages,
  Building as LandPlot
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

  // Categories with icons, colors and descriptions for international emergencies - updated with provided specifications
  const emergencyCategories = [
    {
      id: 'accident',
      name: 'International Vehicle Emergency',
      icon: <Car />,
      color: 'red',
      description: 'Complete support for accidents or breakdowns abroad, with local protocol guidance and language assistance.',
      actionButton: 'Vehicle Help'
    },
    {
      id: 'legal',
      name: 'Global Legal Protection',
      icon: <Scale />,
      color: 'blue',
      description: 'Navigate foreign police interactions, checkpoints, or legal systems with country-specific rights guidance.',
      actionButton: 'Legal Shield'
    },
    {
      id: 'medical',
      name: 'Worldwide Medical Response',
      icon: <Heart />,
      color: 'pink',
      description: 'Access emergency healthcare anywhere with language support, insurance coordination, and hospital direction.',
      actionButton: 'Medical Alert'
    },
    {
      id: 'border',
      name: 'Border & Customs Navigation',
      icon: <Passport />,
      color: 'indigo',
      description: 'Resolve vehicle import/export issues, documentation problems, or border crossing emergencies.',
      actionButton: 'Border Help'
    },
    {
      id: 'document',
      name: 'Global Document Recovery',
      icon: <FileText />,
      color: 'cyan',
      description: 'Lost passport, license, or vehicle papers abroad? Get emergency replacements and digital verification.',
      actionButton: 'Document SOS'
    },
    {
      id: 'transport',
      name: 'Emergency Vehicle Shipping',
      icon: <Plane />,
      color: 'amber',
      description: 'Arrange emergency vehicle transport across borders or back to India with customs clearance support.',
      actionButton: 'Transport Solution'
    },
    {
      id: 'natural',
      name: 'Global Disaster Response',
      icon: <AlertTriangle />,
      color: 'orange',
      description: 'Navigate foreign natural disasters with real-time alerts, evacuation guidance, and embassy coordination.',
      actionButton: 'Safety Protocol'
    },
    {
      id: 'language',
      name: 'Emergency Translation',
      icon: <Languages />,
      color: 'green',
      description: 'Break through language barriers in any crisis with instant translation tools and emergency phrase guides.',
      actionButton: 'Translate Now'
    },
    {
      id: 'embassy',
      name: 'Embassy Emergency Line',
      icon: <LandPlot />,
      color: 'purple',
      description: 'Direct connection to Indian embassy or consulate services for any crisis situation while abroad.',
      actionButton: 'Embassy SOS'
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
      className={theme === 'light' ? 'bg-white p-6 rounded-xl' : ''}
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
        <div className={`text-center mt-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          <p className="text-sm">For immediate emergency assistance, call the universal number: <span className="font-semibold text-red-600 dark:text-red-400">112/911</span></p>
          <p className="text-sm mt-1">Indian Embassy Emergency Hotline: <span className="font-semibold text-blue-600 dark:text-blue-400">+91 1800-11-3090</span></p>
          <div className="mt-3 flex justify-center gap-3">
            <button 
              onClick={() => window.open('tel:112', '_self')} 
              className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium ${
                theme === 'light' 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
              }`}
            >
              Call Emergency
            </button>
            <button 
              onClick={() => window.open('tel:+911800113090', '_self')} 
              className={`inline-flex items-center justify-center px-4 py-2 rounded-full text-xs font-medium ${
                theme === 'light' 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                  : 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
              }`}
            >
              Call Embassy
            </button>
          </div>
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
    actionButton: string;
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
      className={`cursor-pointer transition-all overflow-hidden h-full flex flex-col ${
        theme === 'light' 
        ? 'border border-gray-100 hover:shadow-md' 
        : 'bg-gray-800/80 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className={`p-4 flex flex-col items-center justify-center ${theme === 'light' ? colorClasses.bg : colorClasses.darkBg}`}>
          <div className={`p-3 rounded-full ${theme === 'light' ? 'bg-white shadow-sm' : 'bg-gray-800'} mb-2`}>
            <div className={`w-10 h-10 flex items-center justify-center ${theme === 'light' ? colorClasses.text : colorClasses.darkText}`}>
              {category.icon}
            </div>
          </div>
          <h3 className={`font-bold text-center text-sm ${theme === 'light' ? colorClasses.text : colorClasses.darkText}`}>
            {category.name}
          </h3>
        </div>
        <div className={`px-3 py-3 text-xs text-center ${theme === 'light' ? 'text-gray-600 bg-white' : 'text-gray-400 bg-gray-800/50'} flex-grow`}>
          {category.description}
        </div>
        <div className={`px-3 pb-3 flex justify-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800/50'}`}>
          <button
            className={`w-full py-2 rounded-full text-xs font-medium transition-colors ${
              theme === 'light'
                ? `${colorClasses.bg} ${colorClasses.text} hover:bg-opacity-80`
                : `${colorClasses.darkBg.replace('/30', '/50')} ${colorClasses.darkText} hover:bg-opacity-80`
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {category.actionButton}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}