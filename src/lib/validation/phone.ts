import { isValidPhoneNumber } from 'react-phone-number-input';

export function validatePhone(value: string | undefined): string | null {
  if (!value) return null;
  if (!isValidPhoneNumber(value)) return 'Enter a valid international phone number';
  return null;
}
