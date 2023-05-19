import express from "express";
import * as appointmentController from "../controllers/appointmentController.js";
import patientModel from "../models/patientSchema.js";
import appointmentsModel from "../models/appointmentsSchema.js";
import employeeModel from "../models/employeeSchema.js";
import { isAdmin } from "../auth/auth.controller.js";

const router = express.Router();

router.post("/", isAdmin,  appointmentController.createAppointment);
// router.get('/', appointmentController.getAppointmentsByQuery);
router.get("/:id", appointmentController.getAppointmentById);
router.put("/:id", isAdmin,  appointmentController.updateAppointmentById);
router.delete("/:id", isAdmin,  appointmentController.deleteAppointmentById);

//RUT de todas las citas que tiene/ ha tenido un paciente//
router.get("/pacientes/:id/", async (req, res) => {
  const idPaciente = req.params.id;
  const limit = parseInt(req.query.limit) || 10000;
  const page = parseInt(req.query.page) || 1;

  try {
    const paciente = await patientModel.findById(idPaciente);
    if (!paciente) {
      console.log(paciente.teeth[11]);
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    const totalConsultas = paciente.appointments.length;
    const skip = (page - 1) * limit;

    const consultas = await appointmentsModel
      .find({ _id: { $in: paciente.appointments } })
      .populate("employee", "firstName lastName _id ")
      .skip(skip)
      .limit(limit)
      .populate("patient", "firstName lastName _id phone ");

    res.json({
      total: totalConsultas,
      limit,
      page,
      consultas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// TODAS LAS CITAS QUE TIENE UN EMPLEADO , AUNQEU CREO QUE ES MAS COMPLETA LA RUTA DE POR FECHAS //
router.get("/empleados/:id/", async (req, res) => {
  const idEmpleado = req.params.id;
  const limit = parseInt(req.query.limit) || 50000;
  const page = parseInt(req.query.page) || 1;

  try {
    const empleado = await employeeModel.findById(idEmpleado);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const totalConsultas = empleado.appointments.length;
    const skip = (page - 1) * limit;

    const consultas = await appointmentsModel
      .find({ _id: { $in: empleado.appointments } })
      .skip(skip)
      .limit(limit)
      .populate("employee", "firstName lastName _id ")
      .populate("patient", "firstName lastName _id phone ");

    res.json({
      total: totalConsultas,
      limit,
      page,
      consultas,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// citas que tiene un empleeado desde una fecha hasta otra, esto se ve en el front con: desde qeu fecha hasta que fecha quieres ver ???//
router.get("/empleados/:id/citas", async (req, res) => {
  //IMPORTANTE, PASAR FECHA EN ESTE FORMATO:
  // localhost:4002/citas/empleados/64353dce2bd6ac06de6df581/citas?fechaInicio=2023-04-01T12:00:00&fechaFin=2023-07-31T12:00:00//
  //HORAS MINUTOS Y SEGUNDOS //
  const idEmpleado = req.params.id;
  const fechaInicio = req.query.fechaInicio;
  const fechaFin = req.query.fechaFin;

  try {
    const empleado = await employeeModel.findById(idEmpleado);
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const citas = await appointmentsModel
      .find({
        employee: empleado._id,
        fechaInicio: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin),
        },
      })
      .sort({ fechaInicio: -1 })
      .populate("employee", "firstName lastName _id ");
    // si quisieras ordenarlas del reves aqui en citas le an1ades : .sort({ fechaInicio: -1 })//

    res.json(citas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  console.log("I", fechaInicio, "F", fechaFin);
});

router.get("/citas/all", async (req, res) => {
  try {
    const appointments = await appointmentsModel
      .find({})
      .populate("employee", "firstName lastName _id ")
      .populate("patient", "firstName lastName _id phone ");
    res.json(appointments);
    console.log(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/citas/count/:year/:month?", async (req, res) => {
  try {
    const { year, month } = req.params;
    const matchCondition = {
      $expr: {
        $and: [
          { $eq: [{ $year: "$fechaInicio" }, parseInt(year)] },
          month ? { $eq: [{ $month: "$fechaInicio" }, parseInt(month)] } : true,
        ],
      },
    };

    const countPerMonth = await appointmentsModel.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: {
            year: { $year: "$fechaInicio" },
            month: { $month: "$fechaInicio" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      countPerMonth,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
