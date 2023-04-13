import express from 'express';
import * as sessionController from '../controllers/sessionController.js';
import patientModel from '../models/patientSchema.js';
import sessionModel from '../models/sessionSchema.js';


const router = express.Router();

// Rutas para usuarios autenticados

router.post('/', sessionController.createSession);
router.get('/', sessionController.getSessionsByQuery);
// router.get('/pacientes/:id', sessionController.getSessionsByPatientId);
router.put('/:id', sessionController.updateSessionById);
router.delete('/:id', sessionController.deleteSessionById);
// router.get('/uncompleted', sessionController.getUncompletedSessions);

// Rutas para super administradores

router.get('/pacientes/:id/', async (req, res) => {
    const idPaciente = req.params.id; //se PASAN POR QUERYS EN LA URL EL LIMITE Y LAS PAGIUNAS !!!!== FANTASSTICOOOO// 
    const limit = parseInt(req.query.limit) || 5; // límite de elementos por página
    const page = parseInt(req.query.page) || 1; // página actual
  
    try {
      const paciente = await patientModel.findById(idPaciente);
      if (!paciente) {
        return res.status(404).json({ message: 'Paciente no encontrado' });
      }
  
      const totalSesiones = paciente.sessions.length;
      const skip = (page - 1) * limit; // número de elementos para saltar
  
      const sesiones = await sessionModel.find({ _id: { $in: paciente.sessions } })
        .skip(skip)
        .limit(limit)
        
  
      res.json({
        total: totalSesiones,
        limit,
        page,
        sesiones
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
export default router;
