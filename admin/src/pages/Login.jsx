import React, { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios'
import { toast } from 'react-hot-toast';
import { DoctorContext } from '../context/doctorContext';

const Login = () => {

    const [state, setState] = useState('Admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {setAToken, backendUrl} = useContext(AdminContext);
    const {dToken, setDToken} = useContext(DoctorContext)

    const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if(state === 'Admin'){
          const {data} = await axios.post(backendUrl + '/api/admin/login',{email, password})


          if(data?.success){
            toast.success(data.message);
            localStorage.setItem('aToken', data.token);
            setAToken(data.token);
          } else{
            toast.error(data.message)
          }
        } else{
          const {data} = await axios.post(backendUrl + '/api/doctor/login',{email, password})


          if(data?.success){
            toast.success('Login Successfully');
            localStorage.setItem('dToken', data.token);
            setDToken(data.token);
          } else{
            toast.error(data.message)
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong! Please try again.");
      }
    }


  return (
    <form onSubmit={onSubmitHandler} className="min-h-[100vh] flex items-center">
        <div className=" flex flex-col gap-5 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
          <p className="text-2xl font-semibold"><span className='text-primary'>{state}</span> Login</p>
    
          <div className="w-full">
            <p>Email</p>
            <input className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required/>
          </div>

          <div className="w-full">
            <p>Password</p>
            <input className="border border-zinc-300 rounded w-full p-2 mt-1 outline-none" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required/>
          </div>

          <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>

          {state === "Admin"
            ? <p>Doctor Login? <span className="text-primary cursor-pointer underline" onClick={() => setState('Doctor')}>ckick here</span></p> 
            : <p>Admin Login? <span className="text-primary cursor-pointer underline" onClick={() => setState('Admin')}>click here</span></p>
          }
        </div>
    </form>
  )
}

export default Login
