
const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');

const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination, vehicleType } = req.body;

    try {
        if (!req.user?._id) {
            return res.status(401).json({
                message: 'User not authenticated'
            });
        }

        // Create ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType
        });

        if (!ride?._id) {
            return res.status(500).json({
                message: 'Ride could not be created'
            });
        }

        // Get pickup coordinates
        const pickupCoordinates =
            await mapService.getAddressCoordinate(pickup);

        console.log('Pickup coordinates:', pickupCoordinates);

        if (
            !pickupCoordinates ||
            !Number.isFinite(pickupCoordinates.ltd) ||
            !Number.isFinite(pickupCoordinates.lng)
        ) {
            return res.status(400).json({
                message: 'Could not find pickup coordinates'
            });
        }

        // Find nearby active captains
        const captainsInRadius =
            await mapService.getCaptainsInTheRadius(
                pickupCoordinates.ltd,
                pickupCoordinates.lng,
                50
            );

        console.log('Captains found:', captainsInRadius.length);

        // Fetch ride with user details
        const rideWithUser = await rideModel
            .findById(ride._id)
            .populate('user')
            .lean();

        if (!rideWithUser) {
            return res.status(500).json({
                message: 'Created ride could not be fetched'
            });
        }

        // Send response to user
        res.status(201).json(ride);

        // Notify nearby captains using their latest socket IDs
        for (const captain of captainsInRadius) {
            try {
                const currentCaptain = await captainModel
                    .findById(captain._id)
                    .select('socketId status')
                    .lean();

                console.log('Captain ID:', captain._id);
                console.log(
                    'Current socketId:',
                    currentCaptain?.socketId
                );

                if (
                    currentCaptain?.status !== 'active' ||
                    !currentCaptain?.socketId
                ) {
                    console.log(
                        'Captain unavailable:',
                        captain._id
                    );
                    continue;
                }

                sendMessageToSocketId(currentCaptain.socketId, {
                    event: 'new-ride',
                    data: rideWithUser
                });

                console.log(
                    'new-ride event emitted to:',
                    currentCaptain.socketId
                );
            } catch (error) {
                console.error(
                    'Error notifying captain:',
                    captain._id,
                    error.message
                );
            }
        }
    } catch (err) {
        console.error('Create ride error:', err);

        if (!res.headersSent) {
            return res.status(500).json({
                message: err.message
            });
        }
    }
};

module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fare = await rideService.getFare(pickup, destination);
        return res.status(200).json(fare);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.confirmRide({
            rideId,
            captain: req.captain
        });

        if (!ride?._id) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        const populatedRide = await rideModel
            .findById(ride._id)
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!populatedRide) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        if (populatedRide.user?.socketId) {
            sendMessageToSocketId(populatedRide.user.socketId, {
                event: 'ride-confirmed',
                data: populatedRide
            });
        }

        return res.status(200).json(populatedRide);
    } catch (err) {
        console.error('Confirm ride error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
};


module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await rideService.startRide({
            rideId,
            otp,
            captain: req.captain
        });

        if (!ride?._id) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        // Fetch ride with populated user and captain details
        const populatedRide = await rideModel
            .findById(ride._id)
            .populate('user')
            .populate('captain')
            .select('+otp');

        if (!populatedRide) {
            return res.status(404).json({
                message: 'Ride not found'
            });
        }

        // Notify user that ride has started
        if (populatedRide.user?.socketId) {
            sendMessageToSocketId(populatedRide.user.socketId, {
                event: 'ride-started',
                data: populatedRide
            });
        }

        return res.status(200).json(populatedRide);
    } catch (err) {
        console.error('Start ride error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
};


module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideService.endRide({
            rideId,
            captain: req.captain
        });

        if (ride.user?.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-ended',
                data: ride
            });
        }

        return res.status(200).json(ride);
    } catch (err) {
        console.error('End ride error:', err);

        return res.status(500).json({
            message: err.message
        });
    }
};
