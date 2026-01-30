import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import ProfileModal from './components/ProfileModal'; 
import 'leaflet/dist/leaflet.css';
import Login from './pages/Login';
import Home from './pages/Home';
import Footer from './components/Footer.jsx';
import Register from './pages/Register';
import Admin from './pages/Admin';
import Orders from './pages/Orders';

function App() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" reverseOrder={false} />
          <Navbar onOpenProfile={() => setIsProfileOpen(true)} />
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
          />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}> <Admin /> </ProtectedRoute>
            } />
            
            <Route path="/orders" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;