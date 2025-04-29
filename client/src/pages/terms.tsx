import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout';
import { 
  ShieldCheck, 
  Scale,
  FileLock,
  FileWarning,
  FileCheck,
  FileX,
  FileText,
  Shield,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TermsPage: React.FC = () => {
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
  
  // Last updated date
  const lastUpdated = "April 15, 2025";
  
  // Document sections with their corresponding icons
  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: FileText,
      color: "text-blue-500",
      content: [
        "Welcome to FixPoint, India's comprehensive vehicle intelligence platform. These Terms of Service ('Terms') govern your access to and use of the FixPoint website, mobile applications, and services (collectively, the 'Services').",
        "By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.",
        "Please read these Terms carefully, as they contain important information about your legal rights, remedies, and obligations. By using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms."
      ]
    },
    {
      id: "definitions",
      title: "Definitions",
      icon: FileCheck,
      color: "text-emerald-500",
      content: [
        "'FixPoint', 'we', 'us', and 'our' refer to FixPoint Technologies Pvt. Ltd., a company registered under the laws of India.",
        "'User', 'you', and 'your' refer to any individual or entity that accesses or uses our Services.",
        "'Content' refers to text, graphics, images, music, software, audio, video, information or other materials.",
        "'User Content' refers to any Content that users submit, upload, publish, or transmit to, through, or in connection with the Services.",
        "'Vehicle Data' refers to information about your vehicle(s), including but not limited to make, model, year, registration details, service history, and diagnostic information."
      ]
    },
    {
      id: "account",
      title: "Account Registration and Requirements",
      icon: ShieldCheck,
      color: "text-indigo-500",
      content: [
        "To access certain features of our Services, you must register and create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.",
        "You are responsible for safeguarding your account credentials. You agree that you will not disclose your password to any third party and that you will take sole responsibility for any activities or actions under your account, whether or not you have authorized such activities or actions.",
        "You must be at least 18 years old to create an account and use our Services. By creating an account, you represent and warrant that you are 18 years of age or older.",
        "We reserve the right to suspend or terminate your account if any information provided during the registration process or thereafter proves to be inaccurate, false, or outdated."
      ]
    },
    {
      id: "vehicle-data",
      title: "Vehicle Data and Privacy",
      icon: FileLock,
      color: "text-purple-500",
      content: [
        "By connecting your vehicle to our Services, you authorize us to collect and process Vehicle Data in accordance with our Privacy Policy.",
        "You represent and warrant that you have the right to share any Vehicle Data you provide to us, including any data from connected devices or third-party services.",
        "We may use Vehicle Data to provide, maintain, and improve our Services, as well as to develop new products and services.",
        "We take reasonable measures to protect your Vehicle Data, but we cannot guarantee its absolute security. You acknowledge that any information you provide may be accessed by unauthorized third parties due to errors, hacking, or other unavoidable circumstances.",
        "Please refer to our Privacy Policy for more information on how we collect, use, and disclose your personal information and Vehicle Data."
      ]
    },
    {
      id: "services",
      title: "Services and Features",
      icon: Car,
      color: "text-sky-500",
      content: [
        "FixPoint provides a platform for vehicle management, including but not limited to vehicle registration, service booking, maintenance tracking, emergency assistance, and vehicle diagnostics.",
        "The availability and functionality of certain Services may depend on factors beyond our control, including the compatibility of your vehicle, mobile device, or third-party services.",
        "We reserve the right to modify, suspend, or discontinue any part of our Services at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Services.",
        "Some features of our Services may require additional terms or fees. We will clearly communicate any additional terms or fees before you access such features."
      ]
    },
    {
      id: "payments",
      title: "Payments and Subscriptions",
      icon: FileWarning,
      color: "text-amber-500",
      content: [
        "Some of our Services may require payment of fees. You agree to pay all fees and charges associated with your use of our Services in accordance with the fees, charges, and billing terms in effect at the time.",
        "Subscription fees are billed in advance and are non-refundable. There will be no refunds or credits for partial months of service, or for periods in which you did not use the Services.",
        "We may change the fees and charges in effect, or add new fees and charges from time to time, but we will give you advance notice of these changes through a notification on our website or app.",
        "If you dispute any charges, you must notify us in writing within 30 days after the date of the charge.",
        "We use third-party payment processors to process payments. By providing payment information, you authorize us to charge the amount due to your selected payment method."
      ]
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: Scale,
      color: "text-red-500",
      content: [
        "To the maximum extent permitted by applicable law, FixPoint and its officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from:",
        "Your access to or use of or inability to access or use the Services;",
        "Any conduct or content of any third party on the Services;",
        "Any content obtained from the Services;",
        "Unauthorized access, use, or alteration of your transmissions or content;",
        "Statements or conduct of any third party on the Services;",
        "Any other matter relating to the Services.",
        "In no event shall our total liability to you exceed the amount you have paid to us in the twelve (12) months preceding the event giving rise to the liability."
      ]
    },
    {
      id: "indemnity",
      title: "Indemnification",
      icon: Shield,
      color: "text-orange-500",
      content: [
        "You agree to defend, indemnify, and hold harmless FixPoint and its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with:",
        "Your access to or use of the Services;",
        "Your violation of these Terms;",
        "Your violation of any third-party right, including without limitation any intellectual property right, publicity, confidentiality, property, or privacy right;",
        "Any claim that your User Content caused damage to a third party.",
        "This indemnification obligation will survive the termination of these Terms and your use of the Services."
      ]
    },
    {
      id: "termination",
      title: "Termination and Account Deletion",
      icon: FileX,
      color: "text-gray-500",
      content: [
        "We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.",
        "Upon termination, your right to use the Services will immediately cease. If you wish to terminate your account, you may simply discontinue using the Services, or you can request account deletion through the app settings.",
        "All provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.",
        "Upon account termination, your personal information will be handled in accordance with our Privacy Policy. Vehicle Data that has been de-identified or aggregated may continue to be used for research and analytics purposes."
      ]
    },
    {
      id: "governing-law",
      title: "Governing Law and Dispute Resolution",
      icon: Scale,
      color: "text-teal-500",
      content: [
        "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.",
        "Any dispute arising out of or in connection with these Terms, including any question regarding their existence, validity, or termination, shall be referred to and finally resolved by arbitration in Bengaluru, India, in accordance with the Arbitration and Conciliation Act, 1996.",
        "The arbitration shall be conducted in English by a single arbitrator appointed by mutual agreement of the parties. If the parties cannot agree on an arbitrator, the arbitrator shall be appointed in accordance with the Arbitration and Conciliation Act, 1996.",
        "The decision of the arbitrator shall be final and binding upon both parties."
      ]
    },
    {
      id: "changes",
      title: "Changes to Terms",
      icon: FileLock,
      color: "text-violet-500",
      content: [
        "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.",
        "By continuing to access or use our Services after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Services.",
        "We will notify you of any changes to these Terms by posting the new Terms on our website and updating the 'Last Updated' date at the top of these Terms."
      ]
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-8">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-700 shadow-lg flex items-center justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Scale className="h-10 w-10 text-white" />
            </motion.div>
          </div>
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
              Terms of Service
            </h1>
            <p className="text-gray-600 mb-2">
              Last Updated: {lastUpdated}
            </p>
            <p className="text-gray-600">
              Please read these Terms carefully before using the FixPoint platform.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Table of Contents */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section, index) => (
                <a 
                  key={index}
                  href={`#${section.id}`}
                  className="flex items-center p-2 hover:bg-gray-50 rounded transition-colors group"
                >
                  <span className={cn("mr-2", section.color)}>
                    <section.icon className="h-4 w-4" />
                  </span>
                  <span className="text-gray-800 group-hover:text-primary transition-colors">
                    {index + 1}. {section.title}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Terms Sections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sections.map((section, index) => (
              <motion.div 
                key={section.id}
                id={section.id}
                className="scroll-mt-24"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className={cn("mr-4 p-3 rounded-lg bg-gray-100", section.color)}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <div className="pl-14 space-y-3">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-gray-700">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Contact Information */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-white rounded-lg shadow-sm p-6 inline-block">
              <p className="text-gray-900 mb-1">FixPoint Technologies Pvt. Ltd.</p>
              <p className="text-gray-900 mb-1">Legal Department</p>
              <p className="text-gray-900 mb-1">123 Tech Park, Electronic City</p>
              <p className="text-gray-900 mb-1">Bengaluru, Karnataka 560100</p>
              <p className="text-gray-900 mb-4">India</p>
              <p className="text-gray-900">
                <a href="mailto:legal@fixpoint.co.in" className="text-primary hover:underline">
                  legal@fixpoint.co.in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;