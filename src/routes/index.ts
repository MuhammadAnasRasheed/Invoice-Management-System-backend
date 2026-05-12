import { Router } from 'express';
import invoiceRoutes from './invoiceRoutes';
import customerRoutes from './customerRoutes';

const router = Router();

router.use('/invoices', invoiceRoutes);
router.use('/customers', customerRoutes); // Authentication routes

export default router;