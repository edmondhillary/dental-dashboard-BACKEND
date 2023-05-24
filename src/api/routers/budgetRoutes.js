import express from 'express';
import * as budgetController from '../controllers/budgetController.js';
import budgetModel from '../models/budgetSchema.js';
import { Types } from "mongoose";
import { isAdmin } from '../auth/auth.controller.js';
const { ObjectId } = Types;


const router = express.Router();

// Ruta para crear un presupuesto
router.post('/', budgetController.createBudget);
router.get('/', budgetController.getBudgetsByQuery);
router.get('/:id', budgetController.getBudgetById);
// router.put('/:id', budgetController.updateBudgetById);
router.delete('/:id', isAdmin, budgetController.deleteBudgetById);
//buscar presuouestos por patientId: 
router.get('/paciente/:patientId', async (req, res) => {
  const { patientId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const budgets = await budgetModel
      .find({ patient: new ObjectId(patientId) })
      .populate('treatment', '_id type')
      .populate('employee', 'firstName lastName')
      .skip(skip)
      .limit(limit);

    // Para obtener el número total de documentos (para páginas adicionales)
    const total = await budgetModel.countDocuments({ patient: new ObjectId(patientId) });

    res.status(200).json({
      totalDocuments: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      budgets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar presupuestos por paciente' });
  }
});

router.get('/empleado/:employeeId', async (req, res) => {
  const { employeeId } = req.params;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  try {
    const budgets = await budgetModel.find(
      { employee: new ObjectId(employeeId) },
      )
      .populate('treatment', '_id type ')
      .populate('patient', 'firstName lastName')
      .skip(skip)
      .limit(limit);

    // Para obtener el número total de documentos (para páginas adicionales)
    const total = await budgetModel.countDocuments({ employee: new ObjectId(employeeId) });
    

    res.status(200).json({ 
      totalDocuments: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      budgets 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al buscar presupuestos por paciente' });
  }
});

router.put('/:id',isAdmin, async (req, res) => {
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
  // Ruta para obtener los pagos mensuales
  router.get("/totales/pagos-mensuales", async (req, res) => {
    const { year } = req.query;
  
    try {
      const monthlyPayments = await budgetModel.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $year: "$createdAt" }, parseInt(year)] }
          }
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            total: { $sum: "$costWithDiscount" },
            pagado: { $sum: "$paid" }
          }
        },
        {
          $project: {
            _id: 0,
            mes: "$_id",
            total: 1,
            pagado: 1,
            pendiente: { $subtract: ["$total", "$pagado"] }
          }
        }
      ]);
  
      res.json(monthlyPayments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los pagos mensuales" });
    }
  });
  
  router.get('/patients/unpaid', async (req, res) => {
    try {
      const unpaidPatients = await budgetModel.aggregate([
        {
          $lookup: {
            from: 'patients',
            localField: 'patient',
            foreignField: '_id',
            as: 'patientInfo'
          }
        },
        {
          $addFields: {
            patientId: { $arrayElemAt: ['$patientInfo._id', 0] },
            displayName: { $arrayElemAt: ['$patientInfo.displayName', 0] },
            email: { $arrayElemAt: ['$patientInfo.email', 0] },
            phone: { $arrayElemAt: ['$patientInfo.phone', 0] },
            totalDebt: { $subtract: ['$costWithDiscount', '$paid'] }
          }
        },
        {
          $match: {
            totalDebt: { $gt: 0 }
          }
        },
        {
          $project: {
            _id: 0,
            patientId: 1,
            displayName: 1,
            email: 1,
            phone: 1,
            totalDebt: 1
          }
        }
      ]);
  
      res.json(unpaidPatients);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  
  
export default router;
