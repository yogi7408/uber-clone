
import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submitHandler =async(e) => {
    e.preventDefault()

   const userData = {
    email: email,
    password: password
   }
   const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
   if(response.status===200){
    const data = response.data
    setUser(data.user)
    localStorage.setItem('token',data.token)
    navigate('/home')
   }

    setEmail('')
    setPassword('')
    
  }

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <img
          className="w-20"
          src="https://thumbs.dreamstime.com/b/web-183282931.jpg"
          alt="Uber logo"
        />

        <form onSubmit={submitHandler}>
          <h3 className="text-xl mb-2">What is your email?</h3>

          <input
            required
            className="bg-white rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-xl mb-2 mt-4">Enter your password</h3>

          <input
            required
            className="bg-white rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-[#111] rounded-xl w-full py-3 text-white mt-3 mb-3"
          >
            Login
          </button>
        </form>

        <p className="text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Create Account
          </Link>
        </p>
      </div>

      <div>
        <Link
          to="/captain-login"
          className="bg-[#111] rounded-xl flex items-center justify-center w-full py-3 text-white mt-3"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  )
}

export default UserLogin
