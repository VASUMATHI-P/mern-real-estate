import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import path from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO)
        .then(() => {
          console.log('Connected to MongoDB');
        }).catch((err) => {
          console.log('Error connecting to MongoDB:', err);
        })

const __dirname = path.resolve();

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', () => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html')); 
})

app.use((err, req, res, next) => {
  const success = false;
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ statusCode, message, success });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
})