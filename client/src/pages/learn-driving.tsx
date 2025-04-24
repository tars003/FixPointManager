import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PenTool,
  GraduationCap,
  MapPin,
  Clock,
  CheckCircle,
  Building,
  Car,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import LearningServiceCards from '@/components/learning/LearningServiceCards';

// Learn Driving & RTO Services Page
const LearnDrivingPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-dark">
            Learn Driving & RTO Services
          </h1>
          <p className="text-neutral-light mt-1">
            Expert driving lessons, RTO assistance, and license test preparation
          </p>
        </div>
        
        {/* Hero Section */}
        <Card className="mb-8 overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white p-6 sm:p-8">
              <div className="max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Master Driving Skills with Expert Guidance</h2>
                <p className="text-lg opacity-90 mb-6">
                  Professional lessons for all vehicle types, guided RTO services, and comprehensive test preparation—all in one place.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                    Book a Demo Class
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Browse All Services
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Services Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Our Services</h2>
          </div>
          
          <LearningServiceCards />
        </div>
        
        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">Why Choose Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full p-2 bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Expert Instructors</h3>
                <p className="text-neutral-light">
                  Learn from certified driving instructors with years of experience and excellent teaching skills.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full p-2 bg-blue-100 w-12 h-12 flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Modern Vehicles</h3>
                <p className="text-neutral-light">
                  Practice on well-maintained, dual-control vehicles equipped with safety features for a secure learning experience.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="rounded-full p-2 bg-amber-100 w-12 h-12 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold text-lg mb-2">Simplified RTO Process</h3>
                <p className="text-neutral-light">
                  End-to-end assistance with license applications, renewals, and other RTO services with minimal paperwork.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                1
              </div>
              <h3 className="font-bold mb-2">Choose Service</h3>
              <p className="text-neutral-light text-sm">
                Select the service you need from our wide range of driving and RTO offerings.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                2
              </div>
              <h3 className="font-bold mb-2">Book Appointment</h3>
              <p className="text-neutral-light text-sm">
                Schedule a convenient time and location for your lessons or RTO assistance.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                3
              </div>
              <h3 className="font-bold mb-2">Expert Assistance</h3>
              <p className="text-neutral-light text-sm">
                Receive personalized guidance from our professional instructors or RTO specialists.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mb-4">
                4
              </div>
              <h3 className="font-bold mb-2">Achieve Your Goal</h3>
              <p className="text-neutral-light text-sm">
                Become a confident driver or get your RTO work completed with minimal hassle.
              </p>
            </div>
          </div>
        </div>
        
        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6">What Our Students Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-light mb-4">
                  "I was nervous about learning to drive, but the instructors were patient and helped me build confidence. Passed my test on the first attempt!"
                </p>
                <div className="font-medium">Rahul M.</div>
                <div className="text-xs text-neutral-light">Car Driving Course</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-light mb-4">
                  "The RTO services were a lifesaver! They handled all the paperwork and guided me through the entire process of getting my license renewed."
                </p>
                <div className="font-medium">Priya S.</div>
                <div className="text-xs text-neutral-light">License Renewal Service</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-neutral-light mb-4">
                  "The practice tests helped me understand traffic rules thoroughly. The mock tests simulated the actual test environment perfectly."
                </p>
                <div className="font-medium">Akash J.</div>
                <div className="text-xs text-neutral-light">Test Preparation</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQs */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>How many driving lessons do I need to become proficient?</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-light text-sm">
                    The number of lessons varies based on individual learning pace, but typically 15-20 lessons of 1 hour each are recommended for complete beginners. Some may require fewer lessons if they have prior experience.
                  </p>
                </details>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>What documents do I need for a learner's license?</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-light text-sm">
                    For a learner's license, you typically need age proof (Aadhar/PAN/Passport), address proof, passport-size photographs, Form 1 filled and signed, and a medical certificate (Form 1A). Our RTO services team will guide you through the process.
                  </p>
                </details>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>Do you provide vehicles for the driving test?</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-light text-sm">
                    Yes, we provide well-maintained vehicles for your driving test. Our vehicles are equipped with all necessary features and safety measures required for the test. You can also practice on the same vehicle before your test to get familiar with it.
                  </p>
                </details>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>How long does it take to get a permanent driving license?</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-light text-sm">
                    After obtaining a learner's license, you must wait for at least 30 days before applying for a permanent license. The permanent license process takes about 7-10 working days after you pass the driving test. With our RTO services, we help expedite the process as much as possible.
                  </p>
                </details>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <details className="group">
                  <summary className="flex cursor-pointer items-center justify-between font-medium">
                    <span>Do you offer corporate driving training programs?</span>
                    <span className="transition group-open:rotate-180">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-neutral-light text-sm">
                    Yes, we offer specialized corporate training programs for organizations that want to train their employees in safe driving practices. These programs can be customized based on your company's specific requirements and can include defensive driving, emergency handling, and more.
                  </p>
                </details>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* CTA Section */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <CardContent className="p-6 sm:p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Become a Confident Driver?</h2>
              <p className="text-lg opacity-90 mb-6">
                Start your driving journey today with expert guidance every step of the way.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90">
                  Book a Lesson Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Contact Us
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnDrivingPage;