export type SurveyType = 'condition' | 'pre-purchase' | 'insurance' | 'damage' | 'annual';
export type SurveyStatus = 'draft' | 'in_progress' | 'completed' | 'archived';
export type FindingCategory = 'structural' | 'mechanical' | 'electrical' | 'plumbing' | 'safety' | 'cosmetic' | 'other';
export type FindingPriority = 'high' | 'medium' | 'low';

export interface Survey {
  id: string;
  user_id: string;
  client_id?: string;
  title: string;
  type: SurveyType;
  vessel_name: string;
  vessel_make: string;
  vessel_model: string;
  vessel_year: number;
  vessel_hin?: string;
  vessel_registration?: string;
  survey_date: string;
  location: string;
  weather_conditions?: string;
  scope: string;
  status: SurveyStatus;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  report_number: string;
}

export interface Finding {
  id?: string;
  survey_id: string;
  category: FindingCategory;
  description: string;
  recommendation: string;
  priority: FindingPriority;
  photos?: string[];
  cost_estimate?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ComparableVessel {
  name: string;
  year: number;
  price: number;
  location: string;
  url?: string;
}

export interface ValuationAdjustment {
  factor: string;
  amount: number;
  description: string;
}

export interface Valuation {
  id?: string;
  survey_id: string;
  market_value_low: number;
  market_value_high: number;
  comparable_vessels: ComparableVessel[];
  adjustments: ValuationAdjustment[];
  created_at?: string;
  updated_at?: string;
}

export interface SurveyPhoto {
  id: string;
  survey_id: string;
  section: string;
  storage_path: string;
  caption?: string;
  taken_at?: string;
  uploaded_at: string;
  metadata?: Record<string, any>;
}

export interface SurveySection {
  id: string;
  survey_id: string;
  section_name: string;
  is_complete: boolean;
  completed_at?: string;
  last_edited_at: string;
  data: Record<string, any>;
}