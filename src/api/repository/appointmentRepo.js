import appointmentsModel from "../models/appointmentsSchema.js";
import patientModel from "../models/patientSchema.js";
import employeeModel from "../models/employeeSchema.js";
import twilio from "twilio";

// import sessionModel from "../models/sessionSchema.js";
import { Types } from "mongoose";
import treatmentModel from "../models/treatmentSchema.js";
import { checkIfPatientCanBeDeleted } from "../utilities/generalFunctions.js";
import moment from "moment";

moment.locale('es');
const { ObjectId } = Types;

const accountSid ='AC731b206fe2ba3c2e1ce7da83e094475e' ;
const authToken ='f44713a83e551f1d1fd905c976081e1f' ;


async function createAppointment({ fields }) {
  const { employee, fechaInicio, fechaFin, patient, comentarios } = fields;

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
  const newAppointment = await appointmentsModel.create(fields)

  const populatedAppointment = await appointmentsModel
  .findOne({ _id: newAppointment._id })
  .populate("patient", "phone firstName lastName _id")
  .populate("employee", "phone firstName lastName _id");

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
  const client = twilio(accountSid, authToken); // Asegúrate de tener las credenciales de Twilio configuradas
  const formattedFechaInicio = moment(newAppointment.fechaInicio).format('dddd D [de] MMMM [de] YYYY [a las] h:mm A');

  const messageBody = `✨ ¡Se ha creado una cita! ✨\n\n👨‍⚕️ Dr.(a) ${populatedAppointment.employee.lastName}\n⏰ Fecha y hora: ${formattedFechaInicio}\n🏢 Clínica Dental Lorenzo González\n📍 Dirección: Calle Manuel Candela 5 pta 1\n\n¡Estaremos esperándote para brindarte el mejor cuidado dental! Si tienes alguna pregunta o necesitas cambiar tu cita, puedes contactarnos al ☎️ 963608833 o a través de 📲 WhatsApp. 😊`;


  const messageTo =`whatsapp:+34${populatedAppointment.patient.phone}` // Reemplaza con el numeor del paciente
  const messageFrom = 'whatsapp:+14155238886'; // Reemplaza con tu número de teléfono de Twilio
  
  await client.messages
  .create({
    body: messageBody,
    from: messageFrom,
    to: messageTo,
  })
  .then((message) => console.log("Mensaje enviado PARA CITA CREADA: ✅ ", message.sid))
  .catch((error) => console.error("Error al enviar el mensaje:", error));
  console.log({messageBody}, {newAppointment})

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
  const deletedAppointment = await appointmentsModel.findOneAndDelete(query)
  .populate("patient", "firstName lastName _id phone")
  .populate("employee", "firstName lastName _id");
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
  // Enviar notificación al médico
  const client = twilio(accountSid, authToken); // Asegúrate de tener las credenciales de Twilio configuradas
  const formattedFechaInicio = moment(deletedAppointment.fechaInicio).format('dddd D [de] MMMM [de] YYYY [a las] h:mm A');

  // Enviar notificación al médico

  const messageBody = `❌ ¡Cita Cancelada! ❌\n\n👨‍⚕️ Dr.(a) ${deletedAppointment.employee.lastName}\n⏰ Fecha y hora: ${formattedFechaInicio}\n🏢 Clínica Dental Lorenzo González\n📍 Dirección: Calle Manuel Candela 5 pta 1\n\nLamentamos informarle que se ha cancelado la cita programada. Si necesita programar una nueva cita o tiene alguna pregunta, no dude en comunicarse con nosotros al ☎️ 963608833 o a través de 📲 WhatsApp. ¡Gracias por su comprensión! 😊`;

  const messageTo =`whatsapp:+34${deletedAppointment.patient.phone}` // Reemplaza con el número de teléfono del médico
  const messageFrom = 'whatsapp:+14155238886.'; // Reemplaza con tu número de teléfono de Twilio
  
  await client.messages
  .create({
    body: messageBody,
    from: messageFrom,
    to: messageTo,
  })
  .then((message) => console.log("Mensaje enviado PARA CITA ELIMINADA: ✅ ", message.sid))
  .catch((error) => console.error("Error al enviar el mensaje:", error));
  
  console.log({deletedAppointment}, {messageBody})
  return deletedAppointment;
}
export {
  createAppointment,
  deleteAppointmentById,
  updateAppointmentById,
  getAppointmentById,
};
