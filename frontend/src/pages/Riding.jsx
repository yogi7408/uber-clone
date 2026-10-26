
import React, { useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { SocketContext } from '../context/SocketContext';
import LiveTracking from '../components/LiveTracking';

const Riding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);

    const ride = location.state?.ride;

    // Listen for ride-ended event
    useEffect(() => {
        if (!socket) return;

        const handleRideEnded = () => {
            navigate('/home', { replace: true });
        };

        socket.on('ride-ended', handleRideEnded);

        return () => {
            socket.off('ride-ended', handleRideEnded);
        };
    }, [socket, navigate]);

    // Handle missing ride data
    if (!ride) {
        return (
            <div className="h-screen flex flex-col items-center justify-center p-6">
                <h2 className="text-xl font-semibold">
                    Ride details not found
                </h2>
                <button
                    onClick={() => navigate('/home')}
                    className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const captainName =
        `${ride.captain?.fullName?.firstName || ''} ${ride.captain?.fullName?.lastName || ''}`.trim()
        || 'Your Captain';

    const vehiclePlate =
        ride.captain?.vehicle?.plate || 'Plate not available';

    return (
        <div className="h-screen">
            <Link
                to="/home"
                className="fixed right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white"
            >
                <i className="ri-home-5-line text-lg font-medium"></i>
            </Link>

            <div className="h-1/2">
                <LiveTracking />
            </div>

            <div className="h-1/2 p-4">
                <div className="flex items-center justify-between">
                    <img
                        className="h-12"
                        src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                        alt="Ride vehicle"
                    />

                    <div className="text-right">
                        <h2 className="text-lg font-medium capitalize">
                            {captainName}
                        </h2>
                        <h4 className="text-xl font-semibold">
                            {vehiclePlate}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {ride.captain?.vehicle?.vehicleType || 'Vehicle'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="mt-5 w-full">
                        <div className="flex items-center gap-5 border-b-2 p-3">
                            <i className="ri-map-pin-2-fill text-lg"></i>
                            <div>
                                <h3 className="text-lg font-medium">
                                    Destination
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {ride.destination}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 p-3">
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className="text-lg font-medium">
                                    ₹{ride.fare}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Cash payment
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="mt-5 w-full rounded-lg bg-green-600 p-2 font-semibold text-white"
                >
                    Make a Payment
                </button>
            </div>
        </div>
    );
};

export default Riding;
