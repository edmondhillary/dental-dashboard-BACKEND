import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

MONGO_DB_NAME = "dentalClinic"
const MONGO_URL_DENTAL_CLINIC = 'mongodb+srv://root:rootroot@cluster0.5qgofue.mongodb.net/?retryWrites=true&w=majority'; // Reemplaza <password> con la contraseña correcta
const connectionConfig = { dbName: MONGO_DB_NAME, autoIndex: true };
const connection = await mongoose.connect(MONGO_URL_DENTAL_CLINIC, connectionConfig);

if (connection) {
  console.log('CONNECTION with MongoDB database successfully');
} else {
  console.error('Error connecting to MongoDB database');
}

// Resto del código...
