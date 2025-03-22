import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/doctor/list')
            if(data.success){
                setDoctors(data.doctors);
            } else{
                toast.error(data.message);
            }
        } catch (error) {
            console.log('Error while fetching doctor data')
            toast.error('Error while fetching doctor data')
        }
    }

    const loadUserProfileData = async () => {
        try {
            const {data} = await axios.get(backendUrl+'/api/user/get-profile', {headers:{token}});

            if(data.success){
                setUserData(data.userData)
            } else{
                toast.error(data.message);
            }
            
        } catch (error) {
            console.log('Error while fetching doctor data')
            toast.error('Error while fetching profile data')
        }
    }



    useEffect(() => {
       getDoctorsData(); 
    })

    useEffect(() => {
        if(token){
            loadUserProfileData()
        } else{
            setUserData(false);
        }
    }, [token])


    const value = {
        doctors, getDoctorsData,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider