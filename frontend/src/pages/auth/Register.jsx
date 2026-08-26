import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scissors, User, Store, Sparkles } from 'lucide-react';
import { registerApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'owner' ? 'owner' : 'customer';
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data, role: selectedRole };
      const res = await registerApi(payload);
      toast.success('Registration successful!');
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
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Create SalonBook LK Account</h2>
          <p className="text-xs text-neutral-500">Join Sri Lanka's leading salon booking network</p>
        </div>

        {/* Role Picker Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-neutral-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setSelectedRole('customer')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
              selectedRole === 'customer'
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('owner')}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-all relative ${
              selectedRole === 'owner'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Salon Owner</span>
            <span className="absolute -top-2 -right-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center">
              <Sparkles className="w-2.5 h-2.5 mr-0.5" /> FREE 3M
            </span>
          </button>
        </div>

        {selectedRole === 'owner' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Owner Special Offer!</span>
            </p>
            <p>Sign up today and get 3 months of FREE Pro Plan salon management tools!</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Name</label>
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
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow text-sm"
          >
            {loading ? 'Creating Account...' : `Register as ${selectedRole === 'owner' ? 'Salon Owner' : 'Customer'}`}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-neutral-100">
          <p className="text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
