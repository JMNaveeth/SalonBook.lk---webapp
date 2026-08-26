import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scissors, Mail, Lock } from 'lucide-react';
import { loginApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await loginApi(data);
      toast.success('Welcome back!');
      login(res.data.data.user, res.data.data.accessToken, res.data.data.refreshToken);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary-500 text-white p-3 rounded-2xl shadow-sm mb-2">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Salon Owner & Partner Sign In</h2>
          <p className="text-xs text-neutral-500">Sign in to manage your salon dashboard, staff, and appointments</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-neutral-400 absolute left-3 top-3" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="you@example.com"
                className="w-full pl-10 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-neutral-700 uppercase">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary-600 hover:underline">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-3" />
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="••••••••"
                className="w-full pl-10 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow text-sm"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="space-y-3 pt-4 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500">
            Want to list your salon on SalonBook LK?{' '}
            <Link to="/register" className="font-bold text-primary-600 hover:underline">
              List Your Salon (Free)
            </Link>
          </p>

          <div className="p-3 bg-neutral-50 rounded-xl text-xs text-neutral-600 border border-neutral-200">
            <span className="font-semibold text-neutral-800">Looking to book an appointment?</span>
            <p className="text-[11px] text-neutral-500 mt-0.5">No account required! Select a salon and book directly.</p>
            <Link to="/salons" className="inline-block mt-1 text-primary-600 font-bold hover:underline">
              Browse Salons →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
