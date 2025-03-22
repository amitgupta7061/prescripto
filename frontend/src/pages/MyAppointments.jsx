import React, { useContext, useEffect, useState } from 'react'
import {AppContext} from '../context/AppContext'
import axios from 'axios';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom'

const MyAppointments = () => {

  const {backendUrl, token, getDoctorsData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const navigate = useNavigate()

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }


  const getUserAppointment = async () => {
    try {
      const {data} = await axios.get(backendUrl+'/api/user/all-appointment', {headers:{token}});

      if(data.success){
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment', {appointmentId}, {headers:{token}});

      console.log(data)
      if(data.success){
        toast.success(data.message);
        getUserAppointment()
        getDoctorsData()
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const initPay = (order) => {
    const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment Payment',
      desccription:'Appointment Payment',
      order_id:order.id,
      receipt:order.receipt,
      handler: async (response) => {
        console.log(response);

        try {
          const {data} = await axios.post(backendUrl+'/api/user/verify-payment', response, {headers:{token}})

          if(data.success){
            getUserAppointment();
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }

    const rzp = new window.Razorpay(options);
    rzp.open()
  }

  const AppointmentRazorpay = async (appointmentId) => {
    try {
      const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay', {appointmentId}, {headers:{token}});

      if(data.success){
        initPay(data.order)
        
      } else{
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(token){
      getUserAppointment()
    }
  }, [token])
  
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-semibold mt-1'>Address</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time</span> {slotDateFormate(item.slotDate)} | {item.slotTime}</p>
            </div>
            <div></div>
            {item.isCompleted ? <div className='flex flex-col gap-2 justify-end'><button className='text-sm text-zinc-800 text-center sm:min-w-48 py-2 border rounded bg-green-600 transition-all duration-300'>Completed</button></div>
            :
            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && <button className='text-sm text-black text-center sm:min-w-48 py-2 border rounded bg-indigo-200'>Paid</button>
              }
              {!item.cancelled && !item.payment && <button onClick={() => AppointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>
              }

              {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>
              }
              {item.cancelled && <button className='text-sm text-zinc-800 text-center sm:min-w-48 py-2 border rounded bg-red-600 transition-all duration-300'>Cancelled</button>
              }
            </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
