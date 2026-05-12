import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const invoiceController = new InvoiceController();

router.post('/',authMiddleware, invoiceController.createInvoice);
router.get('/', authMiddleware,invoiceController.getAllInvoices);
router.get('/:id', authMiddleware, invoiceController.getInvoiceById);
router.patch('/:id/status', authMiddleware, invoiceController.updateInvoiceStatus);
router.delete('/:id', authMiddleware, invoiceController.deleteInvoice);

export default router;