import bodyParser from 'body-parser';
import express from 'express';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import showRoutes from './routes/show.js';

const app = express();

app.use(bodyParser.json());

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
   );
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   next();
});

app.use('/auth', authRoutes);
app.use('/show', showRoutes);

app.use((error, req, res, next) => {
   console.log(error);
   const status = error.statusCode || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({ message, data });
});

mongoose
   .connect(MONGODB_URI)
   .then((result) => {
      console.log('connected to db');
      app.listen(5000);
   })
   .catch((err) => console.log(err));
