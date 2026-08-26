import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getMyShopApi, createShopApi, updateShopApi, blockDateApi, unblockDateApi } from '../../api/shopApi';
import Loader from '../../components/common/Loader';
import { ALL_SRI_LANKA_DISTRICTS, getTownsByDistrict } from '../../utils/sriLankaLocations';
import { useToast } from '../../hooks/useToast';
import { Store, MapPin, Clock, Image, Calendar, CheckCircle } from 'lucide-react';

const ShopSetup = () => {
  const [step, setStep] = useState(1);
  const [existingShop, setExistingShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState('');
  const [blockedReason, setBlockedReason] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState('Colombo');
  const [selectedArea, setSelectedArea] = useState('Colombo 01 (Fort)');
  const [customArea, setCustomArea] = useState('');

  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await getMyShopApi();
        if (res.data.data) {
          const s = res.data.data;
          setExistingShop(s);
          setBlockedDates(s.blocked_dates || []);

          if (s.city) {
            const parts = s.city.split(',').map((p) => p.trim());
            if (parts.length >= 2 && ALL_SRI_LANKA_DISTRICTS.includes(parts[1])) {
              setSelectedDistrict(parts[1]);
              setSelectedArea(parts[0]);
            } else if (ALL_SRI_LANKA_DISTRICTS.includes(s.city)) {
              setSelectedDistrict(s.city);
              const towns = getTownsByDistrict(s.city);
              setSelectedArea(towns[0] || s.city);
            } else {
              setSelectedArea(s.city);
            }
          }

          reset({
            name: s.name || '',
            description: s.description || '',
            phone: s.phone || '',
            email: s.email || '',
            address: s.address || '',
            city: s.city || 'Colombo 01 (Fort), Colombo',
            cover_image_url: s.cover_image_url || '',
            logo_url: s.logo_url || '',
            advance_booking_days: s.advance_booking_days || 14,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [reset]);

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (existingShop) {
        await updateShopApi(existingShop.id, data);
        toast.success('Salon profile updated!');
      } else {
        await createShopApi(data);
        toast.success('Salon registered and submitted for approval!');
      }
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save shop profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockedDate || !existingShop) return;
    try {
      await blockDateApi(existingShop.id, { blocked_date: newBlockedDate, reason: blockedReason });
      setBlockedDates([...blockedDates, { blocked_date: newBlockedDate, reason: blockedReason }]);
      setNewBlockedDate('');
      setBlockedReason('');
      toast.success('Holiday date blocked');
    } catch (err) {
      toast.error('Failed to block date');
    }
  };

  const handleRemoveBlockedDate = async (dateStr) => {
    if (!existingShop) return;
    try {
      await unblockDateApi(existingShop.id, dateStr);
      setBlockedDates(blockedDates.filter((b) => b.blocked_date !== dateStr));
      toast.success('Date unblocked');
    } catch (err) {
      toast.error('Failed to unblock date');
    }
  };

  if (loading) return <Loader message="Loading shop profile..." />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">Salon Setup & Settings</h1>
        <p className="text-xs text-neutral-500">Configure your salon details, location, hours, and holiday calendar</p>
      </div>

      {/* Step Indicator */}
      <div className="flex border-b border-neutral-200 space-x-4 text-xs font-semibold text-neutral-500">
        {[
          { id: 1, label: '1. Basic Info' },
          { id: 2, label: '2. Location' },
          { id: 3, label: '3. Media & Photos' },
          { id: 4, label: '4. Blocked Dates' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`pb-3 border-b-2 transition-all ${
              step === s.id
                ? 'border-primary-500 text-primary-600 font-bold'
                : 'border-transparent hover:text-neutral-800'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">Basic Information</h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Salon Name</label>
              <input
                type="text"
                {...register('name', { required: 'Salon name is required' })}
                placeholder="e.g. Crown Barber Studio"
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Description</label>
              <textarea
                rows="3"
                {...register('description')}
                placeholder="Describe your salon's specialties, atmosphere, and amenities..."
                className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  placeholder="+94 11 234 5678"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Public Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="contact@salon.lk"
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">Location Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  District (Sri Lanka)
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    const dist = e.target.value;
                    setSelectedDistrict(dist);
                    const towns = getTownsByDistrict(dist);
                    const defaultTown = towns[0] || dist;
                    setSelectedArea(defaultTown);
                    setValue('city', `${defaultTown}, ${dist}`);
                  }}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white font-medium"
                >
                  {ALL_SRI_LANKA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d} District
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Area / Town / Suburb
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => {
                    const area = e.target.value;
                    setSelectedArea(area);
                    if (area === 'Other') {
                      setValue('city', customArea ? `${customArea}, ${selectedDistrict}` : selectedDistrict);
                    } else {
                      setValue('city', `${area}, ${selectedDistrict}`);
                    }
                  }}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white font-medium"
                >
                  {getTownsByDistrict(selectedDistrict).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                  <option value="Other">Other / Custom Area...</option>
                </select>
              </div>
            </div>

            {selectedArea === 'Other' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">
                  Custom Area / Village Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nilaveli Beach Road"
                  value={customArea}
                  onChange={(e) => {
                    setCustomArea(e.target.value);
                    setValue('city', `${e.target.value}, ${selectedDistrict}`);
                  }}
                  className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>
            )}

            <input type="hidden" {...register('city', { required: 'City/Area is required' })} />

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Street Address</label>
              <textarea
                rows="2"
                {...register('address', { required: 'Address is required' })}
                placeholder="45 Galle Road, Bambalapitiya, Colombo 03"
                className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              ></textarea>
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">Photos & Branding</h3>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Cover Image URL</label>
              <input
                type="url"
                {...register('cover_image_url')}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Logo URL</label>
              <input
                type="url"
                {...register('logo_url')}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-neutral-900">Holiday & Blocked Dates</h3>
            <p className="text-xs text-neutral-500">Block specific dates for Poya days, holidays, or maintenance.</p>

            <div className="flex gap-2">
              <input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                className="border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              />
              <input
                type="text"
                placeholder="Reason (e.g. Poya Day)"
                value={blockedReason}
                onChange={(e) => setBlockedReason(e.target.value)}
                className="flex-1 border border-neutral-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddBlockedDate}
                className="bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Block Date
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {blockedDates.map((b, idx) => (
                <div key={idx} className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl text-xs">
                  <span>{b.blocked_date} — <span className="font-semibold">{b.reason || 'Holiday'}</span></span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlockedDate(b.blocked_date)}
                    className="text-red-600 font-bold hover:underline"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-between border-t border-neutral-100">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 border border-neutral-200"
            >
              Previous
            </button>
          ) : <div />}

          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow transition-colors"
          >
            {submitting ? 'Saving...' : existingShop ? 'Update Salon Settings' : 'Submit Salon for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopSetup;
