import { z } from 'zod';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
  unitPrice: z.number().positive('Unit price must be positive')
});

const createInvoiceSchema = z.object({
  customerId: z.union([
    z.number().int().positive('Invalid customer ID'),
    z.string().regex(/^\d+$/, 'Invalid customer ID').transform(Number)
  ]),
  shopId: z.union([
    z.number().int().positive('Invalid shop ID'),
    z.string().regex(/^\d+$/, 'Invalid shop ID').transform(Number)
  ]).optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  issueDate: z.string().transform(str => new Date(str)),
  dueDate: z.string().transform(str => new Date(str)),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  notes: z.string().optional()
});

export const validateCreateInvoice = (data: any) => {
  try {
    const validated = createInvoiceSchema.parse(data);
    return { isValid: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, data: null, errors: error.issues };
    }
    return { isValid: false, data: null, errors: [{ message: 'Validation failed' }] };
  }
};
