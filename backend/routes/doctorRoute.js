import express from "express";
import { appointmentCompleted, AppointmentsDoctor, cancelAppointment, doctorDashboard, DoctorList, doctorProfile, loginDoctor, updateDoctorProfile } from "../controllers/doctorController.js";
import { authDoctor } from "../middleware/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get('/list', DoctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, AppointmentsDoctor)

doctorRouter.post('/appointment-complete', authDoctor, appointmentCompleted);
doctorRouter.post('/appointment-cancel', authDoctor, cancelAppointment);

doctorRouter.get('/dashboard', authDoctor, doctorDashboard)

doctorRouter.get('/profile', authDoctor, doctorProfile);
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile);

export default doctorRouter

