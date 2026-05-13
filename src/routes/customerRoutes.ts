import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const customerController = new CustomerController();

// All customer routes require authentication (user must be logged in)
router.post('/', authMiddleware, customerController.createCustomer);
router.get('/', authMiddleware, customerController.getAllCustomers);
router.get('/:id', authMiddleware, customerController.getCustomerById);
router.put('/:id', authMiddleware, customerController.updateCustomer);
router.delete('/:id', authMiddleware, customerController.deleteCustomer);

export default router;