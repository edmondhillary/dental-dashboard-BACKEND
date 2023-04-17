import * as appoRepo from '../repository/appointmentRepo.js';
import appointmentModel from '../models/appointmentsSchema.js';
import patientModel from '../models/patientSchema.js';
import employeeModel from '../models/employeeSchema.js';


const createAppointment = async (req, res) => {
    try {
    const fields = req.body;
    const appointment = await appoRepo.createAppointment({fields});
        if(appointment){
            res.json(appointment);
        }
        else{
            res.status(404).json({ message: 'No existe la cita' });
        }
     }
     catch (error) {
         res.status(500).json({ error: error.message });
     }
 
  };
  async function getAppointmentById(req, res) {

    const { id } = req.params;
   try{
   
    const appointment = await appoRepo.getAppointmentById({id});
    if(appointment){
        res.json(appointment);
    }else{
        res.status(404).json({ message: 'No existe la cita' });
    }
  
   }
   catch (error) {
     res.status(500).json({ error: error.message });
   }
}
  async function updateAppointmentById(req, res) {
    const { id } = req.params;
    const fieldsToUpdate = req.body;
    try{
  
        const appointmentToUpdate = await appoRepo.updateAppointmentById({ id, fieldsToUpdate });
        res.json(appointmentToUpdate);
      }catch (error) {
          return res.status(error.status || 500).json(error.message);
        }
  }

async function deleteAppointmentById(req, res) {
    const {id} = req.params;
    try{
        const deletedAppointment = await appoRepo.deleteAppointmentById({id});
        res.write('ELIMINÓ LA CITA  CON EXITO!!');
        res.end();
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}
export {createAppointment, deleteAppointmentById, updateAppointmentById, getAppointmentById}