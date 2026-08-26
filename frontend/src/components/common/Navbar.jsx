import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scissors, User, LogOut, Store, Menu, X, Bell, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-tr from-primary-600 via-primary-500 to-amber-500 text-white p-2.5 rounded-2xl shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
              <Scissors className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-xl tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
                SalonBook <span className="text-secondary-500">LK</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase -mt-1">
                Sri Lanka
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold text-neutral-600">
            <Link
              to="/salons"
              className={`px-4 py-2 rounded-xl transition-all ${
                isActive('/salons')
                  ? 'bg-primary-50 text-primary-600 font-bold'
                  : 'hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Find Salons
            </Link>

            {isAuthenticated && role === 'customer' && (
              <>
                <Link
                  to="/bookings"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/bookings')
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  My Appointments
                </Link>
                <Link
                  to="/reviews"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/reviews')
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  My Reviews
                </Link>
              </>
            )}

            {role === 'owner' && (
              <>
                <Link
                  to="/owner/dashboard"
                  className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
                    isActive('/owner/dashboard')
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>Owner Dashboard</span>
                </Link>
                <Link
                  to="/owner/appointments"
                  className={`px-4 py-2 rounded-xl transition-all ${
                    isActive('/owner/appointments')
                      ? 'bg-primary-50 text-primary-600 font-bold'
                      : 'hover:text-neutral-900 hover:bg-neutral-50'
                  }`}
                >
                  Calendar
                </Link>
              </>
            )}

            {role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-4 py-2 rounded-xl transition-all ${
                  isActive('/admin/dashboard')
                    ? 'bg-secondary-50 text-secondary-600 font-bold'
                    : 'text-secondary-600 hover:bg-secondary-50'
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>

          {/* Right User Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 bg-neutral-50/80 p-1.5 pl-3 rounded-2xl border border-neutral-100">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-sm font-semibold text-neutral-800 hover:text-primary-600 transition-colors"
                >
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name}
                      className="w-8 h-8 rounded-xl object-cover ring-2 ring-primary-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-xs">
                      {user?.name?.charAt(0)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="leading-none">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[10px] text-neutral-400 font-normal capitalize">
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={logout}
                  className="text-neutral-400 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-neutral-700 hover:text-primary-600 px-4 py-2.5 rounded-xl hover:bg-neutral-50 transition-all"
                >
                  Owner Sign In
                </Link>
                <Link
                  to="/register?role=owner"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 flex items-center space-x-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>List Your Salon</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-neutral-700 p-2.5 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-neutral-100 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/salons"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl text-neutral-700 font-semibold hover:bg-primary-50 hover:text-primary-600"
          >
            <span>Find Salons</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </Link>

          {isAuthenticated && role === 'customer' && (
            <>
              <Link
                to="/bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-neutral-700 font-semibold hover:bg-primary-50 hover:text-primary-600"
              >
                <span>My Appointments</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
              <Link
                to="/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-neutral-700 font-semibold hover:bg-primary-50 hover:text-primary-600"
              >
                <span>My Reviews</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </>
          )}

          {role === 'owner' && (
            <Link
              to="/owner/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-primary-600 font-bold bg-primary-50"
            >
              <span>Owner Dashboard</span>
              <ChevronRight className="w-4 h-4 text-primary-500" />
            </Link>
          )}

          {role === 'admin' && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl text-secondary-600 font-bold bg-secondary-50"
            >
              <span>Admin Oversight</span>
              <ChevronRight className="w-4 h-4 text-secondary-500" />
            </Link>
          )}

          <div className="pt-3 border-t border-neutral-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-xl bg-neutral-50 font-semibold text-neutral-800"
                >
                  <User className="w-5 h-5 text-primary-500" />
                  <span>My Profile ({user?.name})</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left p-3 rounded-xl text-red-600 font-semibold bg-red-50/50"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-neutral-700 font-bold border border-neutral-200 rounded-xl"
                >
                  Owner Sign In
                </Link>
                <Link
                  to="/register?role=owner"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-white bg-primary-500 font-bold rounded-xl shadow"
                >
                  List Your Salon (Free)
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
