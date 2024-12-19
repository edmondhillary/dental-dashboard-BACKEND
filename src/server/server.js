import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import '../database/dbConnection.js'
import middleware from './middleware.js';
import router from './router.js';
import { insertarPacientes } from '../database/fakeData.js';


const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = ['https://dental-dashboard-backend-production.up.railway.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(middleware);
app.use(router);

async function start() {
//   await DBconnection('market');
// await insertarPacientes() // insertar falsos pacientes ... para comprobar como de rapido va l aaplicacion para 12.000 pacientes 

  const timelog = new Date();
  const server = app.listen(port, async () => {
    console.log(`SERVERLOG ${timelog} --> Server started on port ${port}.`);
  });

  process.on('unhandledRejection', err => {
    const timelog = new Date();
    console.error(`SERVERLOG ${timelog} --> Server has closed. An error occurred: ${err}`)
    server.close(() => process.exit(1))
  });
}

start();
