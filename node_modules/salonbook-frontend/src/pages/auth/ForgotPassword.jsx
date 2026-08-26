import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Scissors, Mail } from 'lucide-react';
import { forgotPasswordApi } from '../../api/authApi';
import { useToast } from '../../hooks/useToast';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await forgotPasswordApi(data);
      setSubmitted(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error('Failed to process request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-neutral-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex bg-primary-500 text-white p-3 rounded-2xl shadow-sm mb-2">
            <Scissors className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900">Forgot Password</h2>
          <p className="text-xs text-neutral-500">Enter your email address to receive password reset instructions</p>
        </div>

        {submitted ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-xs rounded-xl text-center space-y-2">
            <p className="font-bold text-sm">Check Your Inbox</p>
            <p>If an account exists with that email, we have sent instructions to reset your password.</p>
            <Link to="/login" className="inline-block mt-2 font-semibold text-primary-600 hover:underline">
              Return to Login
            </Link>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-all shadow-sm hover:shadow text-sm"
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="text-center pt-4 border-t border-neutral-100">
          <Link to="/login" className="text-xs font-semibold text-neutral-500 hover:text-neutral-900">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
