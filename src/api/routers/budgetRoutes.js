import express from 'express';
import * as budgetController from '../controllers/budgetController.js';

const router = express.Router();

// Ruta para crear un presupuesto
router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgetsByQuery);
router.get('/:id', budgetController.getBudgetById);
router.put('/:id', budgetController.updateBudgetById);
router.delete('/:id', budgetController.deleteBudgetById);

export default router;
