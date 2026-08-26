import React, { useEffect, useState } from 'react';
import { getMyShopApi } from '../../api/shopApi';
import { getStaffByShopApi, addStaffApi, updateStaffApi, deleteStaffApi } from '../../api/staffApi';
import StaffForm from '../../components/owner/StaffForm';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { useToast } from '../../hooks/useToast';
import { User, Plus, Edit2, Trash2 } from 'lucide-react';

const ManageStaff = () => {
  const [shop, setShop] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadStaff = async () => {
    try {
      const sRes = await getMyShopApi();
      const shopObj = sRes.data.data;
      setShop(shopObj);
      if (shopObj) {
        const staffRes = await getStaffByShopApi(shopObj.id);
        setStaffList(staffRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleFormSubmit = async (data) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('shop_id', shop.id);
      formData.append('name', data.name);
      formData.append('specialization', data.specialization);
      if (data.avatar && data.avatar[0]) {
        formData.append('avatar', data.avatar[0]);
      }

      if (editingStaff) {
        await updateStaffApi(editingStaff.id, formData);
        toast.success('Staff member updated!');
      } else {
        await addStaffApi(formData);
        toast.success('New staff member added!');
      }
      setModalOpen(false);
      loadStaff();
    } catch (err) {
      toast.error('Failed to save staff member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this staff member?')) return;
    try {
      await deleteStaffApi(id);
      toast.success('Staff member removed');
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (err) {
      toast.error('Failed to remove staff member');
    }
  };

  if (loading) return <Loader message="Loading staff..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <User className="w-6 h-6 text-primary-500" />
            <span>Manage Salon Staff & Stylists</span>
          </h1>
          <p className="text-xs text-neutral-500">Configure team members available for customer selection</p>
        </div>

        <button
          onClick={() => {
            setEditingStaff(null);
            setModalOpen(true);
          }}
          className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((st) => (
          <div key={st.id} className="bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={st.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'}
                alt={st.name}
                className="w-16 h-16 rounded-2xl object-cover border border-neutral-200"
              />
              <div>
                <h4 className="font-display font-bold text-base text-neutral-900">{st.name}</h4>
                <p className="text-xs text-primary-600 font-semibold">{st.specialization}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingStaff(st);
                  setModalOpen(true);
                }}
                className="p-2 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-neutral-100"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(st.id)}
                className="p-2 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
      >
        <StaffForm
          initialData={editingStaff}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
};

export default ManageStaff;
