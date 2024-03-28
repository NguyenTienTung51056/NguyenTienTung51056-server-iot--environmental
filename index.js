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
import { publishMessage } from './utils/publishMessage.js';
const PORT = process.env.PORT || 8080;

//aloww cors
app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://environmentadmin.netlify.app",
            "https://environmentadmin.netlify.app/",
            "https://environmentadmin.netlify.app/managertrash",
            "https://environmentadmin.netlify.app/managertrash/detailtrash",
            "https://environmentadmin.netlify.app/managertrash/detailtrash/:id",
            "https://environmentadmin.netlify.app/managertrash/addtrash",
            "https://environmentadmin.netlify.app/managertrash/editrash",
            "https://environmentadmin.netlify.app/managertrash/editrash/:id",
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

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});

//router
route(app);

setInterval(publishMessage, 4000);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});