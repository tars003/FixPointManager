import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { 
  User, 
  Droplet, 
  AlertCircle, 
  Activity, 
  Phone, 
  Building, 
  Shield, 
  Edit, 
  Save,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Interface matching the database schema
interface EmergencyContactType {
  name: string;
  relation: string;
  phone: string;
}

interface EmergencyProfileType {
  id?: number;
  userId: number;
  fullName: string;
  bloodType: string | null;
  allergies: string[] | null;
  medicalConditions: string[] | null;
  primaryEmergencyContact: {
    name: string;
    relation: string;
    phone: string;
    email?: string;
  };
  secondaryEmergencyContacts: EmergencyContactType[];
  preferredHospital: string | null;
  insuranceDetails: {
    provider: string;
    policyNumber: string;
    contactNumber: string;
  };
  organDonor: boolean;
}

interface EmergencyProfileProps {
  userId: number;
  theme: 'light' | 'dark';
  onBack: () => void;
}

// Default empty profile for new users
const defaultProfile: EmergencyProfileType = {
  userId: 1, // Will be replaced with actual user ID
  fullName: '',
  bloodType: null,
  allergies: null,
  medicalConditions: null,
  primaryEmergencyContact: {
    name: '',
    relation: '',
    phone: ''
  },
  secondaryEmergencyContacts: [],
  preferredHospital: null,
  insuranceDetails: {
    provider: '',
    policyNumber: '',
    contactNumber: ''
  },
  organDonor: false
};

export default function EmergencyProfile({
  userId,
  theme,
  onBack
}: EmergencyProfileProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EmergencyProfileType | null>(null);
  
  // Fetch user's emergency profile
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: [`/api/emergency-profiles/user/${userId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/emergency-profiles/user/${userId}`);
        if (res.status === 404) {
          return null; // User doesn't have a profile yet
        }
        if (!res.ok) throw new Error('Failed to fetch emergency profile');
        return await res.json();
      } catch (err) {
        console.error('Error fetching emergency profile:', err);
        return null;
      }
    }
  });
  
  // Initialize edited profile when data is loaded
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    } else if (!isLoading && !error) {
      // Create a new default profile with the correct user ID
      setEditedProfile({
        ...defaultProfile,
        userId
      });
    }
  }, [profile, isLoading, error, userId]);
  
  // Create a new profile
  const createProfileMutation = useMutation({
    mutationFn: async (newProfile: EmergencyProfileType) => {
      const res = await apiRequest('POST', '/api/emergency-profiles', newProfile);
      if (!res.ok) throw new Error('Failed to create emergency profile');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/emergency-profiles/user/${userId}`], data);
      toast({
        title: "Profile Created",
        description: "Your emergency profile has been created successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create profile: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  // Update an existing profile
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: EmergencyProfileType) => {
      const res = await apiRequest('PUT', `/api/emergency-profiles/${updatedProfile.id}`, updatedProfile);
      if (!res.ok) throw new Error('Failed to update emergency profile');
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/emergency-profiles/user/${userId}`], data);
      toast({
        title: "Profile Updated",
        description: "Your emergency profile has been updated successfully.",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update profile: ${error.message}`,
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    if (!editedProfile) return;
    
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  const handleInsuranceChange = (field: string, value: string) => {
    if (!editedProfile) return;
    
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        insuranceDetails: {
          ...prev.insuranceDetails,
          [field]: value
        }
      };
    });
  };
  
  const handlePrimaryContactChange = (field: string, value: string) => {
    if (!editedProfile) return;
    
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        primaryEmergencyContact: {
          ...prev.primaryEmergencyContact,
          [field]: value
        }
      };
    });
  };
  
  const handleSecondaryContactChange = (index: number, field: string, value: string) => {
    if (!editedProfile) return;
    
    const updatedContacts = [...editedProfile.secondaryEmergencyContacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      [field]: value
    };
    
    setEditedProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        secondaryEmergencyContacts: updatedContacts
      };
    });
  };
  
  const saveChanges = () => {
    if (!editedProfile) return;
    
    if (editedProfile.id) {
      updateProfileMutation.mutate(editedProfile);
    } else {
      createProfileMutation.mutate(editedProfile);
    }
  };
  
  const cancelEditing = () => {
    setEditedProfile(profile || {...defaultProfile, userId});
    setIsEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
          <User className="inline-block h-6 w-6 mr-2" />
          Emergency Profile
        </h2>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
            className={theme === 'light' ? 'border-blue-200 text-blue-600' : 'border-blue-800 text-blue-400'}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={cancelEditing}
              className={theme === 'light' ? 'border-gray-200' : 'border-gray-700'}
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={saveChanges}
              className={theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-700 hover:bg-green-800'}
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>
      
      <p className={`${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
        This information will be available to emergency responders if needed. 
        Keep it updated for your safety.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info */}
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border-gray-700'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <User className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    value={editedProfile.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Input 
                    id="bloodType"
                    value={editedProfile.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input 
                    id="allergies"
                    value={editedProfile.allergies}
                    onChange={(e) => handleInputChange('allergies', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
                <div>
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Input 
                    id="medicalConditions"
                    value={editedProfile.medicalConditions}
                    onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ProfileField 
                  icon={<User className="h-4 w-4" />} 
                  label="Name" 
                  value={profile.name}
                  theme={theme}
                />
                <ProfileField 
                  icon={<Droplet className="h-4 w-4" />} 
                  label="Blood Type" 
                  value={profile.bloodType}
                  theme={theme}
                  highlight={true}
                />
                <ProfileField 
                  icon={<AlertCircle className="h-4 w-4" />} 
                  label="Allergies" 
                  value={profile.allergies}
                  theme={theme}
                  highlight={profile.allergies !== 'None'}
                />
                <ProfileField 
                  icon={<Activity className="h-4 w-4" />} 
                  label="Medical Conditions" 
                  value={profile.medicalConditions}
                  theme={theme}
                  highlight={profile.medicalConditions !== 'None'}
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Emergency Contacts */}
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border-gray-700'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Phone className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`} />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {editedProfile.emergencyContacts.map((contact, index) => (
                  <div key={index} className="space-y-2 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                    <div>
                      <Label htmlFor={`contact-name-${index}`}>Contact Name</Label>
                      <Input 
                        id={`contact-name-${index}`}
                        value={contact.name}
                        onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                        className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`contact-relation-${index}`}>Relation</Label>
                      <Input 
                        id={`contact-relation-${index}`}
                        value={contact.relation}
                        onChange={(e) => handleContactChange(index, 'relation', e.target.value)}
                        className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`contact-phone-${index}`}>Phone Number</Label>
                      <Input 
                        id={`contact-phone-${index}`}
                        value={contact.phone}
                        onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                        className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {profile.emergencyContacts.map((contact, index) => (
                  <div key={index} className={`p-3 rounded-lg ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-700/50'} mb-2 last:mb-0`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className={`font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                          {contact.name}
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                          {contact.relation}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={`h-8 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-600'}`}
                        onClick={() => window.open(`tel:${contact.phone.replace(/\s/g, '')}`, '_self')}
                      >
                        <Phone className={`h-4 w-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                      </Button>
                    </div>
                    <p className={`text-sm font-medium mt-1 ${theme === 'light' ? 'text-blue-600' : 'text-blue-400'}`}>
                      {contact.phone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Healthcare Info */}
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border-gray-700'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-purple-600' : 'text-purple-400'}`} />
              Healthcare Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="preferredHospital">Preferred Hospital</Label>
                  <Input 
                    id="preferredHospital"
                    value={editedProfile.preferredHospital}
                    onChange={(e) => handleInputChange('preferredHospital', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${theme === 'light' ? 'bg-purple-50' : 'bg-purple-900/20'}`}>
                  <p className={`text-sm font-medium ${theme === 'light' ? 'text-purple-700' : 'text-purple-300'}`}>
                    Preferred Hospital
                  </p>
                  <p className={`${theme === 'light' ? 'text-purple-800' : 'text-purple-200'}`}>
                    {profile.preferredHospital}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Insurance Info */}
        <Card className={theme === 'light' ? 'bg-white' : 'bg-gray-800/80 border-gray-700'}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Shield className={`h-5 w-5 mr-2 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
              Insurance Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input 
                    id="insuranceProvider"
                    value={editedProfile.insurance.provider}
                    onChange={(e) => handleInsuranceChange('provider', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
                <div>
                  <Label htmlFor="policyNumber">Policy Number</Label>
                  <Input 
                    id="policyNumber"
                    value={editedProfile.insurance.policyNumber}
                    onChange={(e) => handleInsuranceChange('policyNumber', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceContact">Insurance Contact</Label>
                  <Input 
                    id="insuranceContact"
                    value={editedProfile.insurance.contactNumber}
                    onChange={(e) => handleInsuranceChange('contactNumber', e.target.value)}
                    className={theme === 'light' ? 'border-gray-200' : 'bg-gray-700 border-gray-600'}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <ProfileField 
                  icon={<Shield className="h-4 w-4" />} 
                  label="Provider" 
                  value={profile.insurance.provider}
                  theme={theme}
                />
                <ProfileField 
                  icon={<Activity className="h-4 w-4" />} 
                  label="Policy Number" 
                  value={profile.insurance.policyNumber}
                  theme={theme}
                />
                <div className="flex justify-between items-center">
                  <ProfileField 
                    icon={<Phone className="h-4 w-4" />} 
                    label="Contact" 
                    value={profile.insurance.contactNumber}
                    theme={theme}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-8 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700'}`}
                    onClick={() => window.open(`tel:${profile.insurance.contactNumber.replace(/\s/g, '')}`, '_self')}
                  >
                    <Phone className={`h-4 w-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`} />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button variant="outline" onClick={onBack}>
          Back to Emergency
        </Button>
      </div>
    </motion.div>
  );
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  theme: 'light' | 'dark';
  highlight?: boolean;
}

function ProfileField({ icon, label, value, theme, highlight = false }: ProfileFieldProps) {
  return (
    <div className={`flex items-start space-x-2 ${highlight ? `p-2 rounded-md ${theme === 'light' ? 'bg-amber-50' : 'bg-amber-900/20'}` : ''}`}>
      <div className={`mt-0.5 ${theme === 'light' ? (highlight ? 'text-amber-600' : 'text-gray-500') : (highlight ? 'text-amber-400' : 'text-gray-400')}`}>
        {icon}
      </div>
      <div>
        <p className={`text-xs ${theme === 'light' ? (highlight ? 'text-amber-600' : 'text-gray-500') : (highlight ? 'text-amber-400' : 'text-gray-400')}`}>
          {label}
        </p>
        <p className={`${theme === 'light' ? (highlight ? 'text-amber-800 font-medium' : 'text-gray-700') : (highlight ? 'text-amber-300 font-medium' : 'text-gray-200')}`}>
          {value}
        </p>
      </div>
    </div>
  );
}