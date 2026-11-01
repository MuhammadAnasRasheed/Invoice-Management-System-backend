import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/InvoiceService';
import { InvoiceStatus } from '../entities/Invoice';
import { validateCreateInvoice } from '../validators/invoiceValidator';
import { AuthRequest } from '../middleware/auth';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor(invoiceService?: InvoiceService) {
    this.invoiceService = invoiceService || new InvoiceService();
  }

  createInvoice = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const validation = validateCreateInvoice(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const invoice = await this.invoiceService.createInvoice({
        ...validation.data!,
        userId: req.user.id
      });

      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  getAllInvoices = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Not authenticated' });
        return;
      }

      const search = req.query.search as string;
      const shopId = req.query.shopId as string;

      const invoices = await this.invoiceService.getAllInvoices(req.user.id, search, shopId);

      res.status(200).json({
        success: true,
        data: invoices
      });
    } catch (error) {
      next(error);
    }
  };

  getInvoicesByCustomer = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
      }

      const customerId = req.params.customerId as string;
      const invoices = await this.invoiceService.getInvoicesByCustomer(customerId, req.user.id);

      res.json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  };

  getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const invoice = await this.invoiceService.getInvoiceById(id);
      if (!invoice) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (!Object.values(InvoiceStatus).includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const id = req.params.id as string;
      const invoice = await this.invoiceService.updateInvoiceStatus(id, status);
      res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const deleted = await this.invoiceService.deleteInvoice(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}
