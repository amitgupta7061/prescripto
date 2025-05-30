import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AddDoctor = () => {

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fee, setFee] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [about, setAbout] = useState('');

  const { backendUrl, aToken} = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if(!docImg) {
        return toast.error('Image not selected');
      }

      const formData = new FormData();
      formData.append('image', docImg)
      formData.append('name', name)
      formData.append('email', email)
      formData.append('password', password)
      formData.append('degree', degree)
      formData.append('speciality', speciality)
      formData.append('experience', experience)
      formData.append('fee', Number(fee))
      formData.append('about', about)
      formData.append('address', JSON.stringify({line1:address1, line2:address2}))

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor', formData, {headers : {aToken}});

      if(data?.success){
        toast.success(data.message);
        setDocImg(false);
        setName('');
        //setPassword('');
        //setEmail('');
        //setDegree('');
        setSpeciality('');
        setFee('');
        setAbout('');
        setAddress1('');
        setAddress2('');
        setExperience('');
      } else{
        toast.error(data.message);
      }
      

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Please try again.");
    }

  }
  

  return (
    <form onSubmit={onSubmitHandler} className='m-5 w-full'>
      <p className='mb-3 text-lg font-medium'>Add Doctor</p>
      <div className='bg-white px-8 py-8 border w-full max-w-4xl max-h-[80vh] overflow-y-scroll'>
        <div className='flex items-center gap-4 mb-8 text-gray-500'>
          <label htmlFor="doc-img">
            <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
          </label>
          <input onChange={(event) => setDocImg(event.target.files[0])} type="file" id='doc-img' hidden/>
          <p>Upload picture</p>
        </div>

        <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Name</p>
              <input onChange={(event) => setName(event.target.value)} value={name} className='border rounded px-3 py-2 outline-none' type="text" placeholder='Name' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Email</p>
              <input onChange={(event) => setEmail(event.target.value)} value={email} className='border rounded px-3 py-2 outline-none' type="email" placeholder='Email' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Password</p>
              <input onChange={(event) => setPassword(event.target.value)} value={[password]} className='border rounded px-3 py-2 outline-none' type="password" placeholder='Password' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Experience</p>
              <select onChange={(event) => setExperience(event.target.value)} value={experience} className='border rounded px-3 py-2 outline-none' name="" id="" required>
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Fees</p>
              <input onChange={(event) => setFee(event.target.value)} value={fee} className='border rounded px-3 py-2 outline-none' type="number" placeholder='Doctor Fees' required/>
            </div>
          </div>

          <div className='w-full lg:flex-1 flex flex-col gap-4'>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Speciality</p>
              <select onChange={(event) => setSpeciality(event.target.value)} value={speciality} className='border rounded px-3 py-2 outline-none' name="" id="" required>
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Education</p>
              <input onChange={(event) => setDegree(event.target.value)} value={degree} className='border rounded px-3 py-2 outline-none' type="text" placeholder='Education' required/>
            </div>
            <div className='flex-1 flex flex-col gap-1'>
              <p>Address</p>
              <input onChange={(event) => setAddress1(event.target.value)} value={address1} className='border rounded px-3 py-2 outline-none' type="text" placeholder='address 1' required/>
              <input onChange={(event) => setAddress2(event.target.value)} value={address2} className='border rounded px-3 py-2 outline-none mt-2' type="text" placeholder='address 2' required/>
            </div>
          </div>
        </div>

        <div>
          <p className='mt-4 mb-2'>About Doctor</p>
          <textarea onChange={(event) => setAbout(event.target.value)} value={about} className='border rounded px-3 py-2 outline-none w-full' rows={5} placeholder='Write about doctor' required/>
        </div>

        <button className='bg-primary px-8 py-2 mt-4 text-white rounded-full'>Add Doctor</button>

      </div>
    </form>
  )
}

export default AddDoctor
