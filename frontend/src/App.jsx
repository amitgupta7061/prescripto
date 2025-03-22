import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Login from './pages/Login'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <div className='mx-3 sm:mx-[7%]'>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />}/>
        <Route path='/doctors/:speciality' element={<Doctors />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/contact' element={<Contact />}/>
        <Route path='/my-profile' element={<MyProfile />}/>
        <Route path='/my-appointments' element={<MyAppointments />}/>
        <Route path='/appointment/:docId' element={<Appointment />}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
