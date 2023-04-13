import express from 'express';
import * as treatmentController from '../controllers/treatmentController.js';

const router = express.Router();

router.post('/', treatmentController.createTreatment);
router.get('/', treatmentController.getTreatmentsByQuery);
router.get('/:id', treatmentController.getTreatmentById);
router.put('/:id', treatmentController.updateTreatmentById);
router.delete('/:id', treatmentController.deleteTreatmentById);

export default router;
