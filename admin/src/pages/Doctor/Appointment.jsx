import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/doctorContext'
import { assets } from '../../assets/assets_admin/assets';
import { AppContext } from '../../context/AppContext';
import { AdminContext } from '../../context/AdminContext';


const Appointment = () => {

    const {dToken, appointments, setAppointments, getAppointments, markCompleted, markCancel,} = useContext(DoctorContext);

    const {cancelAppointment} = useContext(AdminContext);

    useEffect(() => {
        if(dToken) getAppointments();
        console.log(appointments);
    }, [dToken])

    const {calculateAge} = useContext(AppContext)

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }


  return appointments.length && (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded min-h-[50vh] text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100'>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{item.payment ? 'Online ' : 'Cash'}</p>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormate(item.slotDate)}, {item.slotTime}</p>
            <p>${item.docData.fee}</p>
            <div className='flex'>
            {item.isCompleted?<p className='text-green-400 text-sm font-medium px-2'>Completed</p> : 
            item.cancelled?
            <p className='text-red-400 text-sm font-medium px-2'>Cancelled</p>
            :<><img onClick={() =>markCancel(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
            <img onClick={() =>markCompleted(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
            </>
            }
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default Appointment
