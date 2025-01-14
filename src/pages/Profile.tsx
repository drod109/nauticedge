import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Mail, Phone, Globe, User2, Building2, CreditCard as BillingIcon, Check } from 'lucide-react';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ProfilePhoto from '../components/profile/ProfilePhoto.tsx';
import { supabase } from '../lib/supabase';
import ActiveSessions from '../components/profile/ActiveSessions';
import BillingSection from '../components/profile/BillingSection';
import CompanySection from '../components/profile/CompanySection';
import PersonalInfoModal from '../components/profile/PersonalInfoModal';
import type { UserSession } from '../types/auth';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [editForm, setEditForm] = useState({
    email: '',
    phone: '',
    location: '',
    company_name: '',
    company_position: '',
    registration_number: '',
    tax_id: '',
    company_address_line1: '',
    company_address_line2: '',
    company_city: '',
    company_state: '',
    company_postal_code: '',
    company_country: ''
  });
  const [userData, setUserData] = useState<{
    id: string;
    email: string;
    full_name: string;
    photo_url: string | null;
    phone: string;
    location: string;
    company_name: string;
    company_position: string;
    registration_number: string;
    tax_id: string;
  } | null>(null);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>('basic');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePhotoUpdate = (url: string) => {
    setUserData(prev => ({
      ...prev,
      photo_url: url
    }));
  };

  const handleCompanyEditSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      const { error: updateError } = await supabase
        .from('users_metadata')
        .update({
          company_name: editForm.company_name,
          company_position: editForm.company_position,
          registration_number: editForm.registration_number,
          tax_id: editForm.tax_id,
          tax_id: editForm.tax_id,
          company_address_line1: editForm.company_address_line1,
          company_address_line2: editForm.company_address_line2,
          company_city: editForm.company_city,
          company_state: editForm.company_state,
          company_postal_code: editForm.company_postal_code,
          company_country: editForm.company_country
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Update local state
      setUserData(prev => ({
        ...prev,
        company_name: editForm.company_name,
        company_position: editForm.company_position,
        registration_number: editForm.registration_number,
        tax_id: editForm.tax_id,
        company_address_line1: editForm.company_address_line1,
        company_address_line2: editForm.company_address_line2,
        company_city: editForm.company_city,
        company_state: editForm.company_state,
        company_postal_code: editForm.company_postal_code,
        company_country: editForm.company_country
      }));

      setIsEditingCompany(false);
    } catch (err) {
      console.error('Error updating company information:', err);
      setError(err instanceof Error ? err.message : 'Failed to update company information');
    }
  };

  const fetchSessions = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: sessionsData, error: sessionsError } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      setSessions(sessionsData || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load session information');
    }
  }, []);

  const handleEditSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error('User ID not found');
      }

      // First check if metadata exists
      const { data: existingMetadata } = await supabase
        .from('users_metadata')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If metadata doesn't exist, create it first
      if (!existingMetadata) {
        const { error: insertError } = await supabase
          .from('users_metadata')
          .insert({
            user_id: user.id,
            phone: editForm.phone,
            location: editForm.location,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) throw insertError;
      } else {
        // If metadata exists, update it
        const { error: updateError } = await supabase
          .from('users_metadata')
          .update({
            phone: editForm.phone,
            location: editForm.location,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      }

      // Refresh user data after update
      await fetchUserData();
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const detectLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`
          );
          const data = await response.json();
          if (data.results && data.results[0]) {
            const locationString = data.results[0].formatted;
            setEditForm(prev => ({ ...prev, location: locationString }));
          }
        } catch (error) {
          console.error('Error fetching location details:', error);
        } finally {
          setIsLoadingLocation(false);
        }
      }, (error) => {
        console.error('Error getting location:', error);
        setIsLoadingLocation(false);
      });
    }
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ 
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Refresh sessions list
      await fetchSessions();
    } catch (err) {
      console.error('Error logging out session:', err);
      setError('Failed to end session');
    }
  };

  const renderBillingContent = () => (
    <BillingSection
      currentPlan={currentPlan}
      onAddPaymentMethod={() => setIsPaymentModalOpen(true)}
    />
  );

  const renderCompanyContent = () => (
    <CompanySection
      isEditing={isEditingCompany}
      editForm={editForm}
      userData={userData}
      onEdit={() => setIsEditingCompany(!isEditingCompany)}
      onCancel={() => setIsEditingCompany(false)}
      onSave={handleCompanyEditSubmit}
      onChange={(field, value) => setEditForm(prev => ({ ...prev, [field]: value }))}
    />
  );

  const fetchUserData = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: metadata } = await supabase
          .from('users_metadata')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setUserData({
          ...user,
          ...metadata,
          email: user.email
        });
        
        setEditForm({
          email: user.email,
          phone: metadata?.phone || '',
          location: metadata?.location || '',
          company_name: metadata?.company_name || '',
          company_position: metadata?.company_position || '',
          registration_number: metadata?.registration_number || '',
          tax_id: metadata?.tax_id || '',
          company_address_line1: metadata?.company_address_line1 || '',
          company_address_line2: metadata?.company_address_line2 || '',
          company_city: metadata?.company_city || '',
          company_state: metadata?.company_state || '',
          company_postal_code: metadata?.company_postal_code || '',
          company_country: metadata?.company_country || ''
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeProfile = async () => {
      try {
        setIsLoading(true);
        await fetchUserData();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: sessionsData } = await supabase
            .from('user_sessions')
            .select('session_id')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

          if (sessionsData && sessionsData.length > 0) {
            setCurrentSessionId(sessionsData[0].session_id);
          }
          
          await fetchSessions();
        }
      } catch (err) {
        console.error('Error initializing profile:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeProfile();
  }, [fetchUserData, fetchSessions]);

  const renderPersonalContent = () => (
    <div className="p-8">
      {/* Personal Information */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={userData?.full_name || ''}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 cursor-not-allowed"
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={userData?.email || ''}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="tel"
                value={isEditing ? editForm.phone : (userData?.phone || 'Not set')}
                onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className={`block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex w-full">
                <input
                  type="text"
                  value={isEditing ? editForm.location : (userData?.location || 'Not set')}
                  onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className={`block w-full pl-10 px-3 py-2 border border-gray-300 rounded-l-md ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                  readOnly={!isEditing}
                />
                {isEditing && (
                  <button
                    onClick={detectLocation}
                    disabled={isLoadingLocation}
                    className="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isLoadingLocation ? (
                      <div className="h-5 w-5 border-2 border-gray-400 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                      'Detect'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
      
      {/* Personal Info Modal */}
      <PersonalInfoModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        onSave={handleEditSubmit}
        editForm={editForm}
        onChange={(field, value) => setEditForm(prev => ({ ...prev, [field]: value }))}
        onDetectLocation={detectLocation}
        isLoadingLocation={isLoadingLocation}
        loading={loading}
      />

      <ActiveSessions
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLogoutSession={handleLogoutSession}
      />
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full py-8 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow">
              {/* Profile Header */}
              <div className="relative px-8 pt-8 pb-4 flex justify-between items-end border-b border-gray-200">
                <div className="flex items-end space-x-4">
                  <ProfilePhoto
                    userId={userData?.id}
                    photoUrl={userData?.photo_url}
                    fullName={userData?.full_name || ''}
                    onPhotoUpdate={handlePhotoUpdate}
                    editable={true}
                  />
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{userData?.full_name || 'Loading...'}</h1>
                    <p className="text-gray-600">{userData?.email || ''}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-8 pt-6 border-b border-gray-200">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'personal'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <User2 className="h-4 w-4" />
                    <span>Personal</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'billing'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BillingIcon className="h-4 w-4" />
                    <span>Billing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('company')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'company'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Company</span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="p-8 flex justify-center">
                  <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <>
                  {/* Tab Content */}
                  {activeTab === 'personal' && renderPersonalContent()}
                  {activeTab === 'billing' && renderBillingContent()}
                  {activeTab === 'company' && renderCompanyContent()}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;