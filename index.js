const express = require('express');
require('dotenv').config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const route = require('./routes/index');
const {connectMqtt} = require('./config/mqtt');

const  connectDB  = require('./config/db');

const PORT = process.env.PORT || 8080;


//connect to mongodb
connectDB.connectDB();

//connect to mqtt
connectMqtt();

app.use(cookieParser());
app.use(express.json());


//router
route(app);

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});