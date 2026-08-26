import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Common Layout components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastContainer from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Customer Pages
import Home from './pages/customer/Home';
import SalonList from './pages/customer/SalonList';
import SalonDetail from './pages/customer/SalonDetail';
import BookingFlow from './pages/customer/BookingFlow';
import MyBookings from './pages/customer/MyBookings';
import Profile from './pages/customer/Profile';
import MyReviews from './pages/customer/MyReviews';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import ShopSetup from './pages/owner/ShopSetup';
import ManageServices from './pages/owner/ManageServices';
import ManageStaff from './pages/owner/ManageStaff';
import AppointmentCalendar from './pages/owner/AppointmentCalendar';
import Earnings from './pages/owner/Earnings';
import OwnerReviews from './pages/owner/OwnerReviews';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageShops from './pages/admin/ManageShops';
import ManageUsers from './pages/admin/ManageUsers';
import ManagePayments from './pages/admin/ManagePayments';
import Analytics from './pages/admin/Analytics';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/salons" element={<SalonList />} />
                <Route path="/salons/:id" element={<SalonDetail />} />
                <Route
                  path="/book/:shopId"
                  element={
                    <ProtectedRoute role="customer">
                      <BookingFlow />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute role="customer">
                      <MyBookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviews"
                  element={
                    <ProtectedRoute role="customer">
                      <MyReviews />
                    </ProtectedRoute>
                  }
                />

                {/* Owner Routes */}
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedRoute role="owner">
                      <OwnerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/setup"
                  element={
                    <ProtectedRoute role="owner">
                      <ShopSetup />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/services"
                  element={
                    <ProtectedRoute role="owner">
                      <ManageServices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/staff"
                  element={
                    <ProtectedRoute role="owner">
                      <ManageStaff />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/appointments"
                  element={
                    <ProtectedRoute role="owner">
                      <AppointmentCalendar />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/earnings"
                  element={
                    <ProtectedRoute role="owner">
                      <Earnings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/owner/reviews"
                  element={
                    <ProtectedRoute role="owner">
                      <OwnerReviews />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/shops"
                  element={
                    <ProtectedRoute role="admin">
                      <ManageShops />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="admin">
                      <ManageUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/payments"
                  element={
                    <ProtectedRoute role="admin">
                      <ManagePayments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute role="admin">
                      <Analytics />
                    </ProtectedRoute>
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
          </div>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
