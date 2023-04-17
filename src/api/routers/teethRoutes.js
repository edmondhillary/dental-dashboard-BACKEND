import express from 'express';
import teethModel from '../models/teethSchema.js';


const router = express.Router();




// Ruta para eliminar un diente
router.delete('/teeth/:id', async (req, res) => {
  try {
    const deletedTeeth = await teethModel.findByIdAndDelete(req.params.id);

    if (!deletedTeeth) {
      return res.status(404).json({ message: 'No se encontró el diente' });
    }

    return res.status(200).json({ message: 'El diente ha sido eliminado con éxito' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});



export default router;
