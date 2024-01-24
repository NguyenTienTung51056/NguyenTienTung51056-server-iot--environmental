import express from 'express';
import dotenv from 'dotenv';
const app = express();
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import route from './routes/index.js';
import { connectMqtt } from './config/mqtt.js';
import connectDB from './config/db.js';
import { initializeFirebaseApp } from './config/firebase.js';
const PORT = process.env.PORT || 8080;

//aloww cors
app.use(cors());
initializeFirebaseApp();

//connect to mongodb
connectDB()

//connect to mqtt
connectMqtt();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//router
route(app);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});