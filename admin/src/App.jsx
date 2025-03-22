import React, { useContext } from "react";
import Login from "./pages/Login";
import { Toaster } from 'react-hot-toast'

import { AdminContext } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllApointment from "./pages/Admin/AllApointment";
import AddDoctor from "./pages/Admin/AddDoctor";
import DoctorsList from "./pages/Admin/DoctorsList";
import { DoctorContext } from "./context/doctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import Profile from "./pages/Doctor/Profile";
import Appointment from "./pages/Doctor/Appointment";

const App = () => {

  const {aToken} = useContext(AdminContext);
  const {dToken} = useContext(DoctorContext);

  return aToken || dToken ? (
    <div className="bg-[#F8F9FD]">
      <Toaster />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>}/>

          <Route path="/admin-dashboard" element={<Dashboard />}/>
          <Route path="/all-apointments" element={<AllApointment />}/>
          <Route path="/add-doctor" element={<AddDoctor />}/>
          <Route path="/doctor-list" element={<DoctorsList />}/>

          <Route path="/doctor-dashboard" element={<DoctorDashboard />}/>
          <Route path="/doctor-profile" element={<Profile />}/>
          <Route path="/doctor-appointment" element={<Appointment />}/>
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <Toaster />
    </>
  )
};

export default App;
