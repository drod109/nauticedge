import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export interface Survey {
  id: string;
  title: string;
  description?: string;
  vesselName: string;
  surveyType: 'annual' | 'condition' | 'damage' | 'pre-purchase';
  scheduledDate: string;
  location: string;
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
}

export interface APIResponse<T> {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

class APIClient {
  private baseUrl = '/api/v1';
  private token: string | null = null;

  constructor() {
    // Get token from Supabase session
    const session = supabase.auth.getSession();
    if (session) {
      this.setToken(session.data?.session?.access_token || null);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.setToken(session?.access_token || null);
    });
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      return {
        error: {
          message: error instanceof Error ? error.message : 'An error occurred',
        },
      };
    }
  }

  // Surveys
  async getSurveys(): Promise<APIResponse<Survey[]>> {
    return this.request<Survey[]>('/surveys');
  }

  async getSurvey(id: string): Promise<APIResponse<Survey>> {
    return this.request<Survey>(`/surveys/${id}`);
  }

  async createSurvey(data: Omit<Survey, 'id'>): Promise<APIResponse<Survey>> {
    return this.request<Survey>('/surveys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI Analysis
  async analyzeSurvey(data: {
    surveyId: string;
    content: string;
    analysisType: 'risk' | 'recommendations' | 'compliance';
  }): Promise<APIResponse<{ analysis: string }>> {
    return this.request<{ analysis: string }>('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new APIClient();