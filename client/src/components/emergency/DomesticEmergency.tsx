import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
// Temporarily use placeholder components until imports are ready
const AccidentEmergency = ({ location, theme, onGoBack }: any) => 
  <div>Accident Emergency Component (Placeholder)</div>;
const BreakdownEmergency = ({ location, theme, onGoBack }: any) => 
  <div>Breakdown Emergency Component (Placeholder)</div>;
const PoliceEmergency = ({ location, theme, onGoBack }: any) => 
  <div>Police Emergency Component (Placeholder)</div>;

import { 
  Car, 
  Wrench as Engine, 
  Shield, 
  CircleAlert as BadgeAlert,
  Heart, 
  LockKeyhole, 
  FileText, 
  AlertTriangle, 
  Fuel,
  HelpCircle
} from 'lucide-react';

interface DomesticEmergencyProps {
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
  | 'breakdown' 
  | 'police' 
  | 'medical' 
  | 'theft' 
  | 'document' 
  | 'natural' 
  | 'fuel' 
  | 'other';

export default function DomesticEmergency({ 
  location, 
  theme,
  onShowProfile
}: DomesticEmergencyProps) {
  const [selectedCategory, setSelectedCategory] = useState<EmergencyCategory>('none');

  const handleCategorySelect = (category: EmergencyCategory) => {
    setSelectedCategory(category);
  };

  const handleGoBack = () => {
    setSelectedCategory('none');
  };

  // Categories with icons, colors and descriptions - updated with provided specifications
  const emergencyCategories = [
    {
      id: 'accident',
      name: 'Vehicle Accident Assistance',
      icon: <Car />,
      color: 'red',
      description: 'Immediate support for collision, damage, or injury incidents. Documentation, police liaison, and recovery services.',
      actionButton: 'Get Help Now'
    },
    {
      id: 'breakdown',
      name: 'Vehicle Breakdown Support',
      icon: <Engine />,
      color: 'orange',
      description: 'Stuck on the road? Get immediate technical help, roadside assistance, and repair services anywhere in India.',
      actionButton: 'Fix My Vehicle'
    },
    {
      id: 'police',
      name: 'Police & Legal Assistance',
      icon: <Shield />,
      color: 'blue',
      description: 'Navigate police checkpoints, document verification, or traffic violations with real-time legal guidance.',
      actionButton: 'Legal Support'
    },
    {
      id: 'medical',
      name: 'Medical Emergency Response',
      icon: <Heart />,
      color: 'pink',
      description: 'Immediate access to ambulance services, nearby hospitals, and first-aid guidance for any health crisis.',
      actionButton: 'Medical Help'
    },
    {
      id: 'theft',
      name: 'Theft & Security Alert',
      icon: <LockKeyhole />,
      color: 'purple',
      description: 'Report vehicle theft, break-ins, or security concerns with direct police connection and tracking support.',
      actionButton: 'Security Alert'
    },
    {
      id: 'document',
      name: 'Emergency Document Services',
      icon: <FileText />,
      color: 'cyan',
      description: 'Lost or damaged vehicle documents? Get digital backups, temporary permits, and official replacements.',
      actionButton: 'Recover Documents'
    },
    {
      id: 'natural',
      name: 'Natural Disaster Response',
      icon: <AlertTriangle />,
      color: 'amber',
      description: 'Navigate floods, landslides, extreme weather, or road hazards with real-time alerts and safe routes.',
      actionButton: 'Safety Routes'
    },
    {
      id: 'fuel',
      name: 'Fuel Crisis Assistance',
      icon: <Fuel />,
      color: 'green',
      description: 'Out of fuel or wrong fuel emergency? Get immediate delivery or tank draining services wherever you are.',
      actionButton: 'Fuel Solution'
    },
    {
      id: 'other',
      name: 'Additional Emergency Support',
      icon: <HelpCircle />,
      color: 'gray',
      description: 'Facing an unusual emergency? Get customized assistance for any vehicle or travel crisis not listed above.',
      actionButton: 'Get Custom Help'
    }
  ];

  const renderEmergencyContent = () => {
    switch(selectedCategory) {
      case 'accident':
        return <AccidentEmergency location={location} theme={theme} onGoBack={handleGoBack} />;
      case 'breakdown':
        return <BreakdownEmergency location={location} theme={theme} onGoBack={handleGoBack} />;
      case 'police':
        return <PoliceEmergency location={location} theme={theme} onGoBack={handleGoBack} />;
      // Other categories would have their own components too
      case 'none':
      default:
        return renderCategoryGrid();
    }
  };

  const renderCategoryGrid = () => {
    return (
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
            Emergency Assistance
          </h2>
          <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
            Select the type of emergency you're experiencing
          </p>
        </div>
      )}

      {renderEmergencyContent()}

      {selectedCategory === 'none' && (
        <div className={`text-center mt-8 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
          <p className="text-sm">For immediate emergency assistance, call <span className="font-semibold text-red-600 dark:text-red-400">112</span></p>
          <button 
            onClick={() => window.open('tel:112', '_self')} 
            className={`mt-2 inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium ${
              theme === 'light' 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
            }`}
          >
            Tap to Call Emergency Services
          </button>
        </div>
      )}
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
    gray: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      border: 'border-gray-200',
      darkBg: 'dark:bg-gray-800/80',
      darkText: 'dark:text-gray-400' 
    }
  };

  const colorClasses = colorMap[category.color] || colorMap.gray;

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