import React, { useEffect, useState } from 'react';
import { getProfileApi, updateProfileApi, getFavouritesApi, removeFavouriteApi } from '../../api/userApi';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Loader from '../../components/common/Loader';
import SalonCard from '../../components/customer/SalonCard';
import { User, Phone, Mail, AlertTriangle, Heart, Shield } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);

  const toast = useToast();

  const loadData = async () => {
    try {
      const [profRes, favRes] = await Promise.all([getProfileApi(), getFavouritesApi()]);
      const pData = profRes.data.data;
      setProfile(pData);
      setName(pData.name || '');
      setPhone(pData.phone || '');
      setFavourites(favRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      if (avatarFile) formData.append('avatar', avatarFile);

      const res = await updateProfileApi(formData);
      setProfile(res.data.data);
      updateUserProfile(res.data.data);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveFav = async (shopId) => {
    try {
      await removeFavouriteApi(shopId);
      setFavourites(favourites.filter((f) => f.id !== shopId));
      toast.success('Removed from saved salons');
    } catch (err) {
      toast.error('Failed to remove favourite');
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900">Account Profile</h1>
        <p className="text-xs text-neutral-500">Manage your personal info and saved salons</p>
      </div>

      {/* Warning Strike Alert Banner */}
      {profile?.warning_strikes > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <h4 className="font-bold">No-Show Warning Counter: {profile.warning_strikes}/3</h4>
            <p>
              Accumulating 3 no-show strikes results in automatic 7-day account suspension. Please cancel unneeded appointments 24h in advance.
            </p>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
              alt={profile?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-neutral-200"
            />
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Update Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="text-xs text-neutral-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-500 cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={updating}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow transition-all"
            >
              {updating ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Saved Favourite Salons */}
      <div className="space-y-4">
        <h3 className="text-xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          <span>Saved Salons</span>
        </h3>

        {favourites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favourites.map((shop) => (
              <div key={shop.id} className="relative">
                <SalonCard shop={shop} />
                <button
                  onClick={() => handleRemoveFav(shop.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white text-red-600 p-1.5 rounded-full shadow text-xs font-bold transition-colors"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-neutral-200 text-neutral-500 text-sm">
            No saved salons in your favourites list.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
