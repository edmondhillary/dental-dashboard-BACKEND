import express from "express";
import * as patientController from "../controllers/patientController.js";
import { isAdmin, isSuperAdmin } from "../auth/auth.controller.js";
import patientModel from "../models/patientSchema.js";
import appointmentsModel from "../models/appointmentsSchema.js";
import mongoose from "mongoose";
import employeeModel from "../models/employeeSchema.js";
const router = express.Router();

router.post("/", patientController.createPatient);
// router.get('/', patientController.getAll);
router.get('/' , patientController.getPatientsByQuery);
router.get("/:id", patientController.getPatientById);
router.put("/:id", patientController.updatePatientById);
router.delete("/:id", isAdmin, patientController.deletePatientById);


// router.get("/pacientes/filtro", async (req, res) => {
//   try {
//     const { displayName } = req.query;
//     const regexFilter = {};
//     if (displayName) {
//       regexFilter.displayName = { $regex: displayName, $options: "i" };
//     }
//     // Agrega otros campos de filtro según sea necesario

//     const patients = await patientModel.find(regexFilter);
//     if (!patients) throw new Error("No patients found.");

//     return res.json(patients);
//   } catch (error) {
//     return res.status(error.status || 500).json({ error: error.message });
//   }
// });

router.get("/pacientes/ageRangeCount", async (req, res) => {
  try {
    const ageRangeCount = await patientModel.aggregate([
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ["$edad", 10] }, then: "0-10" },
                { case: { $lte: ["$edad", 20] }, then: "11-20" },
                { case: { $lte: ["$edad", 30] }, then: "21-30" },
                { case: { $lte: ["$edad", 40] }, then: "31-40" },
                { case: { $lte: ["$edad", 50] }, then: "41-50" },
                { case: { $lte: ["$edad", 60] }, then: "51-60" },
                { case: { $lte: ["$edad", 70] }, then: "61-70" },
                { case: { $lte: ["$edad", 80] }, then: "71-80" },
                { case: { $lte: ["$edad", 90] }, then: "81-90" },
                { case: { $lte: ["$edad", 99] }, then: "91-99" },

                // Agregar más rangos según sea necesario
              ],
              default: "Other",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      ageRangeCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/pacientes/genderCount", async (req, res) => {
  try {
    const genderCount = await patientModel.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ genderCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/firstVisitCount/:year/:month?", async (req, res) => {
  try {
    const { year, month } = req.params;
    const matchCondition = {
      firstVisit: true,
      $expr: {
        $and: [
          { $eq: [{ $year: "$createdAt" }, parseInt(year)] },
          month ? { $eq: [{ $month: "$createdAt" }, parseInt(month)] } : true,
        ],
      },
    };

    const firstVisitCount = await patientModel.aggregate([
      { $match: matchCondition },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    res.json({
      firstVisitCount:
        firstVisitCount.length > 0 ? firstVisitCount[0].count : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/employee/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page, pageSize } = req.query;

    // Calcula el índice de inicio según la página y el tamaño de página
    const startIndex = (page - 1) * pageSize;

    const employee = await employeeModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const patients = await patientModel
      .find({ _id: { $in: employee.patients } })
      .skip(startIndex)
      .limit(pageSize);

    const totalCount = await patientModel.countDocuments({
      _id: { $in: employee.patients },
    });

    res.set("X-Total-Count", totalCount); // Envía el total de registros en la respuesta
    res.json({patients, totalCount   });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
