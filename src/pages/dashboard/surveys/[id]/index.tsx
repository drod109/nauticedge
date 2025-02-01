import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Survey } from '../../../../types/survey';
import { Alert } from '../../../../components/ui/Alert';
import { Card } from '../../../../components/ui/Card';
import { format } from 'date-fns';

const ViewSurveyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchSurvey();
  }, [id]);

  const fetchSurvey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Survey not found');

      setSurvey(data);
    } catch (err) {
      console.error('Error fetching survey:', err);
      setError(err instanceof Error ? err.message : 'Failed to load survey');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!survey || !confirm('Are you sure you want to delete this survey?')) return;

    try {
      const { error } = await supabase
        .from('surveys')
        .delete()
        .eq('id', survey.id);

      if (error) throw error;

      navigate('/dashboard/surveys');
    } catch (err) {
      console.error('Error deleting survey:', err);
      setError('Failed to delete survey');
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/surveys')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {survey?.title || 'Loading...'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Report Number: {survey?.report_number}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/dashboard/surveys/${survey?.id}/edit`)}
            className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {error && (
        <Alert
          variant="error"
          title="Error"
          message={error}
          closeable
          onClose={() => setError(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : survey ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Survey Details */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Survey Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {survey.type.charAt(0).toUpperCase() + survey.type.slice(1)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    survey.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : survey.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {survey.status.charAt(0).toUpperCase() + survey.status.slice(1)}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {format(new Date(survey.survey_date), 'MMMM d, yyyy')}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.location}</dd>
              </div>
              {survey.weather_conditions && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Weather Conditions</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.weather_conditions}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Vessel Details */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Vessel Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.vessel_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Make & Model</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                  {survey.vessel_make} {survey.vessel_model}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Year</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.vessel_year}</dd>
              </div>
              {survey.vessel_hin && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">HIN</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.vessel_hin}</dd>
                </div>
              )}
              {survey.vessel_registration && (
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Registration</dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">{survey.vessel_registration}</dd>
                </div>
              )}
            </dl>
          </Card>

          {/* Survey Scope */}
          <Card className="p-6 md:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Survey Scope</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{survey.scope}</p>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">Survey not found</p>
        </div>
      )}
    </div>
  );
};

export default ViewSurveyPage;