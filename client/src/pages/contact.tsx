import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Send, 
  CheckCircle2,
  Building,
  Car,
  Headphones,
  MessageSquareDashed,
  HelpCircle
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

const ContactPage: React.FC = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    department: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setFormSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We've received your message and will get back to you soon."
      });
    }, 1000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const contactMethods = [
    {
      icon: Headphones,
      title: "Customer Support",
      description: "Get help with your account or vehicle management needs",
      link: "support@fixpoint.co.in",
      linkLabel: "Email Support",
      color: "bg-blue-500"
    },
    {
      icon: Car,
      title: "Service Inquiries",
      description: "Questions about service bookings, repairs, or maintenance",
      link: "+91 1800-123-4567",
      linkLabel: "Call Service Team",
      color: "bg-green-500"
    },
    {
      icon: Building,
      title: "Business Relations",
      description: "For service centers looking to partner with FixPoint",
      link: "partners@fixpoint.co.in",
      linkLabel: "Partner With Us",
      color: "bg-amber-500"
    },
    {
      icon: HelpCircle,
      title: "Media Inquiries",
      description: "Press, media coverage, and public relations",
      link: "press@fixpoint.co.in",
      linkLabel: "Contact PR Team",
      color: "bg-purple-500"
    }
  ];
  
  const offices = [
    {
      city: "Bengaluru",
      address: "123 Tech Park, Electronic City\nBengaluru, Karnataka 560100",
      phone: "+91 80-1234-5678",
      email: "bangalore@fixpoint.co.in",
      mapLink: "https://maps.google.com",
      primary: true
    },
    {
      city: "Mumbai",
      address: "456 Ocean Tower, Bandra West\nMumbai, Maharashtra 400050",
      phone: "+91 22-2345-6789",
      email: "mumbai@fixpoint.co.in",
      mapLink: "https://maps.google.com"
    },
    {
      city: "Delhi",
      address: "789 Business Hub, Connaught Place\nNew Delhi, Delhi 110001",
      phone: "+91 11-3456-7890",
      email: "delhi@fixpoint.co.in",
      mapLink: "https://maps.google.com"
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div 
            className="absolute top-20 left-10 opacity-5"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, 5, 0] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <MessageSquareDashed className="h-64 w-64 text-primary" />
          </motion.div>
          <motion.div 
            className="absolute bottom-10 right-10 opacity-5"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, -5, 0] 
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "mirror" 
            }}
          >
            <MapPin className="h-72 w-72 text-blue-700" />
          </motion.div>
        </div>
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-block mb-4"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg mb-4">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                Get in Touch
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to hear from you! Whether you have a question about our services, need help with your account, or want to partner with us, our team is ready to help.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Contact Methods */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {contactMethods.map((method, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="group"
              >
                <Card className="h-full transition-all duration-300 hover:shadow-md border-t-4 border-t-transparent group-hover:border-t-4 group-hover:border-t-primary">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${method.color} flex items-center justify-center text-white mb-4`}>
                      <method.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      variant="link" 
                      className="p-0 text-primary group-hover:text-blue-700 group-hover:underline"
                      onClick={() => {
                        if (method.link.includes('@')) {
                          window.location.href = `mailto:${method.link}`;
                        } else if (method.link.includes('+')) {
                          window.location.href = `tel:${method.link}`;
                        }
                      }}
                    >
                      {method.linkLabel} →
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Contact Form & Office Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-xl shadow-md p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full z-0"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
                  {formSubmitted ? (
                    <motion.div 
                      className="text-center py-8"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                      <p className="text-gray-600 mb-6">
                        Your message has been sent successfully. We'll get back to you soon.
                      </p>
                      <Button 
                        onClick={() => setFormSubmitted(false)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="Your name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+91 12345 67890"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                            Department *
                          </label>
                          <Select 
                            value={formData.department} 
                            onValueChange={handleSelectChange}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer_support">Customer Support</SelectItem>
                              <SelectItem value="technical">Technical Support</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="partnerships">Partnerships</SelectItem>
                              <SelectItem value="media">Media Relations</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject *
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Please describe your query in detail..."
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white group"
                      >
                        Send Message
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
            
            {/* Office Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h2>
              
              <div className="space-y-6">
                {offices.map((office, index) => (
                  <Card 
                    key={index} 
                    className={`overflow-hidden ${office.primary ? 'border-primary' : ''}`}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-primary" />
                        {office.city}
                        {office.primary && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            Headquarters
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 whitespace-pre-line">{office.address}</p>
                      
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <a 
                            href={`tel:${office.phone}`} 
                            className="text-gray-700 hover:text-primary"
                          >
                            {office.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <a 
                            href={`mailto:${office.email}`} 
                            className="text-gray-700 hover:text-primary"
                          >
                            {office.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <a 
                        href={office.mapLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-blue-700 text-sm font-medium flex items-center"
                      >
                        View on Google Maps
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-700">
              Find quick answers to common questions about contacting us and our support services.
            </p>
          </motion.div>
          
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="grid gap-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {[
                {
                  question: "What is the typical response time for inquiries?",
                  answer: "We aim to respond to all inquiries within 24 hours on business days. For urgent matters, please call our customer support line for immediate assistance."
                },
                {
                  question: "How can I track the status of my service request?",
                  answer: "You can track the status of your service request by logging into your FixPoint account and navigating to the 'My Requests' section. Alternatively, you can contact our customer support team with your request reference number."
                },
                {
                  question: "I'm a service provider. How can I partner with FixPoint?",
                  answer: "We're always looking to expand our network of quality service providers. Please use our contact form and select 'Partnerships' as the department, or email us directly at partners@fixpoint.co.in with details about your service center."
                },
                {
                  question: "Is there a direct line for emergency roadside assistance?",
                  answer: "Yes, our emergency roadside assistance is available 24/7 at +91 1800-111-0000. You can also access emergency services directly through the FixPoint mobile app."
                },
                {
                  question: "How can I provide feedback about your service?",
                  answer: "We value your feedback! You can share your experience through the 'Feedback' section in the app, or by contacting our customer support team. Your insights help us improve our services."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;