import { z } from 'zod';

// Registration validation schema (User only)
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least 1 number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character'),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Update profile schema
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
});

// Validate registration
export const validateRegister = (data: any): {
  isValid: boolean;
  data: z.infer<typeof registerSchema> | null;
  errors: any;
} => {
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
export const validateLogin = (data: any): {
  isValid: boolean;
  data: z.infer<typeof loginSchema> | null;
  errors: any;
} => {
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

// Validate update profile
export const validateUpdateProfile = (data: any): {
  isValid: boolean;
  data: z.infer<typeof updateProfileSchema> | null;
  errors: any;
} => {
  try {
    const validated = updateProfileSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};