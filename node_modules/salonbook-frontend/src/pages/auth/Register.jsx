import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scissors, User, Store, Sparkles } from 'lucide-react';
import { registerApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, role: 'owner' };
      const res = await registerApi(payload);
      toast.success('Registration successful! Welcome partner salon.');
      login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary-500 text-white p-3 rounded-2xl shadow-sm mb-2">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Partner & Salon Registration</h2>
          <p className="text-xs text-neutral-500">List your salon, manage staff & reach thousands of customers in Sri Lanka</p>
        </div>

        <div className="p-3.5 bg-gradient-to-r from-amber-500/10 via-primary-50 to-amber-500/10 border border-amber-300/60 rounded-2xl text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center space-x-1 text-primary-700">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Salon Owner Special Offer!</span>
          </p>
          <p className="text-neutral-700">Sign up today and get 3 months of FREE Pro Plan salon management tools!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Salon Owner Full Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              placeholder="Kasun Perera"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Valid email is required' })}
              placeholder="you@example.com"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Phone Number (Sri Lanka)</label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone number is required' })}
              placeholder="+94 77 123 4567"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              placeholder="••••••••"
              className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm"
          >
            {loading ? 'Registering Salon...' : 'Register Your Salon (Free)'}
          </button>
        </form>

        <div className="space-y-3 pt-4 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Already registered as a salon owner?{' '}
            <Link to="/login" className="font-bold text-primary-600 hover:underline">
              Owner Sign In
            </Link>
          </p>

          <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-200">
            <span className="font-semibold text-neutral-800">Looking to book an appointment?</span>
            <p className="text-[11px] text-neutral-500 mt-0.5">No signup required! Browse salons and book directly.</p>
            <Link to="/salons" className="inline-block mt-1 text-primary-600 font-bold hover:underline">
              Browse Salons →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
