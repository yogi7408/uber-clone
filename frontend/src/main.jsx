
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import 'leaflet/dist/leaflet.css';

import App from './App.jsx';
import UserContext from './context/UserContext.jsx';
import CaptainContext from './context/CaptainContext.jsx';
import SocketProvider from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <UserContext>
                <CaptainContext>
                    <SocketProvider>
                        <App />
                    </SocketProvider>
                </CaptainContext>
            </UserContext>
        </BrowserRouter>
    </StrictMode>
);
