import doctor from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'

export const changeAvailability = async (req, res) => {
    try {
        const {docId} = req.body;

        const docData = await doctor.findById(docId);
        await doctor.findByIdAndUpdate(docId, {available : !docData.available})

        res.json({
            success:true,
            message:'Availability changed'
        })
        
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const DoctorList = async (req, res) => {
    try {
        const doctors = await doctor.find({}).select(['-password', '-email']);
        return res.json({
            success:true,
            doctors,
        })

    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const loginDoctor = async (req, res) => {
    try {
        const {email, password} = req.body;
        const doctorData = await doctor.findOne({email});

        if(!doctorData){
            return res.json({
                success:false,
                message:'Invalid Credential'
            })
        }

        const isMatch = await bcrypt.compare(password, doctorData.password)
        if(isMatch){
            const token = jwt.sign({id:doctorData._id}, process.env.JWT_SECRET);

            res.json({
                success:true,
                token
            })
        } else{
            res.json({
                success:false,
                message:'Invalid Credential'
            })
        }
        
    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}

export const AppointmentsDoctor = async (req, res) => {
    try {
        const {docId} = req.body;
        const appointments = await appointmentModel.find({ docId });

        res.json({
            success: true,
            appointments,
        });

    } catch (error) {
        console.error(error);
        res.json({ message: "Internal Server Error" });
    }
}


export const cancelAppointment = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

            return res.json({
                success:true,
                message:'Appointment cancelled'
            })
        } else{
            return res.json({
                success:true,
                message:'Un-authorized access or Cancelletion fail'
            })
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const appointmentCompleted = async (req, res) => {
    try {
        const { docId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})

            return res.json({
                success:true,
                message:'Appointment completed'
            })
        } else{
            return res.json({
                success:true,
                message:'Un-authorized access or marked fail'
            })
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const doctorDashboard = async (req, res) => {
    try {
        const {docId} = req.body;
        const appointments = await appointmentModel.find({docId});

        let earning = 0;
        appointments.map((item) => {
            if(item.isCompleted || item.payment) {
                earning += item.amount;
            }
        })
        let patients = [];

        appointments.map((item) => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId);
            }
        })

        const dashData = {
            earning,
            appointments:appointments.length,
            patients:patients.length,
            latestAppointment:appointments.reverse().slice(0, 5)
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

export const doctorProfile = async (req, res) => {
    try {
        const {docId} = req.body;
        const profileData = await doctor.findById(docId).select('-password');

        res.json({
            success:true,
            profileData
        })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const updateDoctorProfile = async (req, res) => {
    try {

        const {docId, fee, address, available} = req.body;

        await doctor.findByIdAndUpdate(docId, {fee, address, available});
        res.json({
            success:true,
            message:'profile Updated'
        })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}