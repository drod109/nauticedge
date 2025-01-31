/**
 * Formats a phone number string into the format: +1 (XXX) XXX-XXXX
 * Handles partial input for a smooth user experience
 */
export const formatPhoneNumber = (input: string): string => {
  // If empty, return empty string
  if (!input) return '';

  // Remove all non-digit characters except leading +
  let digits = input.replace(/[^\d+]/g, '');

  // If no + prefix and we have digits, add +1
  if (!digits.startsWith('+') && digits.length > 0) {
    digits = '+1' + digits;
  }

  // Extract the national number (everything after +1)
  let nationalNumber = digits.startsWith('+1') ? digits.slice(2) : digits.slice(1);

  // Limit to 10 digits for national number
  nationalNumber = nationalNumber.slice(0, 10);

  // Format the number progressively
  let formatted = '';
  if (nationalNumber.length > 0) {
    formatted += '(';
    formatted += nationalNumber.slice(0, 3);
    if (nationalNumber.length > 3) {
      formatted += ') ';
      formatted += nationalNumber.slice(3, 6);
      if (nationalNumber.length > 6) {
        formatted += '-';
        formatted += nationalNumber.slice(6, 10);
      }
    }
  }

  // Add the country code prefix
  return digits.startsWith('+') ? `+1 ${formatted}` : formatted;
}