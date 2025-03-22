import validator from 'validator';
import doctor from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';

export const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fee, address } = req.body;
        const imageFile = req.file;

        
        if (!name || !email || !password || !speciality || !fee || !address || !degree || !experience || !about) {
            return res.json({ success:false, message: "All required fields must be filled!" });
        }

        if(!validator.isEmail(email)){
            return res.json({success:false, message: "Enter valid Email" });
        }

        if(password.length < 6){
            return res.json({success:false, message: "Enter Strong password" });
        }
        const existingDoctor = await doctor.findOne({ email });
        if (existingDoctor) {
            return res.json({success:false, message: "Doctor with this email already exists!" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"});


        const newDoctor = new doctor({
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fee,
            address:JSON.parse(address),
            date:Date.now(),
            image: imageUpload.secure_url, 
            available:true,
        });

        // Save doctor to database
        await newDoctor.save();

        res.json({ 
            success:true,
            message: "Doctor added successfully!", 
            doctor: newDoctor 
        });

    } catch (error) {
        console.error(error);
        res.json({success:false, message: "Internal Server Error" });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({ message: "All fields required" });
        }

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({ success:true, message: "Admin Login Successfully", token });

        } else{
            return res.json({ success:false, message: "Invalid Credentials" }); 
        }
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const allDoctor = async (req, res) => {
    try {
        const doctors = await doctor.find({}).select('-password');
        return res.json({
            success:true,
            doctors,
        })

    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const appointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});

        res.json({
            success:true,
            appointments,
        })
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const cancelAppointment = async (req, res) => {
    try {
        const {appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);


        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        const {docId, slotDate, slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, {slots_booked});

        res.json({
            success:true,
            message:"Appointment deleted successfully"
        })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            users:users.length,
            latestAppointments:appointments.reverse().slice(0, 5)
        }

        res.json({
            success:true,
            dashData,
        })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });  
    }
}