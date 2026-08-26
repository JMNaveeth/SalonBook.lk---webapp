import React, { useEffect, useState } from 'react';
import { getAllUsersApi, toggleUserBanApi } from '../../api/adminApi';
import Loader from '../../components/common/Loader';
import { useToast } from '../../hooks/useToast';
import { Users, Shield, AlertTriangle } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      setUsers(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userObj) => {
    const actionStr = userObj.is_active ? 'ban' : 'unban';
    if (!window.confirm(`Are you sure you want to ${actionStr} user ${userObj.name}?`)) return;

    try {
      await toggleUserBanApi(userObj.id, { is_active: !userObj.is_active });
      toast.success(`User ${userObj.name} has been ${actionStr}ned`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) return <Loader message="Fetching user directory..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-neutral-900 flex items-center space-x-2">
          <Users className="w-6 h-6 text-primary-500" />
          <span>Manage User Directory</span>
        </h1>
        <p className="text-xs text-neutral-500">View customer accounts, warning strike counts, and enforce account bans</p>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">User Name</th>
                <th className="py-3.5 px-6">Email / Phone</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Strikes</th>
                <th className="py-3.5 px-6">Account Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-sm">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-neutral-900">{u.name}</td>
                  <td className="py-4 px-6 text-xs text-neutral-600">
                    <div>{u.email}</div>
                    <div className="text-neutral-400 font-mono">{u.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-xs font-semibold uppercase">
                    <span
                      className={`px-2.5 py-1 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'owner'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-bold text-amber-600">
                    {u.warning_strikes > 0 ? (
                      <span className="flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span>{u.warning_strikes}/3</span>
                      </span>
                    ) : (
                      '0'
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.is_active ? 'Active' : 'Suspended / Banned'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBan(u)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          u.is_active
                            ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {u.is_active ? 'Ban Account' : 'Unban Account'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
