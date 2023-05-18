import appointmentsModel from "../models/appointmentsSchema.js";
import patientModel from "../models/patientSchema.js";
import employeeModel from "../models/employeeSchema.js";
// import sessionModel from "../models/sessionSchema.js";
import { Types } from "mongoose";
import treatmentModel from "../models/treatmentSchema.js";
import { checkIfPatientCanBeDeleted } from "../utilities/generalFunctions.js";
const { ObjectId } = Types;

async function createAppointment({ fields }) {
  const { employee, fechaInicio, fechaFin , patient, comentarios} = fields;

  // Verificar si existe una cita previa para este empleado que se solape con el intervalo de tiempo de la nueva cita
  const existingAppointments = await appointmentsModel.find({
    employee: new ObjectId(employee),
    $or: [
      { fechaInicio: { $gte: fechaInicio, $lte: fechaFin } },
      { fechaFin: { $gte: fechaInicio, $lte: fechaFin } },
      {
        $and: [
          { fechaInicio: { $lte: fechaInicio } },
          { fechaFin: { $gte: fechaFin } },
        ],
      },
    ],
  });

  if (existingAppointments.length > 0) {
    throw new Error(
      "El empleado ya tiene una cita programada en este intervalo de tiempo."
    );
  }

  // Crear nueva cita
  const newAppointment = await appointmentsModel.create(fields);

  // Añadir nueva cita al paciente
  await patientModel.findOneAndUpdate(
    { _id: new ObjectId(patient) },
    { $push: { appointments: newAppointment._id } },
    { new: true }
  );

  // Añadir nueva cita al empleado
  await employeeModel.findOneAndUpdate(
    { _id: new ObjectId(employee) },
    { $push: { appointments: newAppointment._id } },
    { new: true }
  );

  // Añadir paciente al empleado si no está en su lista de pacientes
  const employeeDb = await employeeModel.findOne({
    _id: new ObjectId(employee),
  });
  const patientId = new ObjectId(fields.patient);

  if (!employeeDb.patients.includes(patientId)) {
    await employeeModel.findOneAndUpdate(
      { _id: employeeDb._id },
      { $addToSet: { patients: patientId } },
      { new: true }
    );
  }

  return newAppointment;
}

async function getAppointmentById(id) {
  const appointment = await appointmentsModel
    .findOne({ _id: new ObjectId(id) })
    .populate("patient", "firstName lastName _id")
    .populate("employee", "firstName lastName _id");

  return appointment;
}

async function updateAppointmentById({ id, fieldsToUpdate }) {
  const oldEmployee = await employeeModel.findOne({
    appointments: new ObjectId(id),
  });
  console.log("OLD EMPLOYEE", oldEmployee._id);
  const oldPatient = await patientModel.findOne({
    appointments: new ObjectId(id),
  });
  console.log("OLD patient", oldPatient._id);

  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  console.log(updateBody);

  const appointmentToUpdate = await appointmentsModel.findOneAndUpdate(
    query,
    updateBody,
    { new: true }
  );
  console.log("appointmentToUpdate ", appointmentToUpdate);

  // Verificar si se actualizó el campo de employee
  if (
    fieldsToUpdate.employee &&
    fieldsToUpdate.employee.toString() !== oldEmployee._id.toString()
  ) {
    // Eliminar el id del tratamiento de la lista de tratamientos del oldEmployee
    const updatedOldEmployee = await employeeModel.findOneAndUpdate(
      { _id: oldEmployee._id },
      { $pull: { appointments: id } },
      { new: true }
    );
    console.log("OLD EMPLOYEE UPDATED WITHOUT APPOINTMENT", updatedOldEmployee);

    // Agregar el id de la cita  a la lista de citas  del nuevo empleado
    const updatedNewEmployee = await employeeModel.findOneAndUpdate(
      { _id: fieldsToUpdate.employee },
      {
        $addToSet: { appointments: id, patients: appointmentToUpdate.patient },
      },
      { new: true }
    );
    console.log(
      "NEW EMPLOYEE UPDATED WITH NEW APPOINTMENT",
      updatedNewEmployee
    );
  }
  if (
    fieldsToUpdate.patient &&
    fieldsToUpdate.patient.toString() !== oldPatient._id.toString()
  ) {
    // Eliminar el id del tratamiento de la lista de tratamientos del oldEmployee
    const updatedOldPatient = await patientModel.findOneAndUpdate(
      { _id: oldPatient._id },
      { $pull: { appointments: id } },
      { new: true }
    );
    console.log("OLD EMPLOYEE UPDATED", updatedOldPatient);

    // Agregar el id de la cita  a la lista de citas  del nuevo empleado
    const updatedNewPatient = await patientModel.findOneAndUpdate(
      { _id: fieldsToUpdate.patient },
      { $addToSet: { appointments: id } },
      { new: true }
    );
    console.log("NEW EMPLOYEE UPDATED", updatedNewPatient);
  }
  return appointmentToUpdate;
}

async function deleteAppointmentById(id) {
  const query = { _id: new ObjectId(id) };
  const deletedAppointment = await appointmentsModel.findOneAndDelete(query);
  const removeAppointmentFromPatient = await patientModel.findOneAndUpdate(
    { _id: deletedAppointment.patient },
    { $pull: { appointments: deletedAppointment._id } },
    { new: true }
  );
  const removeAppointmentFromEmployee = await employeeModel.findOneAndUpdate(
    { _id: deletedAppointment.employee },
    { $pull: { appointments: deletedAppointment._id } },
    { new: true }
  );
  await checkIfPatientCanBeDeleted(
    deletedAppointment.patient,
    deletedAppointment.employee,
    treatmentModel,
    //  sessionModel,
    appointmentsModel,
    employeeModel
  );

  return deletedAppointment;
}
export {
  createAppointment,
  deleteAppointmentById,
  updateAppointmentById,
  getAppointmentById,
};
