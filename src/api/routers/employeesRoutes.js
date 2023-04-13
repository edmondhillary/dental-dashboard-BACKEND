import express from 'express';
import * as employeeController from '../controllers/employeeController.js';

const router = express.Router();

// router.post('/', employeeController.createEmployee); // register a new employee funciona a taves de register//

router.get('/', employeeController.getAll);
router.get('/:employeeName', employeeController.getEmployeeByName);
router.get('/id/:_id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployeeById);
router.delete('id/:id', employeeController.deleteEmployeeById);

export default router;
