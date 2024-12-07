import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";
import dotenv from 'dotenv'
import userRoute from "./routes/user.route.js"
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    credentials:true ,//access-control-allow-credentials:true
}
app.use(cors(corsOptions))
const PORT = process.env.PORT || 3000;

// api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

app.listen(PORT, () =>{
    connectDB();
    console.log(`Server running at ${PORT}`);
})