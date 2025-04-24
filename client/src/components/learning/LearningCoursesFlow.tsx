import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  X,
  ArrowLeft,
  GraduationCap,
  Calendar,
  Users,
  MapPin,
  Star,
  Check,
  Clock,
  ArrowRight,
  Car,
  Truck,
  Bike,
  CalendarClock,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Available course types
const courseTypes = [
  { value: 'car', label: 'Car Driving', icon: Car },
  { value: 'bike', label: 'Two-Wheeler', icon: Bike },
  { value: 'commercial', label: 'Commercial Vehicle', icon: Truck },
];

// Course categories
const courseCategories = [
  { value: 'beginner', label: 'Beginner', description: 'For complete beginners with no prior experience' },
  { value: 'intermediate', label: 'Intermediate', description: 'For those with some experience but need more practice' },
  { value: 'advanced', label: 'Advanced', description: 'For experienced drivers wanting to enhance skills' },
  { value: 'refresher', label: 'Refresher', description: 'For those returning to driving after a break' },
  { value: 'defensive', label: 'Defensive Driving', description: 'Focus on safety techniques and hazard awareness' },
];

// Sample courses
const sampleCourses = [
  {
    id: 1,
    title: 'Complete Car Driving Course',
    type: 'car',
    category: 'beginner',
    rating: 4.8,
    reviewCount: 215,
    price: 5999,
    duration: '15 days',
    sessions: 15,
    location: 'Multiple centers',
    instructor: 'Professional Instructors',
    features: [
      'Personalized training with expert instructors',
      'Flexible timing options for your convenience',
      'Modern vehicles with dual controls for safety',
      'Comprehensive road safety and traffic rules education',
      'Practice on diverse road conditions and traffic scenarios',
      'Mock tests to prepare for RTO driving test',
    ],
    description: 'Our comprehensive beginner car driving course is designed for those with no prior experience. This program covers all the essential skills needed to become a confident driver, from basic vehicle controls to navigating complex traffic situations.'
  },
  {
    id: 2,
    title: 'Two-Wheeler Expert Course',
    type: 'bike',
    category: 'beginner',
    rating: 4.7,
    reviewCount: 132,
    price: 3499,
    duration: '10 days',
    sessions: 10,
    location: 'Multiple centers',
    instructor: 'Certified Trainers',
    features: [
      'Learn on various two-wheeler models',
      'Balance training for beginners',
      'Traffic navigation and rule awareness',
      'Special focus on safety gear and precautions',
      'Defensive riding techniques',
      'Preparation for license test',
    ],
    description: 'Master two-wheeler riding with our comprehensive course. From basics to advanced techniques, we ensure you become a skilled and responsible rider ready for all road conditions.'
  },
  {
    id: 3,
    title: 'Commercial Vehicle Training',
    type: 'commercial',
    category: 'beginner',
    rating: 4.9,
    reviewCount: 87,
    price: 7999,
    duration: '21 days',
    sessions: 21,
    location: 'Selected centers',
    instructor: 'Professional Commercial Drivers',
    features: [
      'Training on various commercial vehicles',
      'Heavy vehicle handling and maneuverability',
      'Loading and weight distribution knowledge',
      'Commercial driver regulations and compliance',
      'Long-distance driving techniques',
      'Preparation for commercial license test',
    ],
    description: "Our comprehensive commercial vehicle training prepares you for a successful career as a professional driver. With focus on safety, regulations, and practical skills, you'll be ready to handle various commercial vehicles with confidence."
  },
];

// Enquiry form schema
const enquirySchema = z.object({
  name: z.string().min(3, { message: 'Please enter your full name' }),
  phone: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  location: z.string().min(1, { message: 'Please select your preferred location' }),
  preferredDate: z.string().min(1, { message: 'Please choose your preferred start date' }),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface LearningCoursesFlowProps {
  onClose: () => void;
}

const LearningCoursesFlow: React.FC<LearningCoursesFlowProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<string>('car');
  const [selectedCategory, setSelectedCategory] = useState<string>('beginner');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnquirySubmitted, setIsEnquirySubmitted] = useState(false);

  // Enquiry form
  const enquiryForm = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      location: '',
      preferredDate: '',
    },
  });

  // Filtered courses based on type and category
  const filteredCourses = sampleCourses.filter(
    course => course.type === selectedType && course.category === selectedCategory
  );

  // Handle enquiry form submission
  const onEnquirySubmit = (values: EnquiryFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsEnquirySubmitted(true);
      
      toast({
        title: 'Enquiry submitted successfully',
        description: 'Our team will contact you shortly',
      });
    }, 2000);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 10);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2">
              {selectedCourse && (
                <Button variant="ghost" size="icon" onClick={() => setSelectedCourse(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold">
                {!selectedCourse ? 'Driving Courses' : 'Course Details'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Course Listing */}
          {!selectedCourse && !isEnquirySubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Select Vehicle Type</h3>
                <div className="flex flex-wrap gap-3">
                  {courseTypes.map((type) => (
                    <button
                      key={type.value}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        selectedType === type.value
                          ? 'bg-primary text-white border-primary'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedType(type.value)}
                    >
                      <type.icon className="h-4 w-4" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Course Level</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {courseCategories.map((category) => (
                    <button
                      key={category.value}
                      className={`p-3 rounded-lg border text-left ${
                        selectedCategory === category.value
                          ? 'bg-primary/5 border-primary'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{category.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Available Courses</h3>
                
                {filteredCourses.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCourses.map((course) => (
                      <Card
                        key={course.id}
                        className="cursor-pointer hover:shadow-md transition-shadow overflow-hidden"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-bold text-lg">{course.title}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span>{course.rating}</span>
                                  <span>({course.reviewCount} reviews)</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{course.duration}</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                  <CalendarClock className="h-4 w-4" />
                                  <span>{course.sessions} sessions</span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 mt-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {courseTypes.find(t => t.value === course.type)?.label}
                                </span>
                                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                  {courseCategories.find(c => c.value === course.category)?.label}
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">₹{course.price}</div>
                              <div className="text-sm text-gray-500">inclusive of all taxes</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
                    <GraduationCap className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-2">No courses found</h3>
                    <p className="text-gray-500">
                      We couldn't find any courses matching your selection. Please try different filters or contact us for custom training options.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          
          {/* Course Detail */}
          {selectedCourse && !isEnquirySubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-0"
            >
              {/* Course Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-300 fill-yellow-300" />
                    <span>{selectedCourse.rating}</span>
                    <span>({selectedCourse.reviewCount} reviews)</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <CalendarClock className="h-4 w-4" />
                    <span>{selectedCourse.sessions} sessions</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Course Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-medium mb-1">Course Fee</div>
                    <div className="text-2xl font-bold text-primary">₹{selectedCourse.price}</div>
                    <div className="text-xs text-gray-500">inclusive of all taxes</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-medium mb-1">Duration</div>
                    <div className="text-lg">{selectedCourse.duration}</div>
                    <div className="text-xs text-gray-500">{selectedCourse.sessions} training sessions</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="font-medium mb-1">Instructor</div>
                    <div className="text-lg">{selectedCourse.instructor}</div>
                    <div className="text-xs text-gray-500">Experienced & certified</div>
                  </div>
                </div>
                
                {/* Course Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">About the Course</h3>
                  <p className="text-gray-600">{selectedCourse.description}</p>
                </div>
                
                {/* Course Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCourse.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Enquiry Form */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Enquire About This Course</h3>
                  
                  <Form {...enquiryForm}>
                    <form onSubmit={enquiryForm.handleSubmit(onEnquirySubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={enquiryForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={enquiryForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mobile Number</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="10-digit mobile number" 
                                  value={field.value}
                                  onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={enquiryForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your email address" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={enquiryForm.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Location</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="andheri">Andheri, Mumbai</SelectItem>
                                  <SelectItem value="bandra">Bandra, Mumbai</SelectItem>
                                  <SelectItem value="dadar">Dadar, Mumbai</SelectItem>
                                  <SelectItem value="thane">Thane</SelectItem>
                                  <SelectItem value="navi">Navi Mumbai</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={enquiryForm.control}
                          name="preferredDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Start Date</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select date" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediately</SelectItem>
                                  <SelectItem value="week">Within a week</SelectItem>
                                  <SelectItem value="twoweeks">In 2 weeks</SelectItem>
                                  <SelectItem value="month">Next month</SelectItem>
                                  <SelectItem value="flexible">Flexible (to be discussed)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="mt-2">
                        <Button 
                          type="submit" 
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Enquiry Success */}
          {isEnquirySubmitted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">Enquiry Submitted Successfully!</h3>
              
              <p className="text-gray-600 mb-6">
                Thank you for your interest in our driving courses. Our team will contact you shortly to discuss your requirements and provide more information.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Course:</span>
                  <span className="font-medium">{selectedCourse.title}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-medium">₹{selectedCourse.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{selectedCourse.duration} ({selectedCourse.sessions} sessions)</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" onClick={onClose}>
                Back to Courses
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningCoursesFlow;