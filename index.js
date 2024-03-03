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
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://environmentadmin.netlify.app",
        ],
        credentials: true,
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
        exposedHeaders: ["Set-Cookie"],
    })
);
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