import React from 'react'
import {assets} from '../assets/assets'
const About = () => {
  return (
    <div>
      <div className="text-center text-4xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12 ">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt=""
        />
        <div className="flex flex-col justify-between gap-6 md:w-3/4 text-lg text-gray-600">
          <p>
          Welcome to CareNavi, your reliable companion in navigating healthcare with ease and convenience. At CareNavi, we prioritize simplifying the process of booking doctor appointments and managing health records to give you peace of mind.
          </p>
          <p>
          CareNavi is dedicated to advancing healthcare accessibility through innovative technology. Our platform evolves continuously to offer a user-friendly experience, helping you take control of your health journey. Whether you’re arranging a consultation or tracking ongoing care, CareNavi is designed to meet your needs every step of the way.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
          At CareNavi, our vision is to revolutionize the way patients and healthcare providers connect. We strive to make healthcare accessible, efficient, and stress-free, ensuring you receive timely care when it matters most.
          </p>
        </div>
      </div>

      <div className="text-xl my-5">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-15 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
}

export default About