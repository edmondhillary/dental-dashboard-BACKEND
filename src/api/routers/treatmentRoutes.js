import express from 'express';
import * as treatmentController from '../controllers/treatmentController.js';
import treatmentModel from '../models/treatmentSchema.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/', treatmentController.createTreatment);
// router.get('/filtros', treatmentController.getTreatmentsByQuery);
router.get('/:id', treatmentController.getTreatmentById);
router.put('/:id', treatmentController.updateTreatmentById);
router.delete('/:id', treatmentController.deleteTreatmentById);
router.put('/:id/updateIsAddedToBudget', treatmentController.updateIsAddedToBudget);

router.get('/budgets/filtros', async (req, res, next) => {
    try {
      // Obtenemos los filtros de la query string
      const filters = req.query;
  
      // Creamos un objeto con los filtros para la búsqueda
      const searchFilters = {};
      console.log({filters});
  
      // Recorremos los filtros y los agregamos al objeto de búsqueda
      Object.keys(filters).forEach((key) => {
        console.log('hola', key, filters[key]);
  
        // Verificamos si el valor es un ObjectID válido
        // if (mongoose.Types.ObjectId.isValid(filters[key])) {
        //   searchFilters[key] = mongoose.Types.ObjectId(filters[key]);
        // }
        // Verificamos si el valor es booleano
         if (filters[key] === "true" || filters[key] === "false") {
          searchFilters[key] = filters[key] === "true";
        }
        // Verificamos si el valor es numérico
        else if (!isNaN(filters[key])) {
          searchFilters[key] = Number(filters[key]);
        }
        // Si no es ObjectID, booleano ni numérico, lo tratamos como texto
        else {
          searchFilters[key] = { $eq: filters[key] };
        }
      });
  
      // Buscamos los tratamientos que coincidan con los filtros
      console.log("searchFilters:", searchFilters);
      const treatments = await treatmentModel.find(searchFilters).populate('employee', 'firstName lastName _id').populate('patient', '_id displayName').exec();
  
      res.json(treatments);
    } catch (error) {
      next(error);
    }
  });
  router.get('/treatments/mostCommon', async (req, res) => {
    try {
      const mostCommonTreatments = await treatmentModel.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 } // Obtener los 10 tratamientos más comunes (ajusta según tus necesidades)
      ]);
      res.json(mostCommonTreatments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.get('/employees/:employeeId', async (req, res) => {
    try {
      const { employeeId } = req.params;
  
      const treatments = await treatmentModel.find({ employee: employeeId }).populate('patient', 'firstName lastName _id phone alergias createdAt');
  
      res.json(treatments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
export default router;
