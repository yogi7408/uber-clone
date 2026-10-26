import React from 'react'
import uberlogo from '../assets/uber.svg'
import { Link } from 'react-router-dom'
const Start = () => {
  return (
   <div className='h-screen bg-cover bg-center bg-[url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDLjKU8XvV_8lNqxWuQ58swxE3z8ib4ipbXEceWWA3bA&s=10")]  pt-5 flex justify-between flex-col w-full bg-red-400'>
    <img src={uberlogo} alt="uber logo" className='w-16 ml-5' />
    <div className='bg-white py-5 px-10 pb-7 '>
     <h2 className='text-2xl font-bold'>Get Started with uber</h2>
     <Link to="/login" className='w-full flex items-center justify-center bg-black py-3 text-white font-bold rounded-2xl mt-2'>Continue</Link>
    </div>

   </div>
  )
}

export default Start