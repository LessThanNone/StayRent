import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetail from './pages/PropertyDetail';
import TenantDashboard from './pages/TenantDashboard';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <div className="flex flex-col min-h-screen bg-gray-50/50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />

                {/* Tenant Protected Routes */}
                <Route element={<PrivateRoute allowedRoles={['tenant', 'admin']} />}>
                  <Route path="/tenant/dashboard" element={<TenantDashboard />} />
                </Route>

                {/* Owner Protected Routes */}
                <Route element={<PrivateRoute allowedRoles={['owner', 'admin']} />}>
                  <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<PrivateRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* 404 Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
