import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import api from "../../../lib/api";

export function UserManagement() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [selectedPending, setSelectedPending] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users/pending');
      setPendingUsers(res.data.data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setSelectedPending(prev => prev.filter(selectedId => selectedId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const batchApprove = async () => {
    if (selectedPending.length === 0) return;
    try {
      await api.post('/admin/users/approve-bulk', selectedPending);
      setPendingUsers(prev => prev.filter(u => !selectedPending.includes(u.id)));
      setSelectedPending([]);
    } catch (err) {
      console.error(err);
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
    <div>
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold">Pending Approvals</h2>
        {selectedPending.length > 0 && (
          <button onClick={batchApprove} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-700">
            <Check size={16} /> Batch Approve ({selectedPending.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto mb-10 border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left">
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded text-[#00502D] focus:ring-[#00502D]" 
                    checked={selectedPending.includes(u.id)} 
                    onChange={() => togglePending(u.id)} 
                  />
                </td>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.username}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => approveUser(u.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"><Check size={18} /></button>
                    <button className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"><X size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No pending users.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
