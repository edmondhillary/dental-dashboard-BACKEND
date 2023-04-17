import employeeModel from "../models/employeeSchema.js";
import patientModel from "../models/patientSchema.js";
import treatmentModel from "../models/treatmentSchema.js";
// import sessionModel from "../models/sessionSchema.js";
import appointmentsModel from "../models/appointmentsSchema.js";
import { Types } from "mongoose";
const { ObjectId } = Types;
import { checkIfPatientCanBeDeleted, createBudgetFromTreatmentCreated, createToothForTreatment } from "../utilities/generalFunctions.js";
import teethModel from "../models/teethSchema.js";
import budgetModel from "../models/budgetSchema.js";

async function createTreatment({ fields }) {

  const treatment = await treatmentModel.create(fields);
  
  const createTeeht = await createToothForTreatment(fields.
  teeth, fields.patient, teethModel, treatment._id , patientModel);
  console.log(createTeeht);

  await createBudgetFromTreatmentCreated(budgetModel,fields.patient, fields.employee, fields.cost,treatment._id ,  employeeModel , patientModel)
     
  const addPatientToTreatment = await patientModel.findOneAndUpdate(
    { _id: new ObjectId(fields.patient) },
    { $push: { treatment: treatment._id } },
    { new: true }
  );

  const addTreatmentToEmployee = await employeeModel.findOneAndUpdate(
    { _id: new ObjectId(fields.employee) },
    { $push: { treatments: treatment._id } },
    { new: true }
  );
  // const addTreatmentToSessionModel = await sessionModel.findOneAndUpdate(
  //   { patient: new ObjectId(fields.patient) },
  //   { $push: { treatments: new ObjectId(treatment._id)  } },
  //   { new: true }
  // )

  const employee = await employeeModel.findOne({
    _id: new ObjectId(fields.employee),
  });

  if (employee.patients.includes(new ObjectId(fields.patient))) {
    // El paciente ya está en la lista de pacientes del médico, no es necesario agregarlo de nuevo.
  } else {
    // El paciente no está en la lista de pacientes del médico, agregarlo al array.
    const addPatientToEmployee = await employeeModel.findOneAndUpdate(
      { _id: new ObjectId(fields.employee) },
      { $push: { patients: new ObjectId(fields.patient) } },
      { new: true }
    );
  }
  if (fields.employee2) {
    const addTreatmentToEmployee2 = await employeeModel.findOneAndUpdate(
      { _id: new ObjectId(fields.employee2) },
      { $push: { treatments: treatment._id } },
      { new: true }
    );
    const employee2 = await employeeModel.findOne({
      _id: new ObjectId(fields.employee2),
    });
    if (employee2.patients.includes(new ObjectId(fields.patient))) {
      // El paciente ya está en la lista de pacientes del médico, no es necesario agregarlo de nuevo.
    } else {
      // El paciente no está en la lista de pacientes del médico, agregarlo al array.
      const addPatientToEmployee2 = await employeeModel.findOneAndUpdate(
        { _id: new ObjectId(fields.employee2) },
        { $push: { patients: new ObjectId(fields.patient) } },
        { new: true }
      );
    }
  }
   
  return treatment;
}

async function getTreatmentsByQuery(filters) {
  let regexFilter = {};
  console.log(filters); 
  const keys = Object.keys(filters);
  for (const key of keys) {
    regexFilter[key] = { $regex: filters[key], $options: "-i" }; // filters[key] === Guitarra, gibson,music...
  }
  const getTreatmentsByFilters = await treatmentModel
    .find(regexFilter)
    .sort({ createdAt: -1 })
    .exec();
  if (!getTreatmentsByFilters) throw new Error("No patient found.");
  return getTreatmentsByFilters;
}
// quizas ruta para ver que pacientes qeu tienen asignado un presupuesto estan debiendo dinero ...//
async function getTreatmentById({ id }) {
  const treatment = await treatmentModel
    .findOne({ _id: new ObjectId(id) })
    .populate("patient", "firstName lastName _id")
    .populate("employee", "firstName lastName _id");
    //.populate("employee2")
  return treatment;
}

async function updateTreatmentById({ id, fieldsToUpdate }) {
  const oldEmployee = await employeeModel.findOne({ treatments: new ObjectId(id) });
  console.log('OLD EMPLOYEE', oldEmployee._id);

  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  console.log(updateBody);

  const treatmentToUpdate = await treatmentModel.findOneAndUpdate(query, updateBody, { new: true });
  console.log('TREATMENT UPDATED', treatmentToUpdate);

  // Verificar si se actualizó el campo de employee
  if (fieldsToUpdate.employee && fieldsToUpdate.employee.toString() !== oldEmployee._id.toString()) {
    // Eliminar el id del tratamiento de la lista de tratamientos del oldEmployee
    const updatedOldEmployee = await employeeModel.findOneAndUpdate(
      { _id: oldEmployee._id },
      { $pull: { treatments: id } },
      { new: true }
    );
    console.log('OLD EMPLOYEE UPDATED', updatedOldEmployee);
  
    // Verificar si hay otros tratamientos del oldEmployee con el mismo paciente
    const otherTreatments = await treatmentModel.find({
      _id: { $ne: new ObjectId(id) }, // Excluir el tratamiento actualizado
      patient: treatmentToUpdate.patient, // Buscar tratamientos con el mismo paciente
      employee: oldEmployee._id // Buscar tratamientos del oldEmployee
    });
    
    if (otherTreatments.length === 0) {
      // Si no hay otros tratamientos del oldEmployee con el mismo paciente, eliminar el paciente de la lista de pacientes
      const updatedOldEmployeeWithoutPatient = await employeeModel.findOneAndUpdate(
        { _id: oldEmployee._id },
        { $pull: { patients: treatmentToUpdate.patient } },
        { new: true }
      );
      console.log('OLD EMPLOYEE UPDATED WITHOUT PATIENT', updatedOldEmployeeWithoutPatient);
    }
  
    // Agregar el id del tratamiento a la lista de tratamientos del nuevo empleado
    const updatedNewEmployee = await employeeModel.findOneAndUpdate(
      { _id: fieldsToUpdate.employee },
      { $addToSet: { treatments: id, patients: treatmentToUpdate.patient } },
      { new: true }
    );
    console.log('NEW EMPLOYEE UPDATED', updatedNewEmployee);
  }
  
  return treatmentToUpdate;
}

async function deleteTreatmentById({ id }) {
  const deletedTreatment = await treatmentModel.findOneAndDelete({ _id: id }).exec();
  const employeeUpdated = await employeeModel.findOneAndUpdate(
    { treatments: new ObjectId(id) },
    { $pull: { treatments: id } },
    { new: true }
  );

  //removeTreatmentFromEmployee//arriba
  const removeTreatmentFromTeethModel = await teethModel.findOneAndUpdate(

    { treatment: new ObjectId(id) },
    { $pull: { treatment: id } },
    { new: true }
    )

  const patientUpdated = await patientModel.findOneAndUpdate(
    { treatment: new ObjectId(id) },
    { $pull: { treatment: id } },
    { new: true }
  );
  if (!patientUpdated) {
    console.log(`No se encontró ningún paciente con el tratamiento ${id}`);
    // Realiza alguna acción en consecuencia
  } else {
    console.log(`Paciente actualizado: ${patientUpdated}`);
    const commonTreatments = employeeUpdated.treatments.filter(treatment => patientUpdated.treatment.includes(treatment._id));
if (commonTreatments.length > 0) {
  // Si hay tratamientos en común, no se borra al paciente de la lista de pacientes del empleado
} else {
  // Si no hay tratamientos en común, se borra al paciente de la lista de pacientes del empleado
  const index = employeeUpdated.patients.indexOf(patientUpdated._id);
  if (index > -1) {
    employeeUpdated.patients.splice(index, 1);
    await employeeUpdated.save();
  }
}
    // Realiza alguna acción en consecuencia
  }
  //removeTreatmentFromPatient arriba//
 await checkIfPatientCanBeDeleted(
  deletedTreatment.patient,
  deletedTreatment.employee, 
  // sessionModel,
  employeeModel,
  treatmentModel,
  appointmentsModel,
 )
  return deletedTreatment;
}

export {
  createTreatment,
  deleteTreatmentById,
  getTreatmentById,
  getTreatmentsByQuery,
  updateTreatmentById,
};
