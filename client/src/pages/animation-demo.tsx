import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import AnimationBackground from '@/components/animations/AnimationBackground';

// Type for the animation page options
type AnimationPage = 'vehicleVault' | 'bookService' | 'fastag' | 'emergency' | 'nearby' |
  'drishti' | 'testBeforeBuy' | 'marketplace' | 'verifyParts' |
  'fixpoint' | 'learnDriving' | 'educational' | 'arena' | 'commercialFleet';

/**
 * A demo page to showcase and test all available automotive animations
 * for different sections of the application
 */
const AnimationDemo = () => {
  // State for the demo controls
  const [selectedPage, setSelectedPage] = useState<AnimationPage>('vehicleVault');
  const [opacity, setOpacity] = useState<number>(0.15);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // List of all available animation pages
  const pages: AnimationPage[] = [
    'vehicleVault', 'bookService', 'fastag', 'emergency', 'nearby',
    'drishti', 'testBeforeBuy', 'marketplace', 'verifyParts',
    'fixpoint', 'learnDriving', 'educational', 'arena', 'commercialFleet'
  ];

  // Pretty display names for the pages
  const pageDisplayNames: Record<AnimationPage, string> = {
    vehicleVault: 'Vehicle Vault',
    bookService: 'Book Service',
    fastag: 'FASTag & E-Challan',
    emergency: 'Emergency Services',
    nearby: 'Nearby Services',
    drishti: 'Drishti',
    testBeforeBuy: 'Test Before Buy',
    marketplace: 'Marketplace',
    verifyParts: 'Find & Verify Parts',
    fixpoint: 'FixPoint Card',
    learnDriving: 'Learn Driving & RTO',
    educational: 'Educational',
    arena: 'Arena',
    commercialFleet: 'Commercial Fleet'
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Animation background */}
      <AnimationBackground page={selectedPage} opacity={opacity} />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Animation Demo: {pageDisplayNames[selectedPage]}
        </h1>
        
        {/* Controls panel */}
        <div className={`max-w-2xl mx-auto p-6 rounded-lg mb-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-xl font-semibold mb-4">Animation Controls</h2>
          
          <div className="space-y-6">
            {/* Page selector */}
            <div className="space-y-2">
              <Label htmlFor="page-select">Select Page Animation Set</Label>
              <Select 
                value={selectedPage} 
                onValueChange={(value) => setSelectedPage(value as AnimationPage)}
              >
                <SelectTrigger id="page-select" className="w-full">
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page} value={page}>
                      {pageDisplayNames[page]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Opacity slider */}
            <div className="space-y-2">
              <div className="flex justify-between mb-1">
                <Label htmlFor="opacity-slider">Animation Opacity</Label>
                <span className="text-sm">{Math.round(opacity * 100)}%</span>
              </div>
              <Slider
                id="opacity-slider"
                min={0.05}
                max={0.3}
                step={0.01}
                value={[opacity]}
                onValueChange={(values) => setOpacity(values[0])}
              />
            </div>
            
            {/* Dark mode toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </div>
        </div>
        
        {/* Description and sample content */}
        <div className="max-w-4xl mx-auto">
          <div className={`p-8 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
            <h2 className="text-2xl font-bold mb-4">About {pageDisplayNames[selectedPage]}</h2>
            <p className="mb-6">
              This page demonstrates the animations designed specifically for the {pageDisplayNames[selectedPage]} section.
              Each page has at least 10 unique automotive-themed animations that enhance the user experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className="text-xl font-semibold mb-3">Key Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Subtle automotive-themed animations</li>
                  <li>Interactive user interface elements</li>
                  <li>Responsive design across all devices</li>
                  <li>Accessibility compliant interactions</li>
                  <li>Optimized performance with minimal impact</li>
                </ul>
              </div>
              
              <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
                <h3 className="text-xl font-semibold mb-3">Animation Types</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Motion-based animations (vehicles, elements)</li>
                  <li>State-based animations (signals, indicators)</li>
                  <li>Interactive animations (hovering, clicking)</li>
                  <li>Decorative animations (background elements)</li>
                  <li>Functional animations (loading indicators)</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              <Button 
                onClick={() => {
                  const randomIndex = Math.floor(Math.random() * pages.length);
                  setSelectedPage(pages[randomIndex]);
                }}
                className={`px-6 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                View Random Animation Set
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationDemo;