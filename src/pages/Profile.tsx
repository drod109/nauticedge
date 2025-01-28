import React, { useState, useEffect, useCallback } from 'react';
import { Pencil, Mail, Phone, Globe, User2, Building2, CreditCard as BillingIcon, Check, X, BadgeCheck } from 'lucide-react';
import { Theme, getInitialTheme, setTheme } from '../lib/theme';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import ProfilePhoto from '../components/profile/ProfilePhoto.tsx';
import { supabase } from '../lib/supabase';
import ActiveSessions from '../components/profile/ActiveSessions';
import BillingSection from '../components/profile/BillingSection';
import CompanySection from '../components/profile/CompanySection';
import type { UserSession } from '../types/auth';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const Profile = () => {
  const [theme, setCurrentTheme] = useState<Theme>(getInitialTheme());

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setCurrentTheme(newTheme);
  };

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
    first_name: '',
    last_name: '',
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

  const handlePlanChange = async (newPlan: string) => {
    try {
      setCurrentPlan(newPlan);
      // Additional logic for handling plan change success
    } catch (error) {
      console.error('Error updating plan:', error);
      setError('Failed to update subscription plan');
    }
  };
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handlePhotoUpdate = (url: string) => {
    setUserData(prev => ({
      ...prev,
      photo_url: url,
      avatar_url: url // Keep both fields in sync
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
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          full_name: `${editForm.first_name} ${editForm.last_name}`.trim(),
          phone: editForm.phone,
          location: editForm.location,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

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
      onPlanChange={handlePlanChange}
      onAddPaymentMethod={() => setIsPaymentModalOpen(true)}
    />
  );

  const renderCompanyContent = () => (
    <CompanySection
      isEditing={isEditingCompany}
      editForm={editForm}
      userData={userData}
      error={error}
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // Update userData state with all profile data
        setUserData({
          ...user,
          ...profile,
          email: user.email,
          photo_url: profile?.avatar_url || null,
          company_name: profile?.company_name || '',
          company_position: profile?.company_position || '',
          registration_number: profile?.registration_number || '',
          tax_id: profile?.tax_id || '',
          company_address_line1: profile?.company_address_line1 || '',
          company_address_line2: profile?.company_address_line2 || '',
          company_city: profile?.company_city || '',
          company_state: profile?.company_state || '',
          company_postal_code: profile?.company_postal_code || '',
          company_country: profile?.company_country || ''
        });
        
        // Update editForm state with all profile data
        setEditForm({
          email: user.email,
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          phone: profile?.phone || '',
          location: profile?.location || '',
          company_name: profile?.company_name || '',
          company_position: profile?.company_position || '',
          registration_number: profile?.registration_number || '',
          tax_id: profile?.tax_id || '',
          company_address_line1: profile?.company_address_line1 || '',
          company_address_line2: profile?.company_address_line2 || '',
          company_city: profile?.company_city || '',
          company_state: profile?.company_state || '',
          company_postal_code: profile?.company_postal_code || '',
          company_country: profile?.company_country || ''
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

  const handleEditPersonalInfo = () => {
    // Initialize form with current user data
    setEditForm(prev => ({
      ...prev,
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      location: userData?.location || ''
    }));
    setIsEditing(true);
  };

  const renderPersonalContent = () => (
    <div className="p-8">
      {/* Personal Information */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
          {!isEditing ? (
            <button 
              onClick={handleEditPersonalInfo}
              className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
            >
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="flex items-center text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
              >
                <Check className="h-4 w-4 mr-1" />
                Save
              </button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
              <div className="relative mt-1">
                <BadgeCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={isEditing ? editForm.first_name : (userData?.first_name || '')}
                  onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                  className={`block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                    isEditing 
                      ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                  } text-gray-900 dark:text-white transition-colors`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
              <div className="relative mt-1">
                <User2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={isEditing ? editForm.last_name : (userData?.last_name || '')}
                  onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                  className={`block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                    isEditing 
                      ? 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                      : 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed'
                  } text-gray-900 dark:text-white transition-colors`}
                  readOnly={!isEditing}
                />
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="email"
                value={userData?.email || ''}
                className="block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-dark-700 text-gray-900 dark:text-white cursor-not-allowed"
                readOnly
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                value={isEditing ? editForm.phone : (userData?.phone || 'Not set')}
                onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className={`block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg ${
                  !isEditing 
                    ? 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed' 
                    : 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                } text-gray-900 dark:text-white transition-colors`}
                readOnly={!isEditing}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <div className="flex w-full">
                <input
                  type="text"
                  value={isEditing ? editForm.location : (userData?.location || 'Not set')}
                  onChange={(e) => isEditing && setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className={`block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-l-lg ${
                    !isEditing 
                      ? 'bg-gray-50 dark:bg-dark-700 cursor-not-allowed' 
                      : 'bg-white dark:bg-dark-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  } text-gray-900 dark:text-white transition-colors`}
                  readOnly={!isEditing}
                />
                {isEditing && (
                  <button
                    onClick={detectLocation}
                    disabled={isLoadingLocation}
                    className="px-4 py-2 bg-gray-100/50 dark:bg-dark-700/50 backdrop-blur-sm border border-l-0 border-gray-300 dark:border-dark-600 rounded-r-lg hover:bg-gray-200 dark:hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-gray-700 dark:text-gray-300 transition-all duration-300"
                  >
                    {isLoadingLocation ? (
                      <div className="h-5 w-5 border-2 border-gray-400 dark:border-gray-500 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                    ) : (
                      'Detect'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ActiveSessions
        sessions={sessions}
        currentSessionId={currentSessionId}
        onLogoutSession={handleLogoutSession}
      />
    </div>
  );

  return (
    <ProtectedRoute>
    <div className="flex h-screen bg-gray-50 dark:bg-dark-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header theme={theme} onThemeChange={handleThemeChange} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-900">
          <div className="max-w-full mx-auto w-full py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
            <div className="bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-dark-700/50 hover:shadow-xl transition-all duration-300">
              {/* Profile Header */}
              <div className="relative px-4 sm:px-8 pt-6 sm:pt-8 pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end border-b border-gray-200/50 dark:border-dark-700/50">
                <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4">
                  <ProfilePhoto
                    userId={userData?.id}
                    photoUrl={userData?.photo_url}
                    fullName={userData?.full_name || ''}
                    onPhotoUpdate={handlePhotoUpdate}
                    editable={true}
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient">{userData?.full_name || 'Loading...'}</h1>
                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                      {userData?.email || ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-800/90 backdrop-blur-sm px-4 sm:px-8 pt-4 sm:pt-6 border-b border-gray-200/50 dark:border-dark-700/50 overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 sm:space-x-8 min-w-max">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'personal'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <User2 className="h-4 w-4" />
                    <span>Personal</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('billing')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'billing'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <BillingIcon className="h-4 w-4" />
                    <span>Billing</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('company')}
                    className={`pb-4 text-sm font-medium flex items-center space-x-2 ${
                      activeTab === 'company'
                        ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Building2 className="h-4 w-4" />
                    <span>Company</span>
                  </button>
                </div>
              </div>

              {/* Content Area */}
              <div className="relative">
              {isLoading ? (
                <div className="p-8 flex flex-col items-center justify-center space-y-4">
                  <div className="relative">
                    <div className="h-12 w-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-dark-800/90 animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading profile data...</p>
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
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
};

export default Profile;