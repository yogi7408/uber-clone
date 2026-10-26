
import React from 'react';

const WaitingForDriver = (props) => {
    const ride = props.ride;

    const captainName = [
        ride?.captain?.fullName?.firstName,
        ride?.captain?.fullName?.lastName
    ].filter(Boolean).join(' ');

    const vehiclePlate = ride?.captain?.vehicle?.plate;
    const vehicleType = ride?.captain?.vehicle?.vehicleType;

    return (
        <div>
            <h5
                className="p-1 text-center w-[93%] absolute top-0 cursor-pointer"
                onClick={() => props.setWaitingForDriver(false)}
            >
                <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
            </h5>

            <div className="flex items-center justify-between">
                <img
                    className="h-12"
                    src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
                    alt="Vehicle"
                />

                <div className="text-right">
                    <h2 className="text-lg font-medium capitalize">
                        {captainName || 'Waiting for captain...'}
                    </h2>

                    <h4 className="text-xl font-semibold -mt-1 -mb-1">
                        {vehiclePlate || 'Vehicle number pending'}
                    </h4>

                    <p className="text-sm text-gray-600 capitalize">
                        {vehicleType || 'Vehicle details pending'}
                    </p>

                    <h1 className="text-lg font-semibold">
                        OTP: {ride?.otp || '----'}
                    </h1>
                </div>
            </div>

            <div className="flex gap-2 justify-between flex-col items-center">
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {ride?.pickup || 'Pickup location unavailable'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                {ride?.destination || 'Destination unavailable'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-5 p-3">
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">
                                ₹{ride?.fare ?? '--'}
                            </h3>
                            <p className="text-sm -mt-1 text-gray-600">
                                Cash payment
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingForDriver;
