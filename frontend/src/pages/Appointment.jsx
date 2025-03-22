import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import toast from "react-hot-toast";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const navigate = useNavigate();

  const daysOnWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    // Find doctor information and update state
    const docInfo = doctors.find((doc) => doc._id === docId);
    if (docInfo) {
      setDocInfo(docInfo);
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (!docInfo) return;

    const getAvailableSlot = () => {
      let today = new Date();
      let newSlots = [];

      for (let i = 0; i < 7; i++) {
        let currDate = new Date(today);
        currDate.setDate(today.getDate() + i);

        let endTime = new Date(currDate);
        endTime.setHours(21, 0, 0, 0);

        if (i === 0) {
          currDate.setHours(Math.max(currDate.getHours() + 1, 10));
          currDate.setMinutes(currDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currDate.setHours(10, 0, 0, 0);
        }

        let timeSlots = [];
        while (currDate < endTime) {
          let formattedTime = currDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

          let day = currDate.getDate();
          let month = currDate.getMonth() + 1;
          let year = currDate.getFullYear();

          const slotDate = day + "_" + month + "_" + year;
          const slotTime = formattedTime

          const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

          if(isSlotAvailable){
            timeSlots.push({
            datetime: new Date(currDate),
            time: formattedTime,
          });
          }
          

          currDate.setMinutes(currDate.getMinutes() + 30);
        }
        newSlots.push(timeSlots);
      }

      setDocSlots(newSlots);
    };

    getAvailableSlot();
  }, [docInfo]);

  const bookAppointment = async () => {
    if(!token){
      toast.error('Login to Book Appointment');
      return navigate('/login');
    }
    try {
      
      const date = docSlots[slotIndex][0].datetime
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear()
    
      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendUrl+'/api/user/book-appointment', {docId, slotDate, slotTime}, {headers:{token}});

      if(data.success){
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appointments')
      } else{
        toast.error(data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt1 text-justify">
                {docInfo.about}
              </p>
            </div>
            <p className="mt-4 text-gray-700 font-medium">
              Appointment fee:{" "}
              <span className="text-gray-800">${docInfo.fee}</span>
            </p>
          </div>
        </div>

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white "
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  <p>{item[0] && daysOnWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[slotIndex] &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button onClick={bookAppointment} className="bg-primary text-white text-sm font-light px-14 rounded-full py-3 my-6">
            Book an Appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;
