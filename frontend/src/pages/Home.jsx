
import React, {
    useEffect,
    useRef,
    useState,
    useContext
} from 'react';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';

import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveTracking from '../components/LiveTracking';

import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';

const API_URL = import.meta.env.VITE_BASE_URL;

const Home = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');

    const [panelOpen, setPanelOpen] = useState(false);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);

    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);

    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);
    const [loadingFare, setLoadingFare] = useState(false);

    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);

    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);

    // Join socket and listen for ride events
    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit('join', {
            userType: 'user',
            userId: user._id
        });

        const handleRideConfirmed = (rideData) => {
            setVehicleFound(false);
            setWaitingForDriver(true);
            setRide(rideData);
        };

        const handleRideStarted = (rideData) => {
            setWaitingForDriver(false);

            navigate('/riding', {
                state: { ride: rideData }
            });
        };

        socket.on('ride-confirmed', handleRideConfirmed);
        socket.on('ride-started', handleRideStarted);

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed);
            socket.off('ride-started', handleRideStarted);
        };
    }, [socket, user?._id, navigate]);

    // Search locations using backend autocomplete API
    const searchLocations = async (value, setSuggestions, signal) => {
        const query = value.trim();

        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        if (!API_URL) {
            console.error('VITE_BASE_URL is not configured.');
            setSuggestions([]);
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const response = await axios.get(
                `${API_URL}/maps/get-suggestions`,
                {
                    params: {
                        input: query
                    },
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                    signal
                }
            );

            console.log('Autocomplete API response:', response.data);

            if (!Array.isArray(response.data)) {
                console.error(
                    'Unexpected suggestions response:',
                    response.data
                );
                setSuggestions([]);
                return;
            }

            // Keep suggestions as objects because LocationSearchPanel
            // displays suggestion.description.
            const normalizedSuggestions = response.data
                .map((item) => {
                    if (typeof item === 'string') {
                        return {
                            description: item,
                            lat: null,
                            lng: null
                        };
                    }

                    return {
                        description:
                            item?.description ||
                            item?.display_name ||
                            '',
                        lat: item?.lat ?? item?.coordinates?.lat ?? null,
                        lng: item?.lng ?? item?.coordinates?.lng ?? null
                    };
                })
                .filter(
                    (item) =>
                        typeof item.description === 'string' &&
                        item.description.trim().length > 0
                );

            setSuggestions(normalizedSuggestions);
        } catch (error) {
            if (
                error.code === 'ERR_CANCELED' ||
                axios.isCancel(error)
            ) {
                return;
            }

            console.error(
                'Location search failed:',
                error.response?.status,
                error.response?.data || error.message
            );

            setSuggestions([]);
        }
    };

    // Debounced pickup autocomplete
    useEffect(() => {
        if (activeField !== 'pickup') return;

        const controller = new AbortController();

        const timer = setTimeout(() => {
            searchLocations(
                pickup,
                setPickupSuggestions,
                controller.signal
            );
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [pickup, activeField]);

    // Debounced destination autocomplete
    useEffect(() => {
        if (activeField !== 'destination') return;

        const controller = new AbortController();

        const timer = setTimeout(() => {
            searchLocations(
                destination,
                setDestinationSuggestions,
                controller.signal
            );
        }, 500);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [destination, activeField]);

    const handlePickupChange = (e) => {
        setPickup(e.target.value);
        setPickupSuggestions([]);
        setPanelOpen(true);
        setActiveField('pickup');
    };

    const handleDestinationChange = (e) => {
        setDestination(e.target.value);
        setDestinationSuggestions([]);
        setPanelOpen(true);
        setActiveField('destination');
    };

    const handleSuggestionSelected = () => {
        setPickupSuggestions([]);
        setDestinationSuggestions([]);
        setPanelOpen(false);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        findTrip();
    };

    // Suggestions panel animation
    useGSAP(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '45vh',
                padding: 16,
                autoAlpha: 1,
                duration: 0.3,
                overflowY: 'auto'
            });

            gsap.to(panelCloseRef.current, {
                autoAlpha: 1,
                duration: 0.2
            });
        } else {
            gsap.to(panelRef.current, {
                height: 0,
                padding: 0,
                autoAlpha: 0,
                duration: 0.3
            });

            gsap.to(panelCloseRef.current, {
                autoAlpha: 0,
                duration: 0.2
            });
        }
    }, [panelOpen]);

    // Vehicle panel animation
    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, {
            y: vehiclePanel ? 0 : '100%',
            duration: 0.35
        });
    }, [vehiclePanel]);

    // Confirm ride animation
    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, {
            y: confirmRidePanel ? 0 : '100%',
            duration: 0.35
        });
    }, [confirmRidePanel]);

    // Looking for driver animation
    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, {
            y: vehicleFound ? 0 : '100%',
            duration: 0.35
        });
    }, [vehicleFound]);

    // Waiting for driver animation
    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, {
            y: waitingForDriver ? 0 : '100%',
            duration: 0.35
        });
    }, [waitingForDriver]);

    // Calculate fare
    async function findTrip() {
        if (!pickup.trim() || !destination.trim()) {
            alert('Please select pickup and destination');
            return;
        }

        if (loadingFare) return;

        try {
            setLoadingFare(true);

            const response = await axios.get(
                `${API_URL}/rides/get-fare`,
                {
                    params: {
                        pickup,
                        destination
                    },
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setFare(response.data);
            setPanelOpen(false);
            setConfirmRidePanel(false);
            setVehicleFound(false);
            setWaitingForDriver(false);
            setVehiclePanel(true);
        } catch (error) {
            console.error(
                'Fare error:',
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                'Unable to calculate fare. Please try again.'
            );
        } finally {
            setLoadingFare(false);
        }
    }

    // Create ride
    async function createRide() {
        if (!vehicleType) {
            alert('Please select a vehicle');
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/rides/create`,
                {
                    pickup,
                    destination,
                    vehicleType
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            const rideData = response.data;

            setRide(rideData);
            setVehiclePanel(false);
            setConfirmRidePanel(false);
            setVehicleFound(true);

            return rideData;
        } catch (error) {
            console.error(
                'Create ride error:',
                error.response?.data || error.message
            );

            alert(
                error.response?.data?.message ||
                'Unable to create ride. Please try again.'
            );
        }
    }

    const currentSuggestions =
        activeField === 'pickup'
            ? pickupSuggestions
            : activeField === 'destination'
                ? destinationSuggestions
                : [];

    return (
        <div className="h-screen relative overflow-hidden bg-white">
            {/* Map background */}
            <div className="absolute top-0 left-0 w-full h-[55%] z-0">
                <LiveTracking
                    pickup={pickup}
                    destination={destination}
                />
            </div>

            {/* Uber logo */}
            <img
                className="w-16 absolute left-5 top-5 z-10"
                src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
                alt="Uber"
            />

            {/* Pickup and destination form */}
            <div className="absolute bottom-0 left-0 flex flex-col w-full z-10">
                <div className="min-h-[45vh] p-6 bg-white relative rounded-t-2xl shadow-lg">
                    <h5
                        ref={panelCloseRef}
                        onClick={() => setPanelOpen(false)}
                        className="absolute opacity-0 right-6 top-2 text-2xl cursor-pointer"
                    >
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>

                    <h4 className="text-2xl font-semibold mb-3">
                        Find a trip
                    </h4>

                    <form
                        className="relative py-2"
                        onSubmit={submitHandler}
                    >
                        <div className="absolute h-16 w-1 top-1/2 -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>

                        <input
                            onFocus={() => {
                                setActiveField('pickup');
                                setPanelOpen(true);
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full"
                            type="text"
                            placeholder="Add a pick-up location"
                            autoComplete="off"
                        />

                        <input
                            onFocus={() => {
                                setActiveField('destination');
                                setPanelOpen(true);
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className="bg-[#eee] px-12 py-3 text-base rounded-lg w-full mt-3"
                            type="text"
                            placeholder="Enter your destination"
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            disabled={loadingFare}
                            className="bg-black text-white px-4 py-3 rounded-lg mt-3 w-full disabled:opacity-60"
                        >
                            {loadingFare
                                ? 'Calculating fare...'
                                : 'Find Trip'}
                        </button>
                    </form>
                </div>

                {/* Suggestions */}
                <div
                    ref={panelRef}
                    className="bg-white h-0 relative overflow-y-auto"
                    style={{ visibility: 'hidden' }}
                >
                    <LocationSearchPanel
                        suggestions={currentSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                        onSuggestionSelect={handleSuggestionSelected}
                    />
                </div>
            </div>

            {/* Vehicle selection */}
            <div
                ref={vehiclePanelRef}
                className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
            >
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                />
            </div>

            {/* Confirm ride */}
            <div
                ref={confirmRidePanelRef}
                className="fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
            >
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Searching for driver */}
            <div
                ref={vehicleFoundRef}
                className="fixed w-full z-40 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
            >
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound}
                />
            </div>

            {/* Driver found / waiting */}
            <div
                ref={waitingForDriverRef}
                className="fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-6 pt-12"
            >
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver}
                />
            </div>
        </div>
    );
};

export default Home;
