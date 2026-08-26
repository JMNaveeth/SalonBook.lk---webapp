import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const StaffForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        specialization: initialData.specialization || '',
      });
    } else {
      reset({
        name: '',
        specialization: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Staff Full Name</label>
        <input
          type="text"
          {...register('name', { required: 'Staff name is required' })}
          placeholder="e.g. Kamal Wickramasinghe"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Specialization</label>
        <input
          type="text"
          {...register('specialization', { required: 'Specialization is required' })}
          placeholder="e.g. Fade Cut Specialist / Bridal Dressing Master"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        {errors.specialization && <p className="text-xs text-red-500 mt-1">{errors.specialization.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Profile Photo</label>
        <input
          type="file"
          accept="image/*"
          {...register('avatar')}
          className="w-full border border-neutral-200 rounded-lg px-3 py-1.5 text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-sm text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
        >
          {loading ? 'Saving...' : initialData ? 'Update Staff' : 'Add Staff'}
        </button>
      </div>
    </form>
  );
};

export default StaffForm;
