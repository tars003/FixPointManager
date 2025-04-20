import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, Award, BookOpen, Video, FileText, ChevronRight, Check } from 'lucide-react';

const courses = [
  {
    id: 1,
    title: "Beginner's Driving Course",
    description: "Learn the basics of driving from scratch.",
    lessons: 12,
    duration: "8 hours",
    level: "Beginner",
    rating: 4.8,
    students: 1245,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    title: "Defensive Driving Techniques",
    description: "Master advanced techniques for safer driving.",
    lessons: 8,
    duration: "6 hours",
    level: "Intermediate",
    rating: 4.9,
    students: 876,
    image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    title: "Highway & Expressway Driving",
    description: "Confidently navigate high-speed roadways.",
    lessons: 6,
    duration: "4 hours",
    level: "Intermediate",
    rating: 4.7,
    students: 623,
    image: "https://images.unsplash.com/photo-1593007791459-4b05e1158258?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3"
  }
];

const resources = [
  {
    id: 1,
    title: "Driver's Handbook 2023",
    type: "PDF Guide",
    icon: <FileText className="h-5 w-5" />,
    downloads: 5230
  },
  {
    id: 2,
    title: "Road Signs Mastery",
    type: "Interactive Quiz",
    icon: <Award className="h-5 w-5" />,
    downloads: 3421
  },
  {
    id: 3,
    title: "Parallel Parking Tutorial",
    type: "Video Tutorial",
    icon: <Video className="h-5 w-5" />,
    downloads: 4185
  },
  {
    id: 4,
    title: "Vehicle Maintenance Basics",
    type: "PDF Guide",
    icon: <FileText className="h-5 w-5" />,
    downloads: 2946
  }
];

const LearnDriving = () => {
  const [activeTab, setActiveTab] = useState("courses");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-neutral-dark lg:block hidden">Learn Driving</h2>
        <p className="text-neutral-light mt-1">Master driving skills with our comprehensive courses</p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3" 
            alt="Driving School Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 md:px-10">
            <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">Learn to Drive with Confidence</h3>
            <p className="text-white/80 max-w-md mb-4">Comprehensive courses taught by certified instructors</p>
            <div>
              <Button className="bg-primary hover:bg-primary-dark">
                Get Started Now
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="courses" value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="courses" className="flex items-center justify-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center justify-center">
            <FileText className="h-4 w-4 mr-2" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center justify-center">
            <Award className="h-4 w-4 mr-2" />
            Instructors
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90 text-white">{course.level}</Badge>
                  </div>
                  <Button variant="default" size="icon" className="absolute bottom-3 right-3 rounded-full h-10 w-10 bg-primary/90">
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-sm text-neutral-light mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{course.duration}</span>
                    <span className="mx-2">•</span>
                    <span>{course.lessons} lessons</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{course.rating}</span>
                      <span className="text-neutral-light ml-1">({course.students} students)</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button variant="outline" className="w-full flex items-center justify-center">
                    Enroll Now
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">View All Courses</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <CardContent className="p-4 flex items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mr-4">
                    <div className="text-primary">
                      {resource.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-neutral-light">{resource.type}</p>
                  </div>
                  
                  <div className="ml-4">
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">Browse All Resources</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="instructors">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3" 
                    alt="Instructor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">Michael Johnson</h3>
                <p className="text-neutral-light text-sm mb-3">Senior Driving Instructor</p>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">4.9</span>
                  <span className="text-neutral-light ml-1">(243 reviews)</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>15+ years experience</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Certified Instructor</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Specialized in Defensive Driving</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4">Book Lesson</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3" 
                    alt="Instructor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">Sarah Williams</h3>
                <p className="text-neutral-light text-sm mb-3">Advanced Driving Coach</p>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">4.8</span>
                  <span className="text-neutral-light ml-1">(187 reviews)</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>12+ years experience</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Master Instructor</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Specialized in New Drivers</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4">Book Lesson</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200&ixlib=rb-4.0.3" 
                    alt="Instructor" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">David Thompson</h3>
                <p className="text-neutral-light text-sm mb-3">Performance Driving Expert</p>
                
                <div className="flex items-center justify-center mb-4">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="font-medium">4.9</span>
                  <span className="text-neutral-light ml-1">(156 reviews)</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>18+ years experience</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Former Race Driver</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-2" />
                    <span>Specialized in Advanced Techniques</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4">Book Lesson</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 flex justify-center">
            <Button variant="outline">View All Instructors</Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-primary/5 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-4">
            <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
            <p className="text-neutral-light">Take the first step towards becoming a confident driver.</p>
          </div>
          <Button size="lg">Sign Up for Free Assessment</Button>
        </div>
      </div>
    </div>
  );
};

export default LearnDriving;
