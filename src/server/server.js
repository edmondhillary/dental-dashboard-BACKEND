import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
// import { DBconnection } from '../database/database.connection.js';
// import { auth } from '../api/auth/auth.controller.js';
// import middleware from './middleware.js';
// import router from './router.js';
// import swaggerUI from 'swagger-ui-express';
// import swaggerDoc from './swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/docs', swaggerUI.serve, (...args) => swaggerUI.setup(swaggerDoc)(...args));
app.use(express.json());
app.use(auth);
app.use(middleware);
app.use(router);

async function start() {
  await DBconnection('market');
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
