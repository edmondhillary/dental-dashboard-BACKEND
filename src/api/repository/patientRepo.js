// import patientModel from "../models/patientSchema.js";
import patientModel from "../models/patientSchema.js";
import { Types } from "mongoose";
const { ObjectId } = Types;



async function getAllPatients (){
  const patients = await patientModel .find({});
  return patients;

}



async function getPatientsByQuery(filters) {

    let regexFilter = {};
    let sortFilter = {};
   console.log(filters) // { Name: 'guitarra', Brand: 'gibson' }
   const keys = Object.keys(filters);
   for (const key of keys) {
    regexFilter[key] = {$regex: filters[key], $options: '-i'} // filters[key] === Guitarra, gibson,music...
   }
        const getPacientsByFilterts = await patientModel.find(regexFilter);
        if (!getPacientsByFilterts) throw new Error('No patient found.');
        return getPacientsByFilterts;
      

   
}
// quizas ruta para ver que pacientes qeu tienen asignado un presupuesto estan debiendo dinero ...//
async function getPatientById({ id }) {
  const patient = await patientModel .findOne({ _id: new ObjectId(id) }).populate('budget')
  .populate('sessions');
  return patient;
}


async function updatePatientById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const patientToUpdate = await patientModel .updateOne(query, updateBody);
  return patientToUpdate;
}

async function deletePatientById({ id }) {
  const patient = await patientModel .findOneAndDelete({ _id: id }).exec();

  return patient;
}
async function createPatient({ fields }) {
    const patient = await patientModel.create(fields);
    return patient;
}
export {  getAllPatients, getPatientById, updatePatientById, deletePatientById , getPatientsByQuery , createPatient};
