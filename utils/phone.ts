/**
 * Formats a phone number string by:
 * 1. Removing all non-digit characters
 * 2. Adding +1 prefix if missing
 * 3. Formatting to (XXX) XXX-XXXX pattern
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  let digits = phone.replace(/\D/g, '');
  
  // If number doesn't start with 1 and is 10 digits, add 1
  if (digits.length === 10 && !digits.startsWith('1')) {
    digits = '1' + digits;
  }
  
  // If number starts with 1 but no +, add it
  if (digits.startsWith('1') && !phone.startsWith('+')) {
    digits = '+' + digits;
  }
  
  // Format the number
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // Return original input if it doesn't match expected patterns
  return phone;
};