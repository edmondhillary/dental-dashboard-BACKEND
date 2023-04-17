import { Types } from "mongoose";
// import patientModel from "../models/patientSchema";
const { ObjectId } = Types;

export async function checkIfPatientCanBeDeleted(patientId, employeeId, treatmentModel, appointmentsModel, employeeModel) {
  const existingTreatment = await treatmentModel.findOne({
    patient: new ObjectId(patientId), // Buscar tratamientos con el mismo paciente
    employee: new ObjectId(employeeId) // Buscar tratamientos del nuevo empleado
  });
  
  // const existingSession = await sessionModel.findOne({
  //   patient: new ObjectId(patientId), // Buscar tratamientos con el mismo paciente
  //   employee: new ObjectId(employeeId) // Buscar tratamientos del nuevo empleado
  // });
  
  const existingAppointments = await appointmentsModel.findOne({
    patient: new ObjectId(patientId), // Buscar tratamientos con el mismo paciente
    employee: new ObjectId(employeeId) // Buscar tratamientos del nuevo empleado
  });
  
  console.log({ existingAppointments },
    //  { existingSession },
      { existingTreatment });
  
  // Si ningún empleado, cita, sesión o tratamiento tiene al paciente, borrar al paciente
  if (!existingAppointments && !existingSession && !existingTreatment) {
    await employeeModel.findOneAndUpdate(
      { _id: new ObjectId(employeeId) },
      { $pull: { patients: new ObjectId(patientId) } },
      { new: true }
    );
    
    return true; // Indicamos que el paciente puede ser borrado
  } else {
    return false; // Indicamos que el paciente no puede ser borrado
  }
}

export async function createToothForTreatment(numberTreatment, patientId, teethModel, treatmentId, patientModel) {
  try {
    const teeth = await teethModel.create({
      number: numberTreatment,
      patient: patientId,
      treatments: new ObjectId(treatmentId)
      
    });
    const addTeethToPatientModel = await patientModel.findOneAndUpdate(
      { _id: new ObjectId(patientId) },
      { $push: { tooth: teeth._id } },
      { new: true }
    )
    return teeth;
  } catch (error) {
    console.error(error);
    throw new Error('Error creating tooth for treatment');
  }
}

export async function createBudgetFromTreatmentCreated (budgetModel, patientId, employeeId,  treatmentCost, treatmentId, employeeModel,patientModel) {

  try{
    const budget = await budgetModel.create({
     
      patient: new ObjectId(patientId),
      employee: new ObjectId(employeeId),
      cost: treatmentCost,
      treatment: treatmentId

    });
    const addBudgetToemployee = await employeeModel.findOneAndUpdate(
      { _id: new ObjectId(employeeId) },
      { $push: { budgets: budget._id } },
      { new: true }
    )
    const addBudgetToPatient = await patientModel.findOneAndUpdate(
      { _id: new ObjectId(patientId) },
      { $push: { budget: budget._id } },
      { new: true }
    )
    return budget;
  }catch (error) {
    console.error(error);
    throw new Error('Error creating budget');
  }

}
