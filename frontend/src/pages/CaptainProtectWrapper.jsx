
import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token')
    const { setCaptain } = useContext(CaptainDataContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        if (!token) {
            setIsLoading(false)
            return
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain)
                setIsAuthenticated(true)
            }
        })
        .catch((error) => {
            console.error('Captain profile error:', error)
            localStorage.removeItem('token')
            setIsAuthenticated(false)
        })
        .finally(() => {
            setIsLoading(false)
        })
    }, [token, setCaptain])

    if (isLoading) {
        return <div className="p-5">Loading Captain Profile...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/captain-login" replace />
    }

    return children
}

export default CaptainProtectWrapper
