// import patientModel from "../models/patientSchema.js";
// import sessionModel from "../models/sessionSchema.js";
// import { Types } from "mongoose";
// const { ObjectId } = Types;


// async function createSession({fields}) {
//     const newSesion  = await sessionModel.create(fields);
    
//     const addSessionToPatinet = await patientModel.findOneAndUpdate({_id: fields.patient}, {$push: {sessions: newSesion._id}}, {new: true});

//     return newSesion;
// }

// async function getSessionsByQuery (filters) {
//     let regexFilter = {};
 

//     const keys = Object.keys(filters);

//     for (const key of keys) {
//       regexFilter[key] = { $regex: filters[key], $options: "-i" }; 
//     }
//     const getSessionsByFilters = await sessionModel
//       .find(regexFilter)
//       .sort({ createdAt: -1 })
//       .exec();
//     if (!getSessionsByFilters) throw new Error("No session found.");
//     return getSessionsByFilters;
//   }
// async function updateSessionById ({id, fieldsToUpdate}) {
    
//     const query = { _id: new ObjectId(id) };
//     const updateBody = { $set: fieldsToUpdate };

//     const updatedSession = await sessionModel.findOneAndUpdate(query, updateBody, {new: true});
//     return updatedSession;

// }
// async function deleteSessionById( id ) {
//     const query = { _id: new ObjectId(id) };
//     const deletedSession = await sessionModel.findOneAndDelete(query);
//     const removeSessionFromPatient = await patientModel.findOneAndUpdate({_id: deletedSession.patient}, {$pull: {sessions: deletedSession._id}}, {new: true});

//     return deletedSession;
// }

// export {createSession , getSessionsByQuery , updateSessionById, deleteSessionById}