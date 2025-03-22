import validator from 'validator';
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js';
import razorpay from 'razorpay'

export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.json({
                success:false,
                message:'All fields are mandatory'
            })
        }
        if(!validator.isEmail(email)){
            return res.json({
                success:false,
                message:'Invalid format of Email'
            })
        }
        if(password.length < 6){
            return res.json({
                success:false,
                message:'password length should be Greater than 6'
            })
        }
        const existUser = await userModel.findOne({email});
        if(existUser) {
            return res.json({
                success:false,
                message:'Email is already in use'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password:hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);

        res.json({
            success:true,
            token,
            message: 'Account created successfully'
        })

        
    } catch (error) {
        console.error(error);
        res.json({ success:false, message: "Internal Server Error" });
    }
}

export const loginUser = async (req, res) => { 
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: 'All fields are mandatory'
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({
            success: true,
            token,
            message: 'Login successful'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');

        res.json({
            success:true,
            userData,
            message:'Data fetched successfully'
        })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const {userId, name, phone, address, dob, gender} = req.body;
        const imageFile = req.file

        if(!name || !phone || !address || !dob || !gender){
            return res.json({
                success:false,
                message:'Some Data is missing'
            })
        }

        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})

        if(imageFile){
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:'image'})

            await userModel.findByIdAndUpdate(userId, {image:imageUpload.secure_url});
        }

        res.json({
            success:true,
            message:'Profile updated Successfully',
        })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const bookAppointment = async (req, res) => {
    try {
        const {userId, docId, slotDate, slotTime} = req.body


        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({
                success:false,
                message:'Doctor Not available'
            })
        }

        let slots_booked = docData.slots_booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({
                    success:false,
                    message:'Slot not Available'
                })
            } else{
                slots_booked[slotDate].push(slotTime)
            }
        } else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appoinmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fee,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppoinment = new appointmentModel(appoinmentData);
        await newAppoinment.save()

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({
            success:true,
            message:'Appoinment Booked Successfully'
        })
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const allAppointment = async (req, res) => {
    try {
        const {userId} = req.body;
        const appointments = await appointmentModel.find({userId});

        res.json({
            success:true,
            appointments
        })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const cancelAppointment = async (req, res) => {
    try {
        const {userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);


        if(appointmentData.userId !== userId){
            return res.json({
                success:false,
                message:'Un-Authorized access'
            })
        }

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

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
})

export const paymentRazorpay = async (req, res) => {
    try {
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if(!appointmentData || appointmentData.cancelled){
            return res.json({
                success:false,
                message:'Appointment cancelled or not found'
            })
        }

        const options = {
            amount:appointmentData.amount * 100,
            currency:process.env.CURRENCY,
            receipt:appointmentId,
        }

        const order = await razorpayInstance.orders.create(options)

        res.json({
            success:true,
            order,
        })
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" });
    }
}

export const verifyPayment = async (req, res) => {
    try {

        const {razorpay_order_id} = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {payment:true})

            res.json({
                success:true,
                message:'Payment successfull'
            })
        } else{
            res.json({
                success:false,
                message:'Payment failed'
            })
        }
        
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Internal Server Error" }); 
    }
}