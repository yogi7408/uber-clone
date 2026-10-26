
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FinishRide = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const ride = props.ride;
    const firstName = ride?.user?.fullName?.firstName || 'User';
    const lastName = ride?.user?.fullName?.lastName || '';

    async function endRide() {
        if (!ride?._id) {
            setError('Ride ID is missing.');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                props.setFinishRidePanel(false);
                navigate('/captain-home');
            }
        } catch (err) {
            console.error(
                'End ride error:',
                err.response?.data || err.message
            );
            setError(
                err.response?.data?.message || 'Unable to finish ride.'
            );
        } finally {
            setLoading(false);
        }
    }

    if (!ride) {
        return <p className="p-4">Ride details not available.</p>;
    }

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0"
                onClick={() => props.setFinishRidePanel(false)}
            >
                <i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i>
            </h5>

            <h3 className="text-2xl font-semibold mb-5">
                Finish this Ride
            </h3>

            <div className="flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-4">
                <div className="flex items-center gap-3">
                    <img
                        className="h-12 rounded-full object-cover w-12"
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"
                        alt="Passenger"
                    />

                    <h2 className="text-lg font-medium">
                        {firstName} {lastName}
                    </h2>
                </div>

                <h5 className="text-lg font-semibold">2.2 KM</h5>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {ride.pickup}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm -mt-1 text-gray-600">
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
                            <p className="text-sm -mt-1 text-gray-600">
                                Cash
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-5 w-full">
                    {error && (
                        <p className="text-red-600 text-sm mb-3">
                            {error}
                        </p>
                    )}

                    <button
                        onClick={endRide}
                        disabled={loading}
                        className="w-full flex text-lg justify-center bg-green-600 disabled:bg-gray-400 text-white font-semibold p-3 rounded-lg"
                    >
                        {loading ? 'Finishing...' : 'Finish Ride'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishRide;
