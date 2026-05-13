import { Router } from 'express';
import invoiceRoutes from './invoiceRoutes';
import customerRoutes from './customerRoutes';
import userRoutes from '../routes/userRoutes'

const router = Router();

router.use('/invoices', invoiceRoutes);
router.use('/customers', customerRoutes); 
router.use('/users', userRoutes);
export default router;