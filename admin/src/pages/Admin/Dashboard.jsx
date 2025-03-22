import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { assets } from '../../assets/assets_admin/assets';

const Dashboard = () => {

  const {dashData, getDashboardData, cancelAppointment, aToken} = useContext(AdminContext);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormate = (slotDate) => {
    const dateArray = slotDate.split('_');
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
  }
  


  useEffect(() => {
    if(aToken) getDashboardData();
  }, [aToken])

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300'>
          <img className='w-14 ' src={assets.doctor_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300'>
          <img className='w-10' src={assets.appointment_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all duration-300'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.users}</p>
            <p className='text-gray-400'>Users</p>
          </div>
        </div>
      </div>

      <div className='bg-white '>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Booking</p>
        </div>

        <div className='pt-4 border border-t-0'>
          {Array.isArray(dashData.latestAppointments) && dashData.latestAppointments.map((item, index) => (
            <div key={index} className='flex items-center px-6 gap-3 py-3 hover:bg-gray-100 '>
              <img className='rounded-full w-10' src={item.docData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.docData.name}</p>
                <p className='text-gray-600'>{slotDateFormate(item.slotDate)}, {item.slotTime}</p>
              </div>
              {item.cancelled?
            <p className='text-red-400 text-sm font-medium'>Cancelled</p>
            :<img onClick={() =>cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
            }
            </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
