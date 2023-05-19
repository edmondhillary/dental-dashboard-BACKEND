import express from 'express';
import * as employeeController from '../controllers/employeeController.js';
import employeeModel from '../models/employeeSchema.js';
import { isSuperAdmin } from '../auth/auth.controller.js';
// import employeeModel from '../models/employeeSchema.js';

const router = express.Router();

router.get('/', employeeController.getAll);
router.get('/id/:_id', employeeController.getEmployeeById);
router.put('/:id', isSuperAdmin,  employeeController.updateEmployeeById);
router.delete('/id/:id', isSuperAdmin,  employeeController.deleteEmployeeById);
router.get('/info', employeeController.getUserByToken);
router.get('/busqueda', async (req, res) => {
    const { displayName } = req.query;
  
    try {
      const employees = await employeeModel.find({ displayName: { $regex: new RegExp(displayName, "i") } });
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los empleados' });
    }
  });
  
//magia//

// router.get('/info', async (req, res) => {
//     try {
//         console.log(req.userId)
//       const { populateTreatments, populateBudgets, populatePatients, populateAppointments } = req.query;
//       const user = await employeeModel.findOne({ _id: req.userId }).populate([
//         { path: 'treatments' },
//         { path: 'budgets' },
//         { path: 'patients' },
//         { path: 'appointments' }
//       ]);
//       if (!user) throw new Error('No user found.');
//       return res.json(user);
//     } catch (error) {
//       return res.status(error.status || 500).json(error.message);
//     }
//   });
  


export default router;
