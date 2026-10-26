
const captainModel = require('../models/captain.model');


module.exports.updateCaptainLocation = async ({
    captainId,
    ltd,
    lng
}) => {
    return captainModel.findByIdAndUpdate(
        captainId,
        {
            location: {
                type: 'Point',
                coordinates: [Number(lng), Number(ltd)]
            },
            status: 'active'
        },
        { new: true }
    );
};

