
import budgetModel from "../models/budgetSchema.js";
import { Types } from "mongoose";
import patientModel from "../models/patientSchema.js";
const { ObjectId } = Types;


async function getBudgetsByQuery(filters) {

    let regexFilter = {};
    let sortFilter = {};
   console.log(filters) // { Name: 'guitarra', Brand: 'gibson' }
   const keys = Object.keys(filters);
   for (const key of keys) {
    regexFilter[key] = {$regex: filters[key], $options: '-i'} // filters[key] === Guitarra, gibson,music...
   }
        const getBudgetsByFilterts = await budgetModel
        .find(regexFilter)
        .sort({createdAt: -1})
        .exec();
        if (!getBudgetsByFilterts) throw new Error('No budgets found.');
        const formattedBudgets = budgets.map((budget) => {
            const formattedStartDate = budget.startDate.toLocaleDateString("es-ES");
            return { ...budget.toObject(), startDate: formattedStartDate };
          });
        return formattedBudgets;
      

   
}
// quizas ruta para ver que pacientes qeu tienen asignado un presupuesto estan debiendo dinero ...//
async function getBudgetById({ id }) {
  const budget = await budgetModel .findOne({ _id: new ObjectId(id) }).populate('patient').exec();
  return budget;
}


async function updateBudgetById({ id, fieldsToUpdate }) {
  const query = { _id: new ObjectId(id) };
  const updateBody = { $set: fieldsToUpdate };
  const budgetToUpdate = await budgetModel .updateOne(query, updateBody, {new: true});
  return budgetToUpdate;
}

async function deleteBudgetById({ id }) {
  const budget = await budgetModel .findOneAndDelete({ _id: id }).exec();

  return budget;
}
async function createBudget({ fields }) {
    const budget = await budgetModel.create(fields);
    const addbudgetToPatient = await patientModel.findOneAndUpdate(
        { _id: new ObjectId(fields.patient) },
        { $push: { budget: budget._id } },
        { new: true }
        )
    return budget;
}
export {   getBudgetById, updateBudgetById, deleteBudgetById , getBudgetsByQuery , createBudget};
