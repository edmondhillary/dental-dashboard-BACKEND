import * as budgetRepo from '../repository/budgetRepo.js'


async function getBudgetById(req, res) {
  const { id } = req.params;
  try{

      const budget = await budgetRepo.getBudgetById({ id });
      if (budget) {
          res.json(budget);
        } else {
            res.status(404);
            res.send('BUDGET not found');
        }
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function getBudgetsByQuery(req, res) {
    try {
      const filters = req.query;
      const budgets = await budgetRepo.getBudgetsByQuery(filters);
      return res.json(budgets);
    } catch (error) {
      return res.status(error.status || 500).json(error.message);
    }
  }


async function updateBudgetById(req, res) {
  const { id } = req.params;
  const fieldsToUpdate = req.body;
  try{

      const budgetToUpdate = await budgetRepo.updateBudgetById({ id, fieldsToUpdate });
      res.json(budgetToUpdate);
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function deleteBudgetById(req, res) {
  const { id } = req.params;
  try{

      const deleteResponse = await budgetRepo.deleteBudgetById({ id });
      res.write('BORRÓ PRESUPUESTO CON EXITO!!');
      res.end();
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}
async function createBudget(req, res) {
    const fields = req.body;
    try{

        const newBudget = await budgetRepo.createBudget({ fields });
        res.json(newBudget);
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}




export {  getBudgetById , deleteBudgetById ,updateBudgetById, createBudget , getBudgetsByQuery }