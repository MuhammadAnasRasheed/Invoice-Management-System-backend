import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceControllers';

const router = Router();
const invoiceController = new InvoiceController();

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoiceById);
router.patch('/:id/status', invoiceController.updateInvoiceStatus);
router.delete('/:id', invoiceController.deleteInvoice);

export default router;