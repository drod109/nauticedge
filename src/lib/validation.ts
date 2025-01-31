import { z } from 'zod';

// User-related schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  location: z.string().optional()
});

// Company-related schemas
export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  taxId: z.string().min(1, 'Tax ID is required'),
  addressLine1: z.string().min(1, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().optional()
});

// Invoice-related schemas
export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  rate: z.number().min(0, 'Rate must be non-negative'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  amount: z.number().min(0, 'Amount must be non-negative')
});

export const invoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid client email'),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional()
});

// Survey-related schemas
export const surveySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  vesselName: z.string().min(1, 'Vessel name is required'),
  surveyType: z.enum(['annual', 'condition', 'damage', 'pre-purchase']),
  scheduledDate: z.string().datetime(),
  location: z.string().min(1, 'Location is required')
});

// API key-related schemas
export const apiKeySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  scopes: z.array(z.string()).min(1, 'At least one scope is required'),
  expiresIn: z.number().optional()
});

// Webhook-related schemas
export const webhookSchema = z.object({
  url: z.string().url('Invalid webhook URL'),
  description: z.string().min(1, 'Description is required'),
  events: z.array(z.string()).min(1, 'At least one event is required')
});