import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, GraduationCap, FileText, Car, Award, Clipboard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LearningServiceCards = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Driving Courses */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => toast({ 
            title: "Driving Courses", 
            description: "This feature is coming soon!"
          })}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Driving Courses</h3>
            <p className="text-indigo-600 dark:text-indigo-400 text-sm mb-4">
              Learn driving from certified experts with personalized courses for your needs
            </p>
            <Button variant="outline" className="w-full">Browse Courses</Button>
          </CardContent>
        </Card>
        
        {/* RTO Services */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => toast({ 
            title: "RTO Services", 
            description: "This feature is coming soon!"
          })}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-amber-100 dark:bg-amber-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">RTO Services</h3>
            <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
              Get assistance with license applications, renewals, and other RTO services
            </p>
            <Button variant="outline" className="w-full">View Services</Button>
          </CardContent>
        </Card>
        
        {/* Driving Test Prep */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
          onClick={() => toast({ 
            title: "Driving Test Prep", 
            description: "This feature is coming soon!"
          })}
        >
          <CardContent className="p-4">
            <div className="rounded-full p-2 bg-green-100 dark:bg-green-900/30 w-12 h-12 flex items-center justify-center mb-3">
              <Clipboard className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-lg mb-2">Driving Test Prep</h3>
            <p className="text-green-600 dark:text-green-400 text-sm mb-4">
              Practice tests, tips, and resources to help you pass your driving test easily
            </p>
            <Button variant="outline" className="w-full">Start Preparation</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default LearningServiceCards;