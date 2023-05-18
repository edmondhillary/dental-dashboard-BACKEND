// DEPENDENCIES
import Router from 'express';


// ROUTER FILES
import { register, login} from '../api/auth/auth.controller.js';
import patientRoutes  from  '../api/routers/patientsRoutes.js'
import employeesRoutes from '../api/routers/employeesRoutes.js'
// import sessionRoutes from '../api/routers/sessionRoutes.js'
import budgetRoutes from  '../api/routers/budgetRoutes.js'
import treatmentRoutes from '../api/routers/treatmentRoutes.js'
import appointmentRoutes from  '../api/routers/appointmentRoutes.js';
import authMiddleware from '../server/authMidleware.js';


// // ROUTER FILES


// // ROUTER INITIALIZING
const router = Router();

router.post('/register',register );
router.post('/login', login);
router.use('/pacientes',authMiddleware,  patientRoutes);
router.use('/empleados',authMiddleware ,employeesRoutes);
// router.use('/sesiones', sessionRoutes); //CREO NO SE NECESITA// SE TRASLADA AL PACIENTE//
router.use('/presupuestos', authMiddleware,budgetRoutes);
router.use('/tratamientos',authMiddleware, treatmentRoutes);
router.use('/citas', authMiddleware,appointmentRoutes);



export default router;