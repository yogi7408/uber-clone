
import React, { useState, useContext } from 'react'
import { Link,useNavigate } from 'react-router-dom'

import axios from 'axios'
import {UserDataContext} from '../context/UserContext'
const UserSignUp = () => {
  const {user,setUser}=useContext(UserDataContext)
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()

  const newUser = {
    fullName:{
      firstName: firstName,
      lastName: lastName
    },
    email,
    password
  }
    console.log(import.meta.env.VITE_BASE_URL)
  const response=await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

  if(response.status===201){
    const data = response.data
    setUser(data.user)
    localStorage.setItem('token',data.token)
    navigate('/home')
  }
 setFirstName('')
 setLastName('')
 setEmail('')
 setPassword('')
   
  }

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20 mb-8"
          src="https://thumbs.dreamstime.com/b/web-183282931.jpg"
          alt="Uber logo"
        />

        <form onSubmit={submitHandler}>
          <h3 className="text-xl font-medium mb-3">
            What's your name?
          </h3>

          <div className="flex gap-3 mb-5">
            <input
              required
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-white rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
            />

            <input
              required
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-white rounded px-4 py-2 border w-1/2 text-lg placeholder:text-base"
            />
          </div>

          <h3 className="text-xl font-medium mb-2">
            What's your email?
          </h3>

          <input
            required
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white rounded px-4 py-2 border w-full text-lg placeholder:text-base mb-5"
          />

          <h3 className="text-xl font-medium mb-2">
            Create a password
          </h3>

          <input
            required
            type="password"
            minLength={6}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-white rounded px-4 py-2 border w-full text-lg placeholder:text-base"
          />

          <button
            type="submit"
            className="bg-[#111] rounded-xl w-full py-3 text-white mt-5 mb-3"
          >
            Create Account
          </button>
        </form>

        <p className="text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default UserSignUp
