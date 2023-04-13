import express from 'express';
import * as patientController from '../controllers/patientController.js';

const router = express.Router();

router.post('/', patientController.createPatient);
// router.get('/', patientController.getAll);
router.get('/', patientController.getPatientsByQuery);
router.get('/:id', patientController.getPatientById);
router.put('/:id', patientController.updatePatientById);
router.delete('/:id', patientController.deletePatientById);

export default router;
