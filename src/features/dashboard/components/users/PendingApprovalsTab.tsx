import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import api, { adminApi } from "../../../../lib/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { UserDTO } from "../../../../lib/types";

export function PendingApprovalsTab({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const { t } = useTranslation();
  const [pendingUsers, setPendingUsers] = useState<UserDTO[]>([]);
  const [selectedPending, setSelectedPending] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPendingUsers();
      const content = res.data.data?.content || [];
      setPendingUsers(content);
      if (onCountChange) onCountChange(content.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      const newPending = pendingUsers.filter(u => u.id !== id);
      setPendingUsers(newPending);
      setSelectedPending(prev => prev.filter(selectedId => selectedId !== id));
      if (onCountChange) onCountChange(newPending.length);
      toast.success(t('userManagement.userApproved'));
    } catch (err) {
      console.error(err);
      toast.error(t('userManagement.failedApprove'));
    }
  };

  const batchApprove = async () => {
    if (selectedPending.length === 0) return;
    try {
      await adminApi.approveBulkUsers(selectedPending);
      const newPending = pendingUsers.filter(u => !selectedPending.includes(u.id));
      setPendingUsers(newPending);
      setSelectedPending([]);
      if (onCountChange) onCountChange(newPending.length);
      toast.success(t('userManagement.usersApproved'));
    } catch (err) {
      console.error(err);
      toast.error(t('userManagement.failedApproveUsers'));
    }
  };

  const togglePending = (id: number) => {
    setSelectedPending(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPending(pendingUsers.map(u => u.id));
    } else {
      setSelectedPending([]);
    }
  };

  return (
    <div className="mb-12 animate-in fade-in">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-lg font-bold text-gray-800">{t('userManagement.reviewRegistrations')}</h2>
        {selectedPending.length > 0 && (
          <button onClick={batchApprove} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-700 transition-colors shadow-sm">
            <Check size={16} /> {t('userManagement.batchApprove')} ({selectedPending.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="w-full text-sm text-left bg-white">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input 
                  type="checkbox" 
                  className="rounded text-[#00502D] focus:ring-[#00502D]" 
                  onChange={toggleAllPending} 
                  checked={selectedPending.length === pendingUsers.length && pendingUsers.length > 0} 
                />
              </th>
              <th className="px-4 py-3">{t('userManagement.userInfo')}</th>
              <th className="px-4 py-3">{t('userManagement.email')}</th>
              <th className="px-4 py-3">{t('userManagement.registrationDate')}</th>
              <th className="px-4 py-3 text-right">{t('userManagement.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded text-[#00502D] focus:ring-[#00502D]" 
                    checked={selectedPending.includes(u.id)} 
                    onChange={() => togglePending(u.id)} 
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-gray-900">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-gray-500 font-medium">@{u.username}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{u.email || 'N/A'}</td>
                <td className="px-4 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleString() : 'N/A'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => approveUser(u.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors" title={t('userManagement.approve')}><Check size={18} /></button>
                    <button className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title={t('userManagement.decline')}><X size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">{t('userManagement.noPending')}</td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">{t('userManagement.loading')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
