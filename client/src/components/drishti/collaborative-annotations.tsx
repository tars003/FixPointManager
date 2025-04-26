import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Edit3, 
  Users, 
  Plus, 
  Send, 
  ThumbsUp, 
  Share2, 
  Trash2, 
  PenTool, 
  Camera, 
  CornerUpRight,
  Lock,
  Tag,
  Clock,
  Filter
} from 'lucide-react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies: Comment[];
  attachments?: {
    type: 'image' | 'link' | 'file';
    url: string;
    name: string;
  }[];
  annotations?: {
    position: { x: number; y: number };
    text: string;
  }[];
}

interface AnnotationCategory {
  id: string;
  name: string;
  count: number;
  color: string;
}

const CollaborativeAnnotations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('comments');
  const [newComment, setNewComment] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Handle post comment submission
  const handlePostComment = () => {
    if (newComment.trim()) {
      // In a real app, we would post to an API here
      console.log('Posting comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#00A3A3]" />
              Collaborative Annotations
            </CardTitle>
            <CardDescription>
              Team feedback and design comments for vehicle optimization
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 px-2 border-blue-200 bg-blue-50 text-blue-700">
              <Users className="h-3 w-3" />
              <span className="text-xs">12 Contributors</span>
            </Badge>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Share2 className="h-3.5 w-3.5" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="comments" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="annotations">Annotations</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="comments" className="space-y-4 pt-4">
            {/* Comment Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filter:</span>
              <CategoryFilter 
                categories={annotationCategories} 
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>
            
            {/* Comment List */}
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentCard 
                  key={comment.id} 
                  comment={comment} 
                />
              ))}
            </div>
            
            {/* Add Comment */}
            <div className="pt-4 border-t">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/05.png" alt="User" />
                  <AvatarFallback>ME</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <Textarea 
                    placeholder="Add your comment..." 
                    className="min-h-20 resize-none" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        <Camera className="h-3.5 w-3.5" />
                        Attach
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                        <PenTool className="h-3.5 w-3.5" />
                        Draw
                      </Button>
                    </div>
                    <Button 
                      size="sm" 
                      className="gap-1" 
                      onClick={handlePostComment}
                      disabled={!newComment.trim()}
                    >
                      <Send className="h-3.5 w-3.5" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="annotations" className="pt-4">
            <div className="space-y-4">
              <div className="relative w-full aspect-[3/2] overflow-hidden rounded-lg border">
                {/* Vehicle Image with Annotations Placeholder */}
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground/60" />
                    <p className="mt-2 text-muted-foreground">Vehicle image with annotation markers will appear here</p>
                  </div>
                </div>
                
                {/* Annotation Tools */}
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-md shadow-md">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PenTool className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">Recent Annotations</CardTitle>
                  </CardHeader>
                  <CardContent className="py-0 px-4">
                    <div className="space-y-3">
                      {annotationItems.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0">
                          <div 
                            className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-medium"
                            style={{ backgroundColor: item.color + '20', color: item.color }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                                <AvatarFallback>{item.user.initials}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{item.user.name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="text-base">Add Annotation</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 px-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium">Note</label>
                        <Textarea placeholder="Enter your annotation note..." className="mt-1 min-h-[80px]" />
                      </div>
                      <div>
                        <label className="text-xs font-medium">Category</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {annotationCategories.slice(1).map(category => (
                            <Badge 
                              key={category.id} 
                              variant="outline" 
                              style={{ 
                                backgroundColor: category.color + '10', 
                                borderColor: category.color + '40',
                                color: category.color
                              }}
                              className="cursor-pointer"
                            >
                              {category.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                          <Lock className="h-3.5 w-3.5" />
                          Private
                        </Button>
                        <Button size="sm">Add Annotation</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Activity</h3>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
              
              <div className="relative border-l-2 border-muted pl-6 space-y-6 py-2">
                {activityItems.map((activity, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[29px] top-0 h-4 w-4 rounded-full bg-background border-2 border-muted"></div>
                    <div className="flex flex-col">
                      <div className="flex items-start">
                        <Avatar className="h-7 w-7 mr-2">
                          <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-baseline flex-wrap gap-1">
                            <span className="font-medium text-sm">{activity.user.name}</span> 
                            <span className="text-sm text-muted-foreground">{activity.action}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                      
                      {activity.details && (
                        <div className="mt-2 ml-9 p-3 bg-muted/50 rounded-md text-sm">
                          {activity.details}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">
          Last updated: Mar 14, 2025, 11:43 AM
        </div>
        <Button variant="outline" size="sm" className="gap-1">
          <Tag className="h-3.5 w-3.5" />
          Manage Tags
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper Components
interface CommentCardProps {
  comment: Comment;
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
  const [showReplies, setShowReplies] = useState(false);
  
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="bg-muted/40 rounded-md p-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{comment.author.name}</span>
                <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-normal">
                  {comment.author.role}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{comment.timestamp}</p>
            </div>
          </div>
          
          <div className="mt-2">
            <p className="text-sm">{comment.content}</p>
            
            {comment.attachments && comment.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {comment.attachments.map((attachment, idx) => (
                  <div key={idx} className="p-2 rounded bg-background border flex items-center gap-2">
                    <Camera className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-medium">{attachment.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 pl-1">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <ThumbsUp className="h-3 w-3 mr-1" />
            Like{comment.likes > 0 && ` (${comment.likes})`}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
            <CornerUpRight className="h-3 w-3 mr-1" />
            Reply
          </Button>
        </div>
        
        {comment.replies.length > 0 && (
          <>
            <div className="pl-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setShowReplies(!showReplies)}
              >
                {showReplies 
                  ? "Hide replies" 
                  : `Show ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
              </Button>
            </div>
            
            {showReplies && (
              <div className="pl-4 pt-2 space-y-3">
                {comment.replies.map(reply => (
                  <div key={reply.id} className="flex gap-3">
                    <Avatar className="h-6 w-6 mt-1">
                      <AvatarImage src={reply.author.avatar} alt={reply.author.name} />
                      <AvatarFallback>{reply.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="bg-muted/30 rounded-md p-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-medium text-sm">{reply.author.name}</span>
                          <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm mt-1">{reply.content}</p>
                      </div>
                      
                      <div className="flex items-center gap-2 pl-1 mt-1">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Like{reply.likes > 0 && ` (${reply.likes})`}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface CategoryFilterProps {
  categories: AnnotationCategory[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map(category => (
        <Badge 
          key={category.id} 
          variant={selectedCategory === category.id ? "default" : "outline"}
          className="cursor-pointer"
          style={
            selectedCategory === category.id 
              ? { backgroundColor: category.color, color: 'white' }
              : { borderColor: category.color + '40', color: category.color }
          }
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name} {category.count > 0 && `(${category.count})`}
        </Badge>
      ))}
    </div>
  );
};

// Sample Data
const annotationCategories: AnnotationCategory[] = [
  { id: 'all', name: 'All', count: 0, color: '#6C757D' },
  { id: 'performance', name: 'Performance', count: 5, color: '#0056B3' },
  { id: 'efficiency', name: 'Efficiency', count: 3, color: '#00A3A3' },
  { id: 'safety', name: 'Safety', count: 2, color: '#DC3545' },
  { id: 'comfort', name: 'Comfort', count: 1, color: '#FFC107' }
];

const comments: Comment[] = [
  {
    id: 'comment1',
    author: {
      name: 'Rajesh Kumar',
      avatar: '/avatars/01.png',
      role: 'Fleet Manager'
    },
    content: 'The engine performance drops significantly when driving in hilly areas. Can we optimize the fuel injection system for better response?',
    timestamp: 'Today, 10:32 AM',
    likes: 3,
    replies: [
      {
        id: 'reply1',
        author: {
          name: 'Amrita Patel',
          avatar: '/avatars/02.png',
          role: 'Engineer'
        },
        content: 'Good observation. The OBD data confirms this issue. I\'ll check the fuel map and suggest adjustments.',
        timestamp: 'Today, 11:05 AM',
        likes: 1,
        replies: []
      },
      {
        id: 'reply2',
        author: {
          name: 'Vivek Singh',
          avatar: '/avatars/03.png',
          role: 'Technician'
        },
        content: 'We can also look at the air intake pressure which seems to drop in higher altitudes.',
        timestamp: 'Today, 11:38 AM',
        likes: 0,
        replies: []
      }
    ]
  },
  {
    id: 'comment2',
    author: {
      name: 'Priya Sharma',
      avatar: '/avatars/04.png',
      role: 'Driver'
    },
    content: 'The AC performance has improved significantly after the last update. Energy consumption has reduced by about 15% while maintaining the same cooling performance.',
    timestamp: 'Yesterday, 4:15 PM',
    likes: 5,
    replies: [],
    attachments: [
      {
        type: 'image',
        url: '/images/energy-chart.png',
        name: 'AC Energy Consumption Comparison.png'
      }
    ]
  }
];

const annotationItems = [
  {
    text: 'Optimize intake manifold for better airflow',
    user: { name: 'Anil Mehta', avatar: '/avatars/05.png', initials: 'AM' },
    color: '#0056B3'
  },
  {
    text: 'Battery thermal management needs improvement',
    user: { name: 'Kavita Roy', avatar: '/avatars/06.png', initials: 'KR' },
    color: '#00A3A3'
  },
  {
    text: 'Suspension damping could be stiffer for better handling',
    user: { name: 'Deepak Joshi', avatar: '/avatars/07.png', initials: 'DJ' },
    color: '#FFC107'
  }
];

const activityItems = [
  {
    user: { name: 'Rajesh Kumar', avatar: '/avatars/01.png', initials: 'RK' },
    action: 'added a new comment',
    time: '2 hours ago',
    details: 'The engine performance drops significantly when driving in hilly areas. Can we optimize the fuel injection system for better response?'
  },
  {
    user: { name: 'Amrita Patel', avatar: '/avatars/02.png', initials: 'AP' },
    action: 'replied to Rajesh Kumar',
    time: '1 hour ago',
    details: null
  },
  {
    user: { name: 'Priya Sharma', avatar: '/avatars/04.png', initials: 'PS' },
    action: 'attached a performance chart to their comment',
    time: 'Yesterday',
    details: null
  },
  {
    user: { name: 'Vivek Singh', avatar: '/avatars/03.png', initials: 'VS' },
    action: 'created an annotation on the engine diagram',
    time: '2 days ago',
    details: null
  }
];

export default CollaborativeAnnotations;