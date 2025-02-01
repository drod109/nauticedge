export interface UserSession {
  id: string;
  session_id: string;
  ip_address: string;
  ip_address: string;
  user_agent: string;
  device_info: {
    type: string;
    browser: string;
    os: string;
  };
  location: {
    city?: string;
    country?: string;
    timezone?: string;
  };
  is_active: boolean;
  created_at: string;
  last_active_at: string;
  ended_at: string | null;
}