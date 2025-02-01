import { Survey, Finding, Valuation, SurveySection } from '../../types/survey';
import { supabase } from '../supabase';
import { notificationService } from '../notifications';
import { performanceMonitor } from '../performance';

/**
 * Creates a new survey
 */
export async function createSurvey(data: Partial<Survey>) {
  try {
    performanceMonitor.startMetric('create_survey');

    const { data: survey, error } = await supabase
      .from('surveys')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('create_survey');
    return survey;
  } catch (error) {
    performanceMonitor.endMetric('create_survey', { error: true });
    throw error;
  }
}

/**
 * Updates an existing survey
 */
export async function updateSurvey(id: string, data: Partial<Survey>) {
  try {
    performanceMonitor.startMetric('update_survey');

    const { data: survey, error } = await supabase
      .from('surveys')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('update_survey');
    return survey;
  } catch (error) {
    performanceMonitor.endMetric('update_survey', { error: true });
    throw error;
  }
}

/**
 * Fetches a survey by ID
 */
export async function getSurvey(id: string) {
  try {
    performanceMonitor.startMetric('get_survey');

    const { data: survey, error } = await supabase
      .from('surveys')
      .select(`
        *,
        findings (*),
        valuations (*),
        survey_photos (*),
        survey_sections (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('get_survey');
    return survey;
  } catch (error) {
    performanceMonitor.endMetric('get_survey', { error: true });
    throw error;
  }
}

/**
 * Fetches all surveys for the current user
 */
export async function getSurveys() {
  try {
    performanceMonitor.startMetric('get_surveys');

    const { data: surveys, error } = await supabase
      .from('surveys')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    performanceMonitor.endMetric('get_surveys');
    return surveys;
  } catch (error) {
    performanceMonitor.endMetric('get_surveys', { error: true });
    throw error;
  }
}

/**
 * Adds a finding to a survey
 */
export async function addFinding(finding: Omit<Finding, 'id' | 'created_at' | 'updated_at'>) {
  try {
    performanceMonitor.startMetric('add_finding');

    const { data, error } = await supabase
      .from('findings')
      .insert([finding])
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('add_finding');
    return data;
  } catch (error) {
    performanceMonitor.endMetric('add_finding', { error: true });
    throw error;
  }
}

/**
 * Updates a finding
 */
export async function updateFinding(id: string, data: Partial<Finding>) {
  try {
    performanceMonitor.startMetric('update_finding');

    const { data: finding, error } = await supabase
      .from('findings')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('update_finding');
    return finding;
  } catch (error) {
    performanceMonitor.endMetric('update_finding', { error: true });
    throw error;
  }
}

/**
 * Deletes a finding
 */
export async function deleteFinding(id: string) {
  try {
    performanceMonitor.startMetric('delete_finding');

    const { error } = await supabase
      .from('findings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    performanceMonitor.endMetric('delete_finding');
  } catch (error) {
    performanceMonitor.endMetric('delete_finding', { error: true });
    throw error;
  }
}

/**
 * Updates or creates a valuation for a survey
 */
export async function saveValuation(valuation: Omit<Valuation, 'id' | 'created_at' | 'updated_at'>) {
  try {
    performanceMonitor.startMetric('save_valuation');

    const { data, error } = await supabase
      .from('valuations')
      .upsert([valuation], {
        onConflict: 'survey_id'
      })
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('save_valuation');
    return data;
  } catch (error) {
    performanceMonitor.endMetric('save_valuation', { error: true });
    throw error;
  }
}

/**
 * Updates a survey section's completion status
 */
export async function updateSectionStatus(
  surveyId: string,
  sectionName: string,
  isComplete: boolean,
  sectionData?: Record<string, any>
) {
  try {
    performanceMonitor.startMetric('update_section_status');

    const { data, error } = await supabase
      .from('survey_sections')
      .upsert([{
        survey_id: surveyId,
        section_name: sectionName,
        is_complete: isComplete,
        completed_at: isComplete ? new Date().toISOString() : null,
        data: sectionData || {}
      }], {
        onConflict: 'survey_id,section_name'
      })
      .select()
      .single();

    if (error) throw error;

    performanceMonitor.endMetric('update_section_status');
    return data;
  } catch (error) {
    performanceMonitor.endMetric('update_section_status', { error: true });
    throw error;
  }
}

/**
 * Uploads a photo for a survey
 */
export async function uploadSurveyPhoto(
  surveyId: string,
  file: File,
  section: string,
  caption?: string
) {
  try {
    performanceMonitor.startMetric('upload_survey_photo');

    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${surveyId}/${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('survey-photos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('survey-photos')
      .getPublicUrl(fileName);

    // Create photo record
    const { data: photo, error: dbError } = await supabase
      .from('survey_photos')
      .insert([{
        survey_id: surveyId,
        section,
        storage_path: fileName,
        caption,
        taken_at: new Date(file.lastModified).toISOString()
      }])
      .select()
      .single();

    if (dbError) throw dbError;

    performanceMonitor.endMetric('upload_survey_photo');
    return { ...photo, url: publicUrl };
  } catch (error) {
    performanceMonitor.endMetric('upload_survey_photo', { error: true });
    throw error;
  }
}

/**
 * Deletes a survey photo
 */
export async function deleteSurveyPhoto(id: string, storagePath: string) {
  try {
    performanceMonitor.startMetric('delete_survey_photo');

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('survey-photos')
      .remove([storagePath]);

    if (storageError) throw storageError;

    // Delete record
    const { error: dbError } = await supabase
      .from('survey_photos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    performanceMonitor.endMetric('delete_survey_photo');
  } catch (error) {
    performanceMonitor.endMetric('delete_survey_photo', { error: true });
    throw error;
  }
}