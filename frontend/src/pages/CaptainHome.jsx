
import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';

import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';

import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    // Join captain room and listen for new rides
    useEffect(() => {
        if (!socket || !captain?._id) {
            console.log('Socket or captain ID missing');
            return;
        }

        const joinCaptain = () => {
            console.log('Captain connected:', socket.id);

            socket.emit('join', {
                userId: captain._id,
                userType: 'captain'
            });
        };

        const handleNewRide = (data) => {
            console.log('New ride received:', data);

            setRide(data);
            setRidePopupPanel(true);
            setConfirmRidePopupPanel(false);
        };

        socket.on('new-ride', handleNewRide);

        if (socket.connected) {
            joinCaptain();
        } else {
            socket.on('connect', joinCaptain);
        }

        return () => {
            socket.off('new-ride', handleNewRide);
            socket.off('connect', joinCaptain);
        };
    }, [socket, captain?._id]);

    // Confirm ride
    const confirmRide = async () => {
        if (!ride?._id) {
            console.error('Ride ID is missing');
            return;
        }

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setRide(response.data);
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (error) {
            console.error(
                'Confirm ride error:',
                error.response?.data || error.message
            );
        }
    };

    // New ride popup animation
    useGSAP(() => {
        if (!ridePopupPanelRef.current) return;

        gsap.to(ridePopupPanelRef.current, {
            y: ridePopupPanel ? 0 : '100%',
            duration: 0.3,
            ease: 'power2.out'
        });
    }, [ridePopupPanel]);

    // Confirm ride popup animation
    useGSAP(() => {
        if (!confirmRidePopupPanelRef.current) return;

        gsap.to(confirmRidePopupPanelRef.current, {
            y: confirmRidePopupPanel ? 0 : '100%',
            duration: 0.3,
            ease: 'power2.out'
        });
    }, [confirmRidePopupPanel]);

    return (
        <div className="h-screen overflow-hidden">
            {/* Header */}
            <div className="fixed top-0 z-10 flex w-full items-center justify-between p-6">
                <img
                    className="w-16"
                    src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                    alt="Uber"
                />

                <Link
                    to="/captain-home"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
                >
                    <i className="ri-logout-box-r-line text-lg font-medium"></i>
                </Link>
            </div>

            {/* Main screen */}
            <div className="h-3/5">
                <img
                    className="h-full w-full object-cover"
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt="Captain map"
                />
            </div>

            <div className="h-2/5 p-6">
                <CaptainDetails />
            </div>

            {/* New ride popup */}
            <div
                ref={ridePopupPanelRef}
                className="fixed bottom-0 z-20 w-full bg-white px-3 pb-10 pt-12"
                style={{ transform: 'translateY(100%)' }}
            >
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>

            {/* Confirm ride popup */}
            <div
                ref={confirmRidePopupPanelRef}
                className="fixed bottom-0 z-30 h-screen w-full bg-white px-3 pb-10 pt-12"
                style={{ transform: 'translateY(100%)' }}
            >
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
