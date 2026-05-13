import { z } from 'zod';

// Create customer validation schema (NO password)
export const createCustomerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  gstNumber: z.string().optional(),
});

// Update customer validation schema
export const updateCustomerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  address: z.string().min(5).optional(),
  gstNumber: z.string().optional(),
});

// Validate create customer
export const validateCreateCustomer = (data: any) => {
  try {
    const validated = createCustomerSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};

// Validate update customer
export const validateUpdateCustomer = (data: any) => {
  try {
    const validated = updateCustomerSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};