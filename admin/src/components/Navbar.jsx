import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import {assets} from '../assets/assets_admin/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/doctorContext'

const Navbar = () => {

    const navigate = useNavigate()
    const {aToken, setAToken} = useContext(AdminContext);
    const {dToken, setDToken} = useContext(DoctorContext);

    const logOut = () => {
      navigate('/');
      aToken && setAToken('')
      aToken && localStorage.removeItem('aToken')

      dToken && setDToken('')
      dToken && localStorage.removeItem('adToken')

    }

    return (
      <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-[1px] border-b-white'>
        <div className='flex items-center gap-2 text-sm'>
            <img className='w-28 sm:w-36 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 rounded-full py-0.5 border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logOut} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
      </div>
    )
}

export default Navbar
