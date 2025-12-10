const express = require("express");
require("dotenv").config(); // A .env fájlt olvassa
const trainingsRoutes = require('./routes/trainings.routes')
const coursesRoutes = require('./routes/courses.routes')

const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
mongoose.set("strictQuery", true);
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log(`Database Connected ${database.host}`);
});
const app = express()
app.use(express.json())

app.use(fileUpload());

app.use(express.static('public'));

app.use("/api/trainings", trainingsRoutes);
app.use("/api/courses", coursesRoutes);

app.listen(3000, ()=>{
    console.log('Server started')
})