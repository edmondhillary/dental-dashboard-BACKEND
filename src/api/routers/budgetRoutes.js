import express from 'express';
import * as budgetController from '../controllers/budgetController.js';
import budgetModel from '../models/budgetSchema.js';

const router = express.Router();

// Ruta para crear un presupuesto
router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgetsByQuery);
router.get('/:id', budgetController.getBudgetById);
// router.put('/:id', budgetController.updateBudgetById);
router.delete('/:id', budgetController.deleteBudgetById);
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { discount, paid, cost } = req.body;
    
    try {
      const budget = await budgetModel.findById(id);
  
      if (!budget) {
        return res.status(404).json({ message: 'Presupuesto no encontrado' });
      }
      
      const realCost = budget.cost;
      const newDiscount = discount !== undefined ? discount : budget.discount; // usa el descuento nuevo o el antiguo
      const priceWithDiscount = realCost * (100 - newDiscount) / 100;
      const options = { new: true, runValidators: true};
      const updatedBudget = await budgetModel.findByIdAndUpdate(id, { discount: newDiscount, costWithDiscount: priceWithDiscount, paid,  cost }, options);
      
      res.status(200).json({ budget: { ...updatedBudget.toJSON(), priceWithDiscount } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el presupuesto' });
    }
  });
  
export default router;
