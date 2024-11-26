import React, { useMemo, useState, useEffect, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import {assets} from '../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
const MyProfile = () => {

  const allergyOptions = [
    'Pollen',
    'Dust',
    'Pet Dander',
    'Mold',
    'Latex',
    'Insect Stings',
    'Food Allergies (e.g., Nuts, Shellfish)',
    'Medication Allergies',
    'Environmental Allergies (e.g., Pesticides)',
    'Other'
  ]

  const {userData, setUserData, token, backendUrl, loadUserProfileData} = useContext(AppContext)

  // const [userData,setUserData] = useState({
  //   name: 'Rafi Mozumder',
  //   age: '23',
  //   gender: 'Male',
  //   email: 'rafimozumder@gmail.com',
  //   phone: '+880 12345678',
  //   address: {
  //     line1:'Ovijan 29/4 College Road',
  //     line2:'College Gate, Tongi, Gazipur'
  //   },
  //   dob: '2000-11-18',
  //   bloodGroup: 'A+',
  //   medicalHistory: '',
  //   allergies: JSON.parse(localStorage.getItem('allergies')) || [],
  //   medications: '',
  //   familyHistory: '',
  //   image: assets.profile_pic
  // })

  const [isEdit, setIsEdit] = useState(false)
  const [image, setImage] = useState(false)

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData()

      formData.append('name', userData.name)
      formData.append('phone', userData.phone)
      formData.append('address', JSON.stringify(userData.address))
      // formData.append('gender', userData.gender) // Keep this line
      formData.append('dob', userData.dob)
      formData.append('age', userData.age)
      formData.append('gender', userData.gender)
      formData.append('bloodGroup', userData.bloodGroup)
      formData.append('allergies', JSON.stringify(userData.allergies)); // Ensure array is sent as string
      formData.append('medications', userData.medications)
      formData.append('familyHistory', userData.familyHistory)

      image && formData.append('image', image)

      const {data} = await axios.post(backendUrl + '/api/user/update-profile',formData,{headers:{token}})

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        setIsEdit(false)
        setImage(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // Storing the selected allergies in the localStorage
  // const memoizedAllergies = useMemo(() => {
  //   return allergyOptions.map((allergy) => ({
  //     allergy,
  //     selected: userData.allergies.includes(allergy),
  //   }));
  // }, [userData.allergies]);

  // useEffect(() => {
  //   localStorage.setItem('allergies', JSON.stringify(userData.allergies));
  // }, [userData.allergies]);

  const handleAllergyChange = (e, allergy) => {
    const selectedAllergies = e.target.checked
      ? [...userData.allergies, allergy] // Add allergy if checked
      : userData.allergies.filter(a => a !== allergy); // Remove allergy if unchecked

    setUserData(prev => ({ ...prev, allergies: selectedAllergies }));
  };


  return userData && (
    <div className='max-w-lg flex flex-col gap-2 text-sm'>

        {
          isEdit 
          ? <label htmlFor="image">
            <div className='inline-block relative cursor-pointer'>
              <img className='w-36 rounded opacity-75' src={image ? URL.createObjectURL(image): userData.image} alt="" />
              <img className='w-10 absolute bottom-12 right-12' src={image ? '': assets.upload_icon } alt="" />
            </div>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" id="image" hidden />
          </label>
          : <img className='w-36 rounded' src={userData.image} alt=''/>

        }


        {
          isEdit 
          ?  <input className='bg-gray-50 text-3xl font-medium max-w-60 mt-4' type='text' value={userData.name} onChange={e => setUserData(prev => ({...prev,name:e.target.value}))} />
          : <p className='font-medium text-3xl text-neutral-800 mt-4'>{userData.name}</p>
        }

        <hr className='bg-zinc-400 h-[1px] border-none'/>

        <div>
          <p className='text-neutral-500 underline mt-3'>CONTACT INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Email id:</p>
            <p className='text-blue-500'>{userData.email}</p>
            <p className='font-medium'>Phone:</p>
            {
              isEdit 
              ?  <input className='bg-gray-100 max-w-52' type='text' value={userData.phone} onChange={e => setUserData(prev => ({...prev,phone:e.target.value}))} />
              : <p className='text-blue-400'>{userData.phone}</p>
            }
            <p className='font-medium'>Address:</p>
            {
              isEdit 
              ? <p>
                <input className='bg-gray-50' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line1: e.target.value}}))} value={userData.address.line1} type='text' />
                <br/>
                <input className='bg-gray-50' onChange={(e) => setUserData(prev => ({...prev, address: {...prev.address, line2: e.target.value}}))} value={userData.address.line2} type='text' />
              </p>
              : <p className='text-gray-500'>
                {userData.address.line1}
                <br/>
                {userData.address.line2}
              </p>
            }
          </div>
        </div>

        <div>
          <p className='text-neutral-500 underline mt-3'>BASIC INFORMATION</p>
          <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
            <p className='font-medium'>Gender:</p>
            {
              isEdit 
              ?  <select className='max-w-20 bg-gray-100' onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} value={userData.gender}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              : <p className='text-gray-400'>{userData.gender}</p>
            }
            <p className='font-medium'>Birthday:</p>
            {
              isEdit 
              ? <input className='max-w-28 bg-gray-100' type='date' onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))} value={userData.dob} />
              : <p className='text-gray-400'>{userData.dob}</p>
            }

            <p className='font-medium'>Age:</p>
            {
              isEdit 
              ? <input className='max-w-12 bg-gray-100' type='number' onChange={(e) => setUserData(prev => ({...prev, age: e.target.value}))} value={userData.age} />
              : <p className='text-gray-400'>{userData.age}</p>
            }

            <p className='font-medium'>Blood Group:</p>
            {
              isEdit 
              ? <select className='max-w-12 bg-gray-100' onChange={(e) => setUserData(prev => ({...prev, bloodGroup: e.target.value}))} value={userData.bloodGroup}>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+-">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O-">O-</option>
              <option value="O+">O+</option>
              </select>
              : <p className='text-gray-400'>{userData.bloodGroup}</p>
            }

            <p className='font-medium'>Allergies:</p>
            {
              isEdit 
              ? <div className='max-w-fit max-h-40 overflow-y-scroll bg-gray-100 px-2 py-2'>
                  {allergyOptions.map(allergy => (
                  <div key={allergy} className='flex items-center'>
                    <input
                      className='mr-2'
                      type='checkbox'
                      value={allergy}
                      checked={userData.allergies.includes(allergy)}
                      onChange={(e) => handleAllergyChange(e, allergy)}
                    />
                    <label>{allergy}</label>
                  </div>
                ))}
                </div>
              : <p className='text-gray-400'>{userData.allergies.join(', ')}</p>
            }
          </div>
        </div>

        <div className='mt-10'>
          {
            isEdit 
            ? <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={updateUserProfileData}>Save information</button>
            : <button className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all' onClick={()=>setIsEdit(true)}>Edit</button>
          }
        </div>
    </div>
  )
}

export default MyProfile