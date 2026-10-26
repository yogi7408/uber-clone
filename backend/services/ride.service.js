const rideModel = require('../models/ride.model');
const mapService = require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination
    );

    if (
        !distanceTime?.distance ||
        typeof distanceTime.distance.value !== 'number' ||
        !distanceTime?.duration ||
        typeof distanceTime.duration.value !== 'number'
    ) {
        console.error('Invalid distanceTime response:', distanceTime);
        throw new Error('Invalid distance or duration response');
    }

    const distanceKm = distanceTime.distance.value / 1000;
    const durationMinutes = distanceTime.duration.value / 60;

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };

    const fare = {};

    for (const vehicle of ['auto', 'car', 'moto']) {
        fare[vehicle] = Math.round(
            baseFare[vehicle] +
            distanceKm * perKmRate[vehicle] +
            durationMinutes * perMinuteRate[vehicle]
        );
    }

    return fare;
}



module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}



module.exports.createRide = async ({
    user,
    pickup,
    destination,
    vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const distanceTime = await mapService.getDistanceTime(
        pickup,
        destination
    );

    const fare = await getFare(pickup, destination);

    if (fare[vehicleType] === undefined) {
        throw new Error('Invalid vehicle type');
    }

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        distance: distanceTime.distance.value,
        duration: distanceTime.duration.value,
        otp: getOtp(6)
    });

    return ride;
};



module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId || !captain?._id) {
        throw new Error('Ride ID and captain are required');
    }

    const ride = await rideModel.findOneAndUpdate(
        {
            _id: rideId,
            status: 'pending'
        },
        {
            status: 'accepted',
            captain: captain._id
        },
        {
            new: true,
            runValidators: true
        }
    )
        .populate('user')
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found or already accepted');
    }

    return ride;
};


module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}
