import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { SERVICE_CATEGORIES } from '../../utils/constants';

const ServiceForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        category: initialData.category || SERVICE_CATEGORIES[0],
        price: initialData.price || '',
        duration_mins: initialData.duration_mins || 30,
        description: initialData.description || '',
      });
    } else {
      reset({
        name: '',
        category: SERVICE_CATEGORIES[0],
        price: '',
        duration_mins: 30,
        description: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Service Name</label>
        <input
          type="text"
          {...register('name', { required: 'Service name is required' })}
          placeholder="e.g. Executive Haircut & Beard Trim"
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Price (LKR)</label>
          <input
            type="number"
            step="100"
            {...register('price', { required: 'Price is required', min: 0 })}
            placeholder="e.g. 2500"
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Duration (Minutes)</label>
        <select
          {...register('duration_mins')}
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <option value="15">15 mins</option>
          <option value="30">30 mins</option>
          <option value="45">45 mins</option>
          <option value="60">60 mins (1 hr)</option>
          <option value="90">90 mins (1.5 hrs)</option>
          <option value="120">120 mins (2 hrs)</option>
          <option value="180">180 mins (3 hrs)</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Description</label>
        <textarea
          rows="3"
          {...register('description')}
          placeholder="Brief summary of what is included in this service..."
          className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
        ></textarea>
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
          {loading ? 'Saving...' : initialData ? 'Update Service' : 'Add Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
