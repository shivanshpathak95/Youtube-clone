import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js';

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
    connectDb();
});