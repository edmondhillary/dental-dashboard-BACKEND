import patientModel from "../models/patientSchema.js";

import teethModel from "../models/teethSchema.js";
const { ObjectId } = Types;
import { Types } from "mongoose";

async function getAllPatients() {
  const patients = await patientModel.find({});
  return patients;
}

async function getPatientsByQuery(filters) {
  let regexFilter = {};
  console.log(filters); // { Name: 'guitarra', Brand: 'gibson' }
  const keys = Object.keys(filters);
  for (const key of keys) {
    regexFilter[key] = { $regex: filters[key], $options: "i" }; // utilizamos 'i' para insensible a mayúsculas y minúsculas
  }

  const getPacientsByFilterts = await patientModel.find(regexFilter);
  if (!getPacientsByFilterts) throw new Error("No patient found.");
  return getPacientsByFilterts;
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
  const existingPatient = await patientModel.find(fields.email);

  if (existingPatient) {
    return new Error();
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
