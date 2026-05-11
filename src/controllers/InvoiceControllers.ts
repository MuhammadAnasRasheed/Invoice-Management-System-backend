import { Request, Response, NextFunction } from 'express';
import { InvoiceService } from '../services/InvoiceService';
import { InvoiceStatus } from '../entities/Invoice';
import { validateCreateInvoice } from '../validators/invoiceValidator';

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor(invoiceService?: InvoiceService) {
    this.invoiceService = invoiceService || new InvoiceService();
  }

  createInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateCreateInvoice(req.body);
      if (!validation.isValid) {
        return res.status(400).json({ errors: validation.errors });
      }

      const invoice = await this.invoiceService.createInvoice({
        ...req.body,
        userId: req.user?.id // Assuming auth middleware sets req.user
      });
      
      res.status(201).json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  getAllInvoices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoices = await this.invoiceService.getAllInvoices();
      res.json({ success: true, data: invoices });
    } catch (error) {
      next(error);
    }
  };

  getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invoice = await this.invoiceService.getInvoiceById(req.params.id as string);
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
      
      const invoice = await this.invoiceService.updateInvoiceStatus(req.params.id as string, status);
      res.json({ success: true, data: invoice });
    } catch (error) {
      next(error);
    }
  };

  deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await this.invoiceService.deleteInvoice(req.params.id as string);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Invoice not found' });
      }
      res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
      next(error);
    }
  };
}