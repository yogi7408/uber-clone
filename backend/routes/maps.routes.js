
const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');

const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    next();
};

router.get(
    '/get-coordinates',
    query('address').isString().trim().isLength({ min: 3 }),
    validateRequest,
    authMiddleware.authUser,
    mapController.getCoordinates
);

router.get(
    '/get-distance-time',
    query('origin').isString().trim().isLength({ min: 3 }),
    query('destination').isString().trim().isLength({ min: 3 }),
    validateRequest,
    authMiddleware.authUser,
    mapController.getDistanceTime
);

router.get(
    '/get-suggestions',
    query('input').isString().trim().isLength({ min: 3 }),
    validateRequest,
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

module.exports = router;
