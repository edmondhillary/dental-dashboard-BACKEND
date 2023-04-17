import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import patientModel from '../models/patientSchema.js';
import appointmentsModel from '../models/appointmentsSchema.js';
import employeeModel from '../models/employeeSchema.js';


const router = express.Router();

router.post('/', appointmentController.createAppointment);
// router.get('/', appointmentController.getAppointmentsByQuery);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointmentById);
router.delete('/:id', appointmentController.deleteAppointmentById);

//RUT de todas las citas que tiene/ ha tenido un paciente//
router.get('/pacientes/:id/', async (req, res) => {
    const idPaciente = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
  
    try {
      const paciente = await patientModel.findById(idPaciente);
      if (!paciente) {
        console.log(paciente.teeth[11])
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
  
      const totalConsultas = paciente.appointments.length;
      const skip = (page - 1) * limit;
  
      const consultas = await appointmentsModel.find({ _id: { $in: paciente.appointments } })
        .skip(skip)
        .limit(limit)
  
      res.json({
        total: totalConsultas,
        limit,
        page,
        consultas
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
// TODAS LAS CITAS QUE TIENE UN EMPLEADO , AUNQEU CREO QUE ES MAS COMPLETA LA RUTA DE POR FECHAS //
router.get('/empleados/:id/', async (req, res) => {
    const idEmpleado = req.params.id;
    const limit = parseInt(req.query.limit) || 5;
    const page = parseInt(req.query.page) || 1;
  
    try {
      const empleado = await employeeModel.findById(idEmpleado);
      if (!empleado) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
  
      const totalConsultas = empleado.appointments.length;
      const skip = (page - 1) * limit;
  
      const consultas = await appointmentsModel.find({ _id: { $in: empleado.appointments } })
        .skip(skip)
        .limit(limit)
  
      res.json({
        total: totalConsultas,
        limit,
        page,
        consultas
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
// citas que tiene un empleeado desde una fecha hasta otra, esto se ve en el front con: desde qeu fecha hasta que fecha quieres ver ???//
router.get('/empleados/:id/citas', async (req, res) => {

    //IMPORTANTE, PASAR FECHA EN ESTE FORMATO: 
    // localhost:4002/citas/empleados/64353dce2bd6ac06de6df581/citas?fechaInicio=2023-04-01T12:00:00&fechaFin=2023-07-31T12:00:00//
    //HORAS MINUTOS Y SEGUNDOS //
    const idEmpleado = req.params.id;
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
  
    try {
      const empleado = await employeeModel.findById(idEmpleado);
      if (!empleado) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }
  
      const citas = await appointmentsModel.find({
        employee: empleado._id,
        fechaInicio: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      }).sort({ fechaInicio: -1 });
      // si quisieras ordenarlas del reves aqui en citas le an1ades : .sort({ fechaInicio: -1 })//
  
      res.json(citas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
    console.log('I',fechaInicio,'F', fechaFin)
  });
  router.get('/citas', async (req, res) => {
    const fechaInicio = req.query.fechaInicio;
    const fechaFin = req.query.fechaFin;
  
    try {
      const citas = await appointmentsModel.find({
        fechaInicio: {
          $gte: new Date(fechaInicio),
          $lte: new Date(fechaFin)
        }
      }).sort({ fechaInicio: -1 });
  
      const citasPorMes = {};
  
      citas.forEach(cita => {
        const fecha = cita.fechaInicio.toISOString().slice(0, 7);
        if (!citasPorMes[fecha]) {
          citasPorMes[fecha] = [];
        }
        citasPorMes[fecha].push(cita);
      });
  
      res.json(citasPorMes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
export default router;
