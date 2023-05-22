import patientModel from "../models/patientSchema.js";

import teethModel from "../models/teethSchema.js";
const { ObjectId } = Types;
import { Types } from "mongoose";

async function getAllPatients() {
  const patients = await patientModel.find({});
  return patients;
}

async function getPatientsByQuery(displayName) {
  const regexFilter = {};
  if (displayName) {
    regexFilter.displayName = { $regex: displayName, $options: "i" };
  }

  const patients = await patientModel.aggregate([
    {
      $addFields: {
        displayName: { $concat: ["$firstName", " ", "$lastName"] }
      }
    },
    {
      $match: regexFilter
    }
  ]);

  if (!patients) throw new Error("No patients found.");
  return patients;
}



// quizas ruta para ver que pacientes qeu tienen asignado un presupuesto estan debiendo dinero ...//
async function getPatientById({ id }) {
  const patient = await patientModel
    .findOne({ _id: new ObjectId(id) })
    // .populate('treatment')
    .populate("budget")
    .populate({
      path: "treatment",
      populate: {
        path: "employee",
        select: "id firstName lastName",
        model: "Employee",
      },
    });
  return patient;
}

async function updatePatientById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const patientToUpdate = await patientModel.findOneAndUpdate(
    query,
    updateBody,
    { new: true }
  );
  return patientToUpdate;
}

async function deletePatientById({ id }) {
  const patient = await patientModel.findOneAndDelete({ _id: id }).exec();

  return patient;
}
async function createPatient({ fields }) {
  const { email, phone } = fields;

  // Verificar si el paciente ya existe en la base de datos por email o número de teléfono
  const existingPatient = await patientModel.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingPatient) {
    throw new Error('El paciente ya está registrado. el telefono o el Email ya estan en la base de datos.');
  }

  const patient = await patientModel.create(fields);

  return patient;
}

export {
  getAllPatients,
  getPatientById,
  updatePatientById,
  deletePatientById,
  getPatientsByQuery,
  createPatient,
};
