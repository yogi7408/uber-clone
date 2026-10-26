
const axios = require('axios');
const captainModel = require('../models/captain.model');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';
const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving';

const http = axios.create({
    timeout: 15000,
    headers: {
        'User-Agent': 'UberCloneStudentProject/1.0 (yogendrakumarfzd562@gmail.com)'
    }
});

// Geocoding: Address -> Coordinates
module.exports.getAddressCoordinate = async (address) => {
    if (!address || address.trim().length < 3) {
        throw new Error('A valid address is required');
    }

    try {
        const response = await http.get(`${NOMINATIM_URL}/search`, {
            params: {
                q: address.trim(),
                format: 'jsonv2',
                limit: 1,
                countrycodes: 'in'
            }
        });

        if (!response.data.length) {
            throw new Error('Location not found');
        }

        return {
            ltd: Number(response.data[0].lat),
            lng: Number(response.data[0].lon)
        };
    } catch (error) {
        console.error(
            'Geocoding error:',
            error.response?.status || error.message
        );
        throw error;
    }
};

// Distance and duration using OSRM
module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    try {
        // Accept coordinates directly to avoid unnecessary geocoding.
        const getCoords = async (value) => {
            if (
                typeof value === 'object' &&
                Number.isFinite(Number(value.lng)) &&
                Number.isFinite(Number(value.ltd))
            ) {
                return { lng: Number(value.lng), ltd: Number(value.ltd) };
            }

            return module.exports.getAddressCoordinate(value);
        };

        const [start, end] = await Promise.all([
            getCoords(origin),
            getCoords(destination)
        ]);

        const url =
            `${OSRM_URL}/` +
            `${start.lng},${start.ltd};${end.lng},${end.ltd}`;

        const response = await axios.get(url, {
            params: {
                overview: 'false'
            },
            timeout: 15000
        });

        if (
            response.data.code !== 'Ok' ||
            !response.data.routes?.length
        ) {
            throw new Error('No route found');
        }

        const route = response.data.routes[0];

        return {
            distance: {
                value: route.distance,
                text: `${(route.distance / 1000).toFixed(1)} km`
            },
            duration: {
                value: route.duration,
                text: `${Math.round(route.duration / 60)} mins`
            },
            status: 'OK'
        };
    } catch (error) {
        console.error(
            'Distance calculation error:',
            error.response?.status || error.message
        );
        throw error;
    }
};

// Autocomplete using Nominatim



module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input || input.trim().length < 3) {
        return [];
    }

    try {
        const response = await axios.get(
            'https://photon.komoot.io/api/',
            {
                params: {
                    q: input.trim(),
                    limit: 10,
                    lang: 'en'
                },
                timeout: 10000
            }
        );

        const features = response.data.features || [];

        // Prefer results from Uttar Pradesh
        const upFeatures = features.filter((feature) => {
            return (
                feature.properties?.state?.toLowerCase() ===
                'uttar pradesh'
            );
        });

        const selectedFeatures = upFeatures.length
            ? upFeatures
            : features;

        // Remove duplicate coordinates
        const uniqueFeatures = selectedFeatures.filter(
            (feature, index, array) => {
                const [lng, lat] = feature.geometry.coordinates;

                return array.findIndex((item) => {
                    const [itemLng, itemLat] =
                        item.geometry.coordinates;

                    return itemLng === lng && itemLat === lat;
                }) === index;
            }
        );

        return uniqueFeatures.map((feature) => {
            const p = feature.properties || {};
            const [lng, lat] = feature.geometry.coordinates;

            return {
                description: [
                    p.name,
                    p.street,
                    p.city || p.town || p.village,
                    p.state,
                    p.country
                ]
                    .filter(Boolean)
                    .filter((value, index, array) =>
                        array.indexOf(value) === index
                    )
                    .join(', '),
                lat: Number(lat),
                lng: Number(lng)
            };
        });
    } catch (error) {
        console.error(
            'Autocomplete error:',
            error.response?.status || error.message
        );

        throw error;
    }
};




// Captains within radius (km)

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    const allCaptains = await captainModel.find({})
        .select('fullName status socketId location');

    console.log(
        'All captains in DB:',
        JSON.stringify(allCaptains, null, 2)
    );

    const activeCaptains = await captainModel.find({
        status: 'active'
    }).select('fullName status socketId location');

    console.log(
        'Active captains:',
        activeCaptains.length
    );

    const nearbyCaptains = await captainModel.find({
        status: 'active',
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, ltd],
                    radius / 6371
                ]
            }
        }
    });

    console.log(
        'Nearby active captains:',
        nearbyCaptains.length
    );

    return nearbyCaptains;
};

