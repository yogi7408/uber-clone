
import React, { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

import FinishRide from '../components/FinishRide';
import LiveTracking from '../components/LiveTracking';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);

    const finishRidePanelRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    const rideData = location.state?.ride;

    useGSAP(() => {
        if (!finishRidePanelRef.current) return;

        gsap.to(finishRidePanelRef.current, {
            y: finishRidePanel ? 0 : '100%',
            duration: 0.3,
            ease: 'power2.out'
        });
    }, [finishRidePanel]);

    if (!rideData) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4 p-6">
                <h2 className="text-xl font-semibold">
                    Ride details not found
                </h2>

                <button
                    onClick={() => navigate('/captain-home')}
                    className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
                >
                    Back to Captain Home
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen flex-col justify-end overflow-hidden">
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
                    <i className="ri-logout-box-r-line text-lg"></i>
                </Link>
            </div>

            {/* Map */}
            <div className="fixed inset-0 z-0">
                <LiveTracking />
            </div>

            {/* Complete ride panel trigger */}
            <div
                className="relative z-10 flex h-1/5 items-center justify-between bg-yellow-400 p-6 pt-10"
                onClick={() => setFinishRidePanel(true)}
            >
                <h5 className="absolute top-0 w-[90%] p-1 text-center">
                    <i className="ri-arrow-up-wide-line text-3xl text-gray-800"></i>
                </h5>

                <h4 className="text-xl font-semibold">Ride in progress</h4>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        setFinishRidePanel(true);
                    }}
                    className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
                >
                    Complete Ride
                </button>
            </div>

            {/* Finish ride panel */}
            <div
                ref={finishRidePanelRef}
                className="fixed bottom-0 z-20 w-full bg-white px-3 pb-10 pt-12"
                style={{ transform: 'translateY(100%)' }}
            >
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    );
};

export default CaptainRiding;
