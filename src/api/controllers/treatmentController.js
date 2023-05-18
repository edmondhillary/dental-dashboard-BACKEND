// import * as
import treatmentModel from '../models/treatmentSchema.js';
import * as treatmentRepo from '../repository/treatmentRepo.js'

async function createTreatment(req, res, next) {
    const fields = req.body;
    try {
        const treatment = await treatmentRepo.createTreatment({fields});
        res.json(treatment).status(201);
    } catch (err) {
        next(err);
    }
}

async function getTreatmentById(req, res) {
    const { id } = req.params;
    try{
  
        const treatment = await treatmentRepo.getTreatmentById({ id });
        if (treatment) {
            res.json(treatment);
          } else {
              res.status(404);
              res.send('TREATMENT not found');
          }
      }catch (error) {
          return res.status(error.status || 500).json(error.message);
        }
  }
  
  async function getTreatmentsByQuery(req, res) {
      try {
        // const filters = req.query;
        const treatment = await treatmentRepo.getTreatmentsByQuery(req.query);
        return res.json(treatment);
      } catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
    }
  
  
  async function updateTreatmentById(req, res) {
    const { id } = req.params;
    const fieldsToUpdate = req.body;
    try{
  
        const treatmentToUpdate = await treatmentRepo.updateTreatmentById({ id, fieldsToUpdate });
        res.json(treatmentToUpdate);
      }catch (error) {
          return res.status(error.status || 500).json(error.message);
        }
  }
  
  async function deleteTreatmentById(req, res) {
    const { id } = req.params;

    try {
        const deleteResponse = await treatmentRepo.deleteTreatmentById({ id });
        res.status(200).json({ message: "Tratamiento eliminado", data: deleteResponse });
  } catch (error) {
    console.error("Error al eliminar el tratamiento:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}

  const updateIsAddedToBudget = async (req, res) => {
    try {
      const { id } = req.params;
      const treatment = await treatmentModel.findByIdAndUpdate(id, { isAddedToBudget: true }, { new: true });
  
      if (!treatment) {
        return res.status(404).json({ message: 'Tratamiento no encontrado' });
      }
  
      res.status(200).json(treatment);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el tratamiento' });
    }
  };
  
export { createTreatment,deleteTreatmentById, updateTreatmentById, getTreatmentById, getTreatmentsByQuery, updateIsAddedToBudget };