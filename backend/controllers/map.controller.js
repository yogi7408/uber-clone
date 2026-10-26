const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports.getAutoCompleteSuggestions = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    try {
        const { input } = req.query;

        const suggestions =
            await mapService.getAutoCompleteSuggestions(input);

        return res.status(200).json(suggestions);

    } catch (err) {
        console.error(
            'Suggestions controller error:',
            err.response?.status,
            err.response?.data || err.message
        );

        if (err.response?.status === 429) {
            return res.status(503).json({
                message: 'Location service rate limit reached. Try again later.'
            });
        }

        return res.status(500).json({
            message: 'Unable to fetch location suggestions',
            error: err.message
        });
    }
};

