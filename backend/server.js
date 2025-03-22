import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDatabase from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// App Config
const app = express();
const PORT = process.env.PORT || 4000
connectDatabase();
connectCloudinary();

// Middleware
app.use(express.json())
app.use(cors())

// api endPoints
app.use('/api/admin', adminRouter);
app.use('/api/doctor', doctorRouter);
app.use('/api/user', userRouter);


app.listen(PORT, () => {
    console.log('Server Started at port Number : ', PORT);
})