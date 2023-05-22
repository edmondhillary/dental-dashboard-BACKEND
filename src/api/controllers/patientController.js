import * as patientRepo from '../repository/patientRepo.js'

async function getAll( req, res ) {
    try{

        const patients = await patientRepo.getAllPatients();
        res.json(patients);
    }
    catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function getPatientById(req, res) {
  const { id } = req.params;
  try{

      const Patient = await patientRepo.getPatientById({ id });
      if (Patient) {
          res.json(Patient);
        } else {
            res.status(404);
            res.send('patient not found');
        }
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function getPatientsByQuery(req, res) {
  try {
    const { displayName } = req.query;
    const patients = await patientRepo.getPatientsByQuery(displayName);
    return res.json(patients);
  } catch (error) {
    return res.status(error.status || 500).json(error.message);
  }
}



async function updatePatientById(req, res) {
  const { id } = req.params;
  const fieldsToUpdate = req.body;
  try{

      const PatientToUpdate = await patientRepo.updatePatientById({ id, fieldsToUpdate });
      res.json(PatientToUpdate);
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function deletePatientById(req, res) {
  const { id } = req.params;
  try{

      const deleteResponse = await patientRepo.deletePatientById({ id });
      res.write('BORRÓ PACIENTE CON EXITO!!');
      res.end();
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}
async function createPatient(req, res) {
    const fields = req.body;
    try{

        const newPatient = await patientRepo.createPatient({ fields });
        res.json(newPatient);
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}




export { getAll, getPatientById , deletePatientById ,updatePatientById, createPatient , getPatientsByQuery }