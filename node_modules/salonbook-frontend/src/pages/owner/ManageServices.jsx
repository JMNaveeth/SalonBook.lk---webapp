import React, { useEffect, useState } from 'react';
import { getMyShopApi } from '../../api/shopApi';
import { getServicesByShopApi, addServiceApi, updateServiceApi, deleteServiceApi } from '../../api/serviceApi';
import ServiceForm from '../../components/owner/ServiceForm';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import { formatLKR } from '../../utils/formatCurrency';
import { useToast } from '../../hooks/useToast';
import { Plus, Edit2, Trash2, Scissors } from 'lucide-react';

const ManageServices = () => {
  const [shop, setShop] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadServices = async () => {
    try {
      const sRes = await getMyShopApi();
      const shopObj = sRes.data.data;
      setShop(shopObj);
      if (shopObj) {
        const servRes = await getServicesByShopApi(shopObj.id);
        setServices(servRes.data.data || []);
      }
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingService) {
        await updateServiceApi(editingService.id, data);
        toast.success('Service updated!');
      } else {
        await addServiceApi({ ...data, shop_id: shop.id });
        toast.success('New service added!');
      }
      setModalOpen(false);
      loadServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteServiceApi(id);
      toast.success('Service deleted');
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      toast.error('Failed to delete service');
    }
  };

  if (loading) return <Loader message="Loading services..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
            <Scissors className="w-6 h-6 text-primary-500" />
            <span>Manage Salon Services</span>
          </h1>
          <p className="text-xs text-neutral-500">Add or edit prices, categories, and duration for your salon catalog</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Service</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Price (LKR)</th>
                <th className="py-3.5 px-6">Duration</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {services.map((ser) => (
                <tr key={ser.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-neutral-900">{ser.name}</td>
                  <td className="py-4 px-6 text-neutral-600 text-xs font-medium">
                    <span className="bg-neutral-100 px-2.5 py-1 rounded-md">{ser.category}</span>
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-neutral-900">{formatLKR(ser.price)}</td>
                  <td className="py-4 px-6 text-neutral-500 text-xs">{ser.duration_mins} mins</td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(ser)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ser.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
      >
        <ServiceForm
          initialData={editingService}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>
    </div>
  );
};

export default ManageServices;
