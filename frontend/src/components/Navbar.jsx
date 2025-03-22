import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets_frontend/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Navbar = () => {

    const location = useLocation();
    const [showmenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const {token, setToken, userData} = useContext(AppContext);


    const logout = () => {
      setToken(false);
      localStorage.removeItem('token');
      toast.success('Logout successfull')
      navigate('/')
    }

  return (
    <div className='flex items-center justify-between text-sm py-3 border-b border-b-gray-400 mb-4'>
      <img onClick={() => navigate('/')} className='w-32 cursor-pointer' src={assets.logo} alt="" />

      <ul className='hidden md:flex items-start gap-5 font-medium'>
        <Link to={'/'} className={`${location.pathname == '/' ? 'text-primary' : ''}`}>HOME</Link>
        <Link to={'/doctors'} className={`${location.pathname.startsWith('/doctors') ? 'text-primary' : ''}`}>ALL DOCTORS</Link>
        <Link to={'/about'} className={`${location.pathname == '/about' ? 'text-primary' : ''}`}>ABOUT</Link>
        <Link to={'/contact'} className={`${location.pathname == '/contact' ? 'text-primary' : ''}`}>CONTACT</Link>
      </ul>

      <div className='flex items-center gap-4'>
        { token ? 
        <div className='flex items-center gap-2 cursor-pointer group relative'>
            <img className='w-8 h-8 rounded-full' src={userData?.image ? userData.image : assets.profile_icon} alt="" />
            <img className='w-2.5 ' src={assets.dropdown_icon} alt="" />

            <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                    <Link to={'/my-profile'} className='hover:text-black cursor-pointer duration-300'>My Profile</Link>
                    <Link to={'/my-appointments'} className='hover:text-black cursor-pointer duration-300'>My Appointments</Link>
                    <p onClick={logout} className='hover:text-black cursor-pointer duration-300'>Logout</p>
                </div>
            </div>
        </div> : 
        <Link to={'/login'} className='bg-primary text-white px-8 py-2 rounded-full font-light hidden md:block'>Create Account</Link>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 md:hidden' src={assets.menu_icon} alt="" />

        <div className={`${showmenu ? 'fixed w-full' : 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img className='w-36' src={assets.logo} alt="" />
            <img className='w-7' onClick={() => setShowMenu(false)} src={assets.cross_icon} alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <Link to={'/'} onClick={() => setShowMenu(false)} className={`${location.pathname == '/' ? 'text-primary' : ''} px-4 py-2 rounded inline-block`}>HOME</Link>
            <Link to={'/doctors'} onClick={() => setShowMenu(false)} className={`${location.pathname.startsWith('/doctors') ? 'text-primary' : ''} px-4 py-2 rounded inline-block`}>ALL DOCTORS</Link>
            <Link to={'/about'} onClick={() => setShowMenu(false)} className={`${location.pathname == '/about' ? 'text-primary' : ''} px-4 py-2 rounded inline-block`}>ABOUT</Link>
            <Link to={'/contact'} onClick={() => setShowMenu(false)} className={`${location.pathname == '/contact' ? 'text-primary' : ''} px-4 py-2 rounded inline-block`}>CONTACT</Link>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar


