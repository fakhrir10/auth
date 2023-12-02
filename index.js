import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import router from "./routes/index.js";

dotenv.config();
const app=express();
try {
    await db.authenticate();
    console.log("db...");
} catch (error) {
    console.error(error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);
app.listen(5000,()=>{
    console.log("aplikasi berjalan pada port 5000");
});