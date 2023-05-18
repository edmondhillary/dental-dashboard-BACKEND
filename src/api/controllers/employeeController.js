import * as employeeRepo from '../repository/employeeRepo.js'

async function getAll( req, res ) {
    try{

        const employees = await employeeRepo.getAllEmployees();
        res.json(employees);
    }
    catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function getUserByToken(req, res) {
  try {
    console.log(req)
    const query = { _id: req.userId }
    const { populateTreatments, populateBudgets, populatePatients, populateAppointments } = req.query;
    const user = await employeeRepo.getUserByToken(query, { populateTreatments, populateBudgets, populatePatients, populateAppointments });
    return res.json(user);
  } catch (error) {
    return res.status(error.status || 500).json(error.message);
  }
}
async function getEmployeeById(req, res) {
  const { _id } = req.params;
  try{

      const employee = await employeeRepo.getEmployeeById( {_id} );
      if (employee) {
        console.log(req, req.userId)
        res.json(employee);
        } else {
            res.status(404);
            res.send('employee not found');
        }
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}


async function updateEmployeeById(req, res) {
  const { id } = req.params;
  const fieldsToUpdate = req.body;
  try{

      const employeeToUpdate = await employeeRepo.updateEmployeeById({ id, fieldsToUpdate });
      res.json(employeeToUpdate);
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}

async function deleteEmployeeById(req, res) {
  const { id } = req.params;
  try{

      const deleteResponse = await employeeRepo.deleteEmployeeById({ id });
      res.write('Deleted element');
      res.end();
    }catch (error) {
        return res.status(error.status || 500).json(error.message);
      }
}




export {getAll, getEmployeeById , deleteEmployeeById ,updateEmployeeById,getUserByToken }