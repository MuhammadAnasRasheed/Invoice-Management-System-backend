import { z } from 'zod';

// Registration validation schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').regex(
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/,
    'Password must contain at least 1 uppercase letter and 1 special character'
  ),
  phone: z.string().min(11, 'Phone number must be at least 11 digits').max(11),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  gstNumber: z.string().optional(),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password is required'),
});

// Validate registration
export const validateRegister = (data: any) => {
  try {
    const validated = registerSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};

// Validate login
export const validateLogin = (data: any) => {
  try {
    const validated = loginSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};