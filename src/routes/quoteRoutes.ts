import { Router } from 'express';
import * as quoteController from '../controllers/quoteController';
import { validateQuote } from '../middleware/validateQuote';

const router = Router();

router.post('/quotes', validateQuote, quoteController.createQuote);
router.get('/quotes/:id', quoteController.getQuoteById);
router.get('/quotes', quoteController.getAllQuotes);
router.post('/quotes/:id/analyze', quoteController.analyzeQuote);
router.patch('/quotes/:id/status', quoteController.updateQuoteStatus);
export default router;