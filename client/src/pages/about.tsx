import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Car, Shield, Wrench, Award, Users, HeartHandshake, MapPin, Zap } from 'lucide-react';
import { useLocation } from 'wouter';

const AboutPage: React.FC = () => {
  const [, navigate] = useLocation();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
  
  const values = [
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Providing secure and trustworthy vehicle management solutions for every Indian car owner.",
      color: "bg-blue-500"
    },
    {
      icon: Wrench,
      title: "Quality Service",
      description: "Connecting vehicle owners with top-rated service providers for the best maintenance experience.",
      color: "bg-green-500"
    },
    {
      icon: Award,
      title: "Innovation",
      description: "Leveraging cutting-edge technology to enhance the vehicle ownership experience in India.",
      color: "bg-amber-500"
    },
    {
      icon: HeartHandshake,
      title: "Customer First",
      description: "Building features and services based on the real needs of Indian vehicle owners.",
      color: "bg-rose-500"
    }
  ];
  
  const milestones = [
    {
      year: 2021,
      title: "FixPoint Founded",
      description: "Started with a vision to transform vehicle management in India."
    },
    {
      year: 2022,
      title: "Service Network Expansion",
      description: "Connected with 500+ service centers across major Indian cities."
    },
    {
      year: 2023,
      title: "Launched Arena",
      description: "Introduced India's first 3D vehicle customization platform."
    },
    {
      year: 2024,
      title: "1 Million Users",
      description: "Reached the milestone of one million active users."
    },
    {
      year: 2025,
      title: "AI-Powered Predictions",
      description: "Launched Drishti for predictive maintenance using AI."
    }
  ];
  
  const team = [
    {
      name: "Rajiv Patel",
      role: "Founder & CEO",
      bio: "Former automotive engineer with 15+ years of experience in the Indian automotive industry."
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      bio: "Tech pioneer with expertise in AI and mobile applications, previously at leading tech companies."
    },
    {
      name: "Vikram Singh",
      role: "Head of Operations",
      bio: "Streamlined operations for major automotive service chains across India."
    },
    {
      name: "Ananya Desai",
      role: "Design Director",
      bio: "Award-winning UX designer focused on creating intuitive automotive interfaces."
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden opacity-5">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-700" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500" />
        </div>
        
        {/* Car animation in the background */}
        <motion.div 
          className="absolute right-0 bottom-0 opacity-10 hidden lg:block"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Car className="w-96 h-96 text-primary" />
        </motion.div>
        
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
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
            >
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg mb-4">
                <Car className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700 mb-6">
              Transforming Vehicle Management in India
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              FixPoint is India's first comprehensive vehicle intelligence platform, providing a smarter and more engaging way to manage your vehicle's entire lifecycle.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-primary text-white shadow-md"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary/5"
                onClick={() => navigate('/')}
              >
                Explore Platform
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-700">
              At FixPoint, our mission is to revolutionize how Indians interact with their vehicles by leveraging technology to simplify ownership, enhance maintenance, and create a more connected automotive ecosystem. We aim to be the single platform that serves all vehicle-related needs throughout its lifecycle.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className={`w-14 h-14 ${value.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Our Story Timeline */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-700">
              FixPoint has evolved from a simple vehicle management app to India's most comprehensive automotive platform. Here's our story so far.
            </p>
          </motion.div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200"></div>
            
            {/* Timeline items */}
            {milestones.map((milestone, index) => (
              <motion.div 
                key={index}
                className="relative z-10 mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`flex items-center justify-${index % 2 === 0 ? 'end' : 'start'} md:flex-row${index % 2 === 0 ? '-reverse' : ''}`}>
                  <div className="flex-1 md:text-right px-4">
                    {index % 2 === 0 ? (
                      <>
                        <div className="md:hidden flex items-baseline mb-1">
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded mr-2">
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                        </div>
                        <div className="hidden md:block">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{milestone.title}</h3>
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {milestone.year}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">{milestone.description}</p>
                      </>
                    ) : (
                      <div className="hidden md:block">
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="z-10 flex-shrink-0 w-8 h-8 rounded-full bg-primary border-4 border-white shadow"></div>
                  
                  <div className="flex-1 px-4">
                    {index % 2 !== 0 ? (
                      <>
                        <div className="flex items-baseline mb-1">
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded mr-2">
                            {milestone.year}
                          </span>
                          <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                        </div>
                        <p className="text-gray-600 mt-2">{milestone.description}</p>
                      </>
                    ) : (
                      <div className="hidden md:block">
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-700">
              We're a passionate team of automotive enthusiasts, tech experts, and business innovators dedicated to transforming vehicle ownership in India.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {team.map((member, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                variants={itemVariants}
              >
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 h-32 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Locations */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Presence</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-700">
              With headquarters in Bengaluru and offices in major cities, we're building a nationwide network to serve vehicle owners across India.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div 
              className="relative bg-white rounded-lg p-6 shadow-md border-l-4 border-primary hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <motion.div
                className="absolute top-4 right-4 text-primary/10"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
              >
                <MapPin className="h-16 w-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Bengaluru</h3>
              <p className="text-gray-900 font-medium mb-1">Headquarters</p>
              <p className="text-gray-600 mb-4">
                123 Tech Park, Electronic City<br />
                Bengaluru, Karnataka 560100
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +91 80-1234-5678<br />
                <span className="font-medium">Email:</span> bangalore@fixpoint.co.in
              </p>
            </motion.div>
            
            <motion.div 
              className="relative bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-600 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <motion.div
                className="absolute top-4 right-4 text-blue-600/10"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
              >
                <MapPin className="h-16 w-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mumbai</h3>
              <p className="text-gray-900 font-medium mb-1">Regional Office</p>
              <p className="text-gray-600 mb-4">
                456 Ocean Tower, Bandra West<br />
                Mumbai, Maharashtra 400050
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +91 22-2345-6789<br />
                <span className="font-medium">Email:</span> mumbai@fixpoint.co.in
              </p>
            </motion.div>
            
            <motion.div 
              className="relative bg-white rounded-lg p-6 shadow-md border-l-4 border-green-600 hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <motion.div
                className="absolute top-4 right-4 text-green-600/10"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
              >
                <MapPin className="h-16 w-16" />
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Delhi</h3>
              <p className="text-gray-900 font-medium mb-1">Regional Office</p>
              <p className="text-gray-600 mb-4">
                789 Business Hub, Connaught Place<br />
                New Delhi, Delhi 110001
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Phone:</span> +91 11-3456-7890<br />
                <span className="font-medium">Email:</span> delhi@fixpoint.co.in
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-blue-700 text-white">
        <div className="container">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to transform your vehicle experience?</h2>
            <p className="text-lg text-white/80 mb-8">
              Join millions of vehicle owners across India who trust FixPoint for their automotive needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100 shadow-lg"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;