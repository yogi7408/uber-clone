
import { Routes, Route } from 'react-router-dom';

import Start from './pages/Start';
import Login from './pages/UserLogin';
import Register from './pages/UserSignUp';
import CaptainSignup from './pages/CaptainSignup';
import CaptainLogin from './pages/CaptainLogin';
import Home from './pages/Home';
import UserProtectedWrapper from './pages/UserProtectedWrapper';
import UserLogout from './pages/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';
function App() {
    return (
        <Routes>
            <Route path="/" element={<Start />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/riding" element={<Riding />} />

            <Route path="/captain-signup" element={<CaptainSignup />} />
            <Route path="/captain-login" element={<CaptainLogin />} />

            <Route
                path="/home"
                element={
                    <UserProtectedWrapper>
                        <Home />
                    </UserProtectedWrapper>
                }
            />

            <Route
                path="/user/logout"
                element={
                    <UserProtectedWrapper>
                        <UserLogout />
                    </UserProtectedWrapper>
                }
            />

            <Route
                path="/captain-home"
                element={
                    <CaptainProtectWrapper>
                        <CaptainHome />
                    </CaptainProtectWrapper>
                }
            />
            <Route
    path="/captain-riding"
    element={
        <CaptainProtectWrapper>
            <CaptainRiding />
        </CaptainProtectWrapper>
    }
/>
        </Routes>
    );
}

export default App;
