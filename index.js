const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");
const morgan = require("morgan")

//route import
const userRoute = require("./routes/userRoute.js");
const jobsRoute = require("./routes/jobsRoute.js")
const errorMiddleware = require("./middleware/errorMiddleware.js");


//dotENV config
dotenv.config()

//mongodb connection 
connectDB();

app.use(express.json());
app.use(morgan("combined"));
app.use("/api/user", userRoute)
app.use("/api/job", jobsRoute)


//validation middleware

app.use(errorMiddleware)



//port

const PORT = process.env.PORT || 8080;

app.listen(PORT, function () {
    console.log(`node server is running on port no ${PORT}`);
});