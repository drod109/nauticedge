// Local storage key for remembered email
const REMEMBERED_EMAIL_KEY = 'nauticedge_remembered_email';

// Get remembered email from localStorage
export function getRememberedEmail(): string | null {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
}

// Save email to localStorage
export function rememberEmail(email: string): void {
  localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
}

// Remove email from localStorage
export function forgetEmail(): void {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}