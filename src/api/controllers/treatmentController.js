// import * as
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
        const filters = req.query;
        const treatment = await treatmentRepo.getTreatmentsByQuery(filters);
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

    try{
        const deleteResponse = await treatmentRepo.deleteTreatmentById({ id });
        res.write('ELIMINÓ TRATAMIENTO CON EXITO!!');
        res.end();
        
      }catch (error) {
          return res.status(error.status || 500).json(error.message);
        }
  }
export { createTreatment,deleteTreatmentById, updateTreatmentById, getTreatmentById, getTreatmentsByQuery };