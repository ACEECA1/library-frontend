import { useState, useEffect } from "react";
import { Check, X, UserCog } from "lucide-react";
import api, { adminApi } from "../../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
export function UserManagement() {
  const { hasPermission } = useAuth();
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [selectedPending, setSelectedPending] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignRoleUserId, setAssignRoleUserId] = useState<number | null>(null);
  const [selectedRolesForUser, setSelectedRolesForUser] = useState<string[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const calls: Promise<any>[] = [];
      if (hasPermission('APPROVE_USER')) {
        calls.push(adminApi.getPendingUsers().then(res => setPendingUsers(res.data.data.content || [])));
      }
      if (hasPermission('ASSIGN_ROLE')) {
        calls.push(adminApi.getUsers().then(res => setAllUsers(res.data.data.content || [])));
        calls.push(adminApi.getRoles({ size: 50 }).then(res => setAllRoles(res.data.data.content || [])));
      }
      await Promise.all(calls);
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
      toast.success("User approved");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve user");
    }
  };
  const batchApprove = async () => {
    if (selectedPending.length === 0) return;
    try {
      await adminApi.approveBulkUsers(selectedPending);
      setPendingUsers(prev => prev.filter(u => !selectedPending.includes(u.id)));
      setSelectedPending([]);
      toast.success("Users approved");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve users");
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
  const handleAssignRolesSubmit = async () => {
    if (!assignRoleUserId) return;
    try {
      await api.put(`/admin/users/${assignRoleUserId}/roles`, selectedRolesForUser);
      toast.success("Roles updated successfully");
      setAssignRoleUserId(null);
      fetchData();
    } catch (e) {
      toast.error("Failed to update roles");
    }
  };
  const openAssignRoles = (user: any) => {
    setAssignRoleUserId(user.id);
    setSelectedRolesForUser(user.roles || []);
  };
  return (
    <div>
      {hasPermission('APPROVE_USER') && (
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-xl font-bold">Pending Approvals</h2>
            {selectedPending.length > 0 && (
              <button onClick={batchApprove} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-700">
                <Check size={16} /> Batch Approve ({selectedPending.length})
              </button>
            )}
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
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
                  <th className="px-4 py-3">User Info</th>
                  <th className="px-4 py-3">Registration Date</th>
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
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-gray-500">@{u.username} � {u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleString()}</td>
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
      )}
      {hasPermission('ASSIGN_ROLE') && (
        <div>
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-gray-500">@{u.username}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${u.accountStatus === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.map((r: string) => (
                          <span key={r} className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">{r}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => openAssignRoles(u)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Manage Roles">
                        <UserCog size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {assignRoleUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Assign Roles</h3>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto border p-3 rounded">
              {allRoles.map(role => (
                <label key={role.name} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-50 rounded">
                  <input 
                    type="checkbox" 
                    checked={selectedRolesForUser.includes(role.name)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRolesForUser([...selectedRolesForUser, role.name]);
                      } else {
                        setSelectedRolesForUser(selectedRolesForUser.filter(r => r !== role.name));
                      }
                    }}
                    className="rounded text-[#00502D] focus:ring-[#00502D]"
                  />
                  <span>{role.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setAssignRoleUserId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium">Cancel</button>
              <button onClick={handleAssignRolesSubmit} className="px-4 py-2 bg-[#00502D] text-white rounded font-medium hover:bg-[#003a20]">Save Roles</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
