import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";


export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken') : '');
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState([]);

    const [profileData, setProfileData] = useState(false);

    const getAppointments = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/appointments', {headers:{dToken}});

            console.log(data)

            if(data.success){
                setAppointments(data.appointments.reverse());
            } else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const markCompleted = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/appointment-complete', {appointmentId}, {headers:{dToken}});

            if(data.success){
                toast.success(data.message);
                getAppointments();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message); 
        }
    }

    const markCancel = async (appointmentId) => {
        try {
            const {data} = await axios.post(backendUrl+'/api/doctor/appointment-cancel', {appointmentId}, {headers:{dToken}});

            if(data.success){
                toast.success(data.message);
                getAppointments();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message); 
        }
    }

    const getDashboardData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/dashboard', {headers:{dToken}});
            
            if(data.success){
                console.log(data)
                setDashData(data.dashData)
            } else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message); 
        }
    }

    const getProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/profile', {headers:{dToken}});

            if(data.success){
                setProfileData(data.profileData)
                console.log(data.profileData)
            } else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message); 
        }
    }

    const value = {
        dToken, setDToken,
        backendUrl,
        appointments, getAppointments,
        markCompleted, markCancel,
        getDashboardData, dashData,
        getProfileData, setProfileData, profileData,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider;