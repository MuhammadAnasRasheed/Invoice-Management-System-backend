import { z } from 'zod';

// Create shop validation schema
export const createShopSchema = z.object({
  name: z.string().min(2, 'Shop name must be at least 2 characters').max(150, 'Shop name cannot exceed 150 characters'),
  address: z.string().min(3, 'Address must be at least 3 characters').max(255, 'Address cannot exceed 255 characters'),
  city: z.string().min(2, 'City must be at least 2 characters').max(100, 'City cannot exceed 100 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters').max(100, 'Country cannot exceed 100 characters'),
});

// Update shop validation schema
export const updateShopSchema = z.object({
  name: z.string().min(2).max(150).optional(),
  address: z.string().min(3).max(255).optional(),
  city: z.string().min(2).max(100).optional(),
  country: z.string().min(2).max(100).optional(),
});

// Validate create shop
export const validateCreateShop = (data: any) => {
  try {
    const validated = createShopSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};

// Validate update shop
export const validateUpdateShop = (data: any) => {
  try {
    const validated = updateShopSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};

