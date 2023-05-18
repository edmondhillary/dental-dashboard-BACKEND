
import budgetModel from "../models/budgetSchema.js";
import { Types } from "mongoose";
import patientModel from "../models/patientSchema.js";
import treatmentModel from "../models/treatmentSchema.js";
import employeeModel from "../models/employeeSchema.js";
const { ObjectId } = Types;


async function getBudgetsByQuery(filters) {

    let regexFilter = {};
   const keys = Object.keys(filters);
   for (const key of keys) {
    regexFilter[key] = {$regex: filters[key], $options: '-i'} // filters[key] === Guitarra, gibson,music...
   }
        const getBudgetsByFilterts = await budgetModel
        .find(regexFilter)
        .sort({createdAt: -1})
        .exec();
        if (!getBudgetsByFilterts) throw new Error('No budgets found.');
        // const formattedBudgets =  getBudgetsByFilterts.map((budget) => {
        //     const formattedStartDate =  getBudgetsByFilterts.fechaInicio.toLocaleDateString("es-ES");
        //     return { ...budget.toObject(), fechaInicio: formattedStartDate };
        //   });
        return getBudgetsByFilterts;
      

   
}
// quizas ruta para ver que pacientes qeu tienen asignado un presupuesto estan debiendo dinero ...//
async function getBudgetById({ id }) {
  const budget = await budgetModel .findOne({ _id: new ObjectId(id) }).populate('patient').exec();
  return budget;
}


async function updateBudgetById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const options = { new: true};
  const budgetToUpdate = await budgetModel .findOneAndUpdate(query, updateBody,options).exec();

  return budgetToUpdate;
}

async function deleteBudgetById({ id }) {
  const budget = await budgetModel.findOneAndDelete({ _id: id }).exec();

  // Actualizar los tratamientos relacionados con el presupuesto borrado
  await treatmentModel.updateMany(
    { budget: budget._id }, // Filtro para los tratamientos relacionados con el presupuesto borrado
    { $set: { isAddedToBudget: false, budget: null } } // Actualiza el campo 'isAddedToBudget' y 'budget'
  );

  return budget;
}

async function createBudget({ fields }) {
  const treatmentIds = fields.treatment;
  const treatments = await treatmentModel.find({ _id: { $in: treatmentIds } });

  // Modifica esta línea para incluir el cálculo del descuento
  const cost = treatments.reduce((total, treatment) => total + (treatment.cost * (1 - treatment.discount / 100)), 0);

  // Obtén la lista única de empleados de los tratamientos
  const uniqueEmployeeIds = [...new Set(treatments.map(treatment => treatment.employee.toString()))];

  const budget = await budgetModel.create({ ...fields, cost, employee: uniqueEmployeeIds });

  const addbudgetToPatient = await patientModel.findOneAndUpdate(
    { _id: new ObjectId(fields.patient) },
    { $push: { budget: budget._id } },
    { new: true }
  )
  .populate('treatment');

  // Itera a través de la lista única de empleados y agrega el presupuesto a cada uno de ellos
  for (const employeeId of uniqueEmployeeIds) {
    await employeeModel.findOneAndUpdate(
      { _id: new ObjectId(employeeId) },
      { $push: { budgets: budget._id } },
      { new: true }
    );
  }

  // Actualiza el campo 'budget' en cada tratamiento relacionado con el presupuesto
  await treatmentModel.updateMany(
    { _id: { $in: treatmentIds } }, // Filtro para los tratamientos relacionados con el presupuesto
    { $set: { budget: budget._id, isAddedToBudget: true } } // Actualiza el campo 'budget' y 'isAddedToBudget'
  );

  return budget;
}


export {   getBudgetById, updateBudgetById, deleteBudgetById , getBudgetsByQuery , createBudget};
