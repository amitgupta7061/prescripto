import {React, useContext, useEffect} from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext';
import {assets} from '../../assets/assets_admin/assets'

const AllApointment = () => {

  const {appointments, setAppointments, getAllAppointments, aToken, cancelAppointment} = useContext(AdminContext);

  const {calculateAge} = useContext(AppContext)
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }

  useEffect(() => {
    if(aToken){
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>
      <div className='bg-white border rounded min-h-[60vh] text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {appointments.map((item, index) => (
          <div key={index} className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-100'>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 h-8 rounded-full' src={item.userData.image} alt="" />
              <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormate(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img className='w-8 rounded-full bg-gray-200' src={item.docData.image} alt="" />
              <p>{item.docData.name}</p>
            </div>
            <p>${item.docData.fee}</p>
            {item.cancelled?
            <p className='text-red-400 text-sm font-medium'>Cancelled</p>
            :<img onClick={() =>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
            }
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllApointment
