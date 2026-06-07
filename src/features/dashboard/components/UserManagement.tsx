import { useState, useEffect } from "react";
import { Check, X, UserCog, Search, Users, UserPlus, Clock } from "lucide-react";
import api, { adminApi } from "../../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";

export function UserManagement() {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'approvals'>(hasPermission('ASSIGN_ROLE') ? 'users' : 'approvals');
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allRoles, setAllRoles] = useState<any[]>([]);
  const [selectedPending, setSelectedPending] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignRoleUserId, setAssignRoleUserId] = useState<number | null>(null);
  const [selectedRolesForUser, setSelectedRolesForUser] = useState<string[]>([]);
  const [banUserId, setBanUserId] = useState<number | null>(null);
  const [timeoutUserId, setTimeoutUserId] = useState<number | null>(null);
  const [actionReason, setActionReason] = useState("");
  const [timeoutMinutes, setTimeoutMinutes] = useState(60);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const calls: Promise<any>[] = [];
      if (activeTab === 'approvals' && hasPermission('APPROVE_USER')) {
        calls.push(adminApi.getPendingUsers().then(res => setPendingUsers(res.data.data?.content || [])));
      }
      if (activeTab === 'users' && hasPermission('ASSIGN_ROLE')) {
        calls.push(adminApi.getUsers({ search: searchQuery }).then(res => setAllUsers(res.data.data?.content || [])));
        calls.push(adminApi.getRoles({ size: 50 }).then(res => setAllRoles(res.data.data?.content || [])));
      }
      await Promise.all(calls);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const approveUser = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setSelectedPending(prev => prev.filter(selectedId => selectedId !== id));
      toast.success("User approved");
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

  const handleBanUser = async () => {
    if (!banUserId || !actionReason.trim()) return;
    try {
      await adminApi.banUser(banUserId, actionReason);
      toast.success("User banned successfully");
      setBanUserId(null);
      setActionReason("");
      fetchData();
    } catch (e) {
      toast.error("Failed to ban user");
    }
  };

  const handleTimeoutUser = async () => {
    if (!timeoutUserId || !actionReason.trim()) return;
    try {
      await adminApi.timeoutUser(timeoutUserId, timeoutMinutes, actionReason);
      toast.success("User timed out successfully");
      setTimeoutUserId(null);
      setActionReason("");
      fetchData();
    } catch (e) {
      toast.error("Failed to timeout user");
    }
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'BANNED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {hasPermission('ASSIGN_ROLE') && (
          <button 
            className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> All Users
          </button>
        )}
        {hasPermission('APPROVE_USER') && (
          <button 
            className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('approvals')}
          >
            <UserPlus size={18} /> Pending Approvals
            {pendingUsers.length > 0 && activeTab !== 'approvals' && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingUsers.length}</span>
            )}
          </button>
        )}
      </div>

      {activeTab === 'approvals' && hasPermission('APPROVE_USER') && (
        <div className="mb-12 animate-in fade-in">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-bold text-gray-800">Review New Registrations</h2>
            {selectedPending.length > 0 && (
              <button onClick={batchApprove} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-700 transition-colors shadow-sm">
                <Check size={16} /> Batch Approve ({selectedPending.length})
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
                  <th className="px-4 py-3">User Info</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Registration Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
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
                    <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => approveUser(u.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors" title="Approve"><Check size={18} /></button>
                        <button className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Decline"><X size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {pendingUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">No pending users awaiting approval.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && hasPermission('ASSIGN_ROLE') && (
        <div className="animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
            <h2 className="text-lg font-bold text-gray-800">User Directory</h2>
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by name or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D]"
              />
            </form>
          </div>
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full text-sm text-left bg-white">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Roles</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map(u => (
                  <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-gray-500 font-medium">@{u.username}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded shadow-sm text-xs font-bold ${getStatusStyle(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles?.length ? u.roles.map((r: string) => (
                          <span key={r} className="bg-gray-100 border border-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">{r}</span>
                        )) : <span className="text-gray-400 italic text-xs">No roles</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openAssignRoles(u)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title="Manage Roles">
                          <UserCog size={18} />
                        </button>
                        {hasPermission('BAN_USER') && (
                          <>
                            <button onClick={() => setBanUserId(u.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title="Ban User">
                              <X size={18} />
                            </button>
                            <button onClick={() => setTimeoutUserId(u.id)} className="p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors" title="Timeout User">
                              <Clock size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {allUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-500">No users found.</td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {assignRoleUserId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-1 text-gray-900">Manage Roles</h3>
            <p className="text-sm text-gray-500 mb-6">Select the roles to assign to this user.</p>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50/50">
              {allRoles.map(role => (
                <label key={role.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors">
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
                    className="rounded w-4 h-4 text-[#00502D] focus:ring-[#00502D]"
                  />
                  <span className="font-medium text-gray-800">{role.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setAssignRoleUserId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleAssignRolesSubmit} className="px-4 py-2 bg-[#00502D] text-white rounded-lg font-medium hover:bg-[#003a20] transition-colors shadow-sm">Save Roles</button>
            </div>
          </div>
        </div>
      )}

      {banUserId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-red-600">Ban User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Ban</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#00502D] focus:border-[#00502D]"
                rows={3}
                placeholder="Provide a reason for the ban..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setBanUserId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleBanUser} disabled={!actionReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50">Ban User</button>
            </div>
          </div>
        </div>
      )}

      {timeoutUserId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-orange-600">Timeout User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeout Duration (Minutes)</label>
              <input
                type="number"
                min="1"
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(parseInt(e.target.value) || 60)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#00502D] focus:border-[#00502D]"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#00502D] focus:border-[#00502D]"
                rows={3}
                placeholder="Provide a reason..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setTimeoutUserId(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
              <button onClick={handleTimeoutUser} disabled={!actionReason.trim()} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50">Timeout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
