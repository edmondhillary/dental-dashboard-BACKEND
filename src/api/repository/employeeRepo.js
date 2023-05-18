// import patientModel from "../models/patientSchema.js";
import employeeModel from "../models/employeeSchema.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

async function getByEmail({ email }) {
  const user = await employeeModel.findOne({ email });
  return user;
}

async function insert({ email, password, gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNumber, lastConnection }) {
  const user = await employeeModel.create({ email, password, gender, firstName, lastName, phone, dateOfBirth, address, role, dni, securityNumber, lastConnection });
  return user;
}

async function getAllEmployees() {
  const emplloyees = await employeeModel.find({});
  return emplloyees;
}

 async function getUserByToken(query, params) {
  const {populateTreatments, populateBudgets, populatePatients, populateAppointments} = params;
  const users = await employeeModel.findOne(query)
  .select('-password -email').exec();
  if (populateTreatments == 'true') await users.populate('treatments');
  if (populateBudgets == 'true') await users.populate('budgets');
  if (populatePatients == 'true') await users.populate('patients');
  if (populateAppointments == 'true') await users.populate('appointments');
  if (!users) throw new Error('No user found.');
  return users;
}
async function getEmployeeById( { _id  } ) {
  const employee = await employeeModel .findById({ _id: new ObjectId(_id ) }).populate('treatments').populate('budgets').populate('patients').populate('appointments');
  return employee;
}

async function updateEmployeeById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const employeeToUpdate = await employeeModel.findOneAndUpdate(query, updateBody, {new: true});
  return employeeToUpdate;
}

async function deleteEmployeeById({ id }) {
  const employee = await employeeModel.findOneAndDelete({ _id: id }).exec();

  return employee;
}
export {
  getByEmail,
  insert,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  getUserByToken,

};
