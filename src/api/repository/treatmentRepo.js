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

  // await createBudgetFromTreatmentCreated(budgetModel,fields.patient, fields.employee, fields.cost,treatment._id ,  employeeModel , patientModel, fields.discount)
     
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

async function getTreatmentsByQuery(query) {
  console.log(query);

  // Crear un objeto para almacenar los filtros con expresiones regulares
  let queryFilter = {};

  if (query.patient) {
    queryFilter.patient = query.patient;
  }

  if (typeof query.completed !== "undefined") {
    queryFilter.completed = query.completed === "true";
  }

  // if (typeof query.isPaid !== "undefined") {
  //   queryFilter.isPaid = query.isPaid === "true";
  // }
  if (query.type) {
    queryFilter.type = { $regex: query.type, $options: "i" };
  }
  // Agrega el filtro para el campo 'cost' si está presente en la consulta
  if (query.cost) {
    queryFilter.cost = Number(query.cost);
  }

  // Agrega el filtro para el campo 'teeth' si está presente en la consulta
  if (query.teeth) {
    queryFilter.teeth = Number(query.teeth);
  }
  if (typeof query.isAddedToBudget !== "undefined") {
    queryFilter.isAddedToBudget = query.isAddedToBudget === "true";
  }
  
  const getTreatmentsByFilters = await treatmentModel
    .find(queryFilter)
    // .populate('treatment', 'type _id')
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
  const deletedTreatment = await findAndDeleteTreatment(id);
  console.log("Tratamiento eliminado:", deletedTreatment);

  const employeeUpdated = await removeTreatmentFromEmployee(id);
  console.log("Empleado actualizado:", employeeUpdated);

  const removeTreatmentFromTeethModel = await removeTreatmentFromTeeth(id);
  console.log("Diente actualizado:", removeTreatmentFromTeethModel);

  const budgetUpdated = await updateBudget(id);
  console.log("Presupuesto actualizado:", budgetUpdated);

  const patientUpdated = await updatePatientAndEmployee(id, employeeUpdated);
  console.log("Paciente actualizado:", patientUpdated);

  return deletedTreatment;
}

async function findAndDeleteTreatment(id) {
  const result = await treatmentModel.findOneAndDelete({ _id: new ObjectId(id) }).exec();
  console.log("Resultado de findAndDeleteTreatment:", result);
  return result;
}

async function removeTreatmentFromEmployee(id) {
  const result = await employeeModel.findOneAndUpdate(
    { treatments: new ObjectId(id) },
    { $pull: { treatments: id } },
    { new: true }
  );
  console.log("Resultado de removeTreatmentFromEmployee:", result);
  return result;
}

async function removeTreatmentFromTeeth(id) {
  const result = await teethModel.findOneAndUpdate(
    { treatments: new ObjectId(id) },
    { $pull: { treatments: id } },
    { new: true }
  );
  console.log("Resultado de removeTreatmentFromTeeth:", result);
  return result;
}

async function updateBudget(id) {
  const budget = await budgetModel.findOne({ treatment: new ObjectId(id) });

  if (!budget) {
    console.log("No se encontró un presupuesto con el tratamiento especificado.");
    return null;
  }

  if (budget.treatment.length === 1) {
    const result = await budgetModel.findByIdAndDelete(budget._id);
    console.log("Resultado de updateBudget (eliminación):", result);
    return result;
  } else {
    const result = await budgetModel.findOneAndUpdate(
      { _id: budget._id },
      { $pull: { treatment: id } },
      { new: true }
    );
    console.log("Resultado de updateBudget (actualización):", result);
    return result;
  }
}


async function updatePatientAndEmployee(id, employeeUpdated) {
  const patientUpdated = await patientModel.findOneAndUpdate(
    { treatment: new ObjectId(id) },
    { $pull: { treatment: id } },
    { new: true }
  );

  if (!patientUpdated) {
    console.log("No se encontró un paciente con el tratamiento para actualizar.");
  } else {
    console.log("Paciente actualizado:", patientUpdated);
    const commonTreatments = employeeUpdated.treatments.filter(treatment => patientUpdated.treatment.includes(treatment._id));

    if (commonTreatments.length === 0) {
      const index = employeeUpdated.patients.indexOf(patientUpdated._id);
      if (index > -1) {
        employeeUpdated.patients.splice(index, 1);
        await employeeUpdated.save();
        console.log("Paciente eliminado de la lista de pacientes del empleado.");
      }
    }
  }

  return patientUpdated;
}


export {
  createTreatment,
  deleteTreatmentById,
  getTreatmentById,
  getTreatmentsByQuery,
  updateTreatmentById,
};
