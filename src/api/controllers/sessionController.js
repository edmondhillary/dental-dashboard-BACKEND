import sessionModel from '../models/sessionSchema.js';
import * as sessionRepo from '../repository/sesionRepo.js';

async function createSession(req, res) {
    const fields = req.body;
    try {
        const session = await sessionRepo.createSession({fields});
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json(error);
    }
}
async function getSessionsByQuery (req, res) {

    try {
        const filters = req.query;
        const sessions = await sessionRepo.getSessionsByQuery(filters);
        return res.json(sessions);
      } catch (error) {
        return res.status(error.status || 500).json(error.message);
      }

}

async function updateSessionById (req, res) {

    const { id } = req.params;
    const fieldsToUpdate = req.body;

    try{
        const session = await sessionRepo.updateSessionById({id, fieldsToUpdate});
        res.json(session);
    }
    catch (error) {
        return res.status(error.status || 500).json(error.message);
    }
}

async function deleteSessionById(req, res) {
  
    const { id } = req.params;

    try {
        const session = await sessionRepo.deleteSessionById({id});
        res.write('ELIMINÓ LA SESION CON EXITO!!');
        res.end();
    } catch (error) {
        return res.status(error.status || 500).json(error.message);
    }
}

export {createSession, getSessionsByQuery, updateSessionById, deleteSessionById};