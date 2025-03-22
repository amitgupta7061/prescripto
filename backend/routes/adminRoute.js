import express from "express";
import { addDoctor, adminDashboard, allDoctor, appointments, cancelAppointment, loginAdmin } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";


const adminRouter = express.Router();


adminRouter.post('/add-doctor',authAdmin, upload.single('image'),addDoctor);
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors', authAdmin, allDoctor)
adminRouter.post('/change-availability', authAdmin, changeAvailability);

adminRouter.get('/appointments', authAdmin, appointments);
adminRouter.post('/cancel-appointment', authAdmin, cancelAppointment);

adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter