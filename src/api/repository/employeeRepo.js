// import patientModel from "../models/patientSchema.js";
import employeeModel from "../models/employeeSchema.js";
import { Types } from "mongoose";
const { ObjectId } = Types;

async function getByEmail({ email }) {
  const user = await employeeModel.findOne({ email });
  return user;
}

async function insert({ password, email }) {
  const user = await employeeModel.create({ password, email });
  return user;
}

async function getAllEmployees() {
  const emplloyees = await employeeModel.find({});
  return emplloyees;
}

async function getEmployeeByName({ employeeName }) {
  const employee = await employeeModel.find({
    firstName: new RegExp(employeeName, "i"),
  });
  return employee;
}

async function getEmployeeById( { _id  } ) {
  const employee = await employeeModel .findById({ _id: new ObjectId(_id ) })
  return employee;
}

async function updateEmployeeById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const employeeToUpdate = await employeeModel.updateOne(query, updateBody);
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
  getEmployeeByName,
};
