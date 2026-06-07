import { useState, useEffect } from "react";
import { Shield, Plus, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";
import api, { adminApi } from "../../../lib/api";
import { toast } from "sonner";

export function RolesManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [expandedRoleId, setExpandedRoleId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        adminApi.getRoles({ size: 50 }),
        adminApi.getPermissions()
      ]);
      setRoles(rolesRes.data.data?.content || []);
      setPermissions(permsRes.data.data || []);
    } catch (err) {
      toast.error("Failed to load roles data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    try {
      const formattedName = newRoleName.trim().toUpperCase().replace(/\s+/g, '_');
      await adminApi.addRole({ name: formattedName, permissions: [] });
      toast.success("Role created successfully");
      setNewRoleName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create role");
    }
  };

  const togglePermission = async (roleId: number, permission: string, currentPermissions: string[]) => {
    const isAssigned = currentPermissions.includes(permission);
    const newPerms = isAssigned 
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission];
    
    // Optimistic UI update
    setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions: newPerms } : r));

    try {
      await api.put(`/admin/roles/${roleId}`, { permissions: newPerms });
      toast.success("Permissions updated");
    } catch (err) {
      toast.error("Failed to update permissions");
      // Revert on failure
      fetchData();
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading roles and permissions...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Shield className="text-[#00502D]" />
          Roles & Permissions
        </h2>
        <p className="text-gray-600">Manage access levels and define what different user roles can do across the platform.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-[#00502D]" />
          Create New Role
        </h3>
        <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input 
              type="text" 
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder="e.g. MODERATOR, CONTENT_CREATOR" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D] transition-colors uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">Role names are automatically converted to UPPERCASE with underscores.</p>
          </div>
          <button 
            type="submit" 
            disabled={!newRoleName.trim()}
            className="w-full sm:w-auto bg-[#00502D] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#003a20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Create Role
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Existing Roles</h3>
        {roles.map(role => {
          const isExpanded = expandedRoleId === role.id;
          const isAdmin = role.name === 'ADMIN';

          return (
            <div key={role.id} className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'border-[#00502D] shadow-md' : 'border-gray-200 shadow-sm hover:border-gray-300'}`}>
              <div 
                className={`px-6 py-4 flex items-center justify-between cursor-pointer select-none transition-colors ${isExpanded ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isAdmin ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{role.name}</h4>
                    <p className="text-sm text-gray-500">{role.permissions?.length || 0} permissions assigned</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 py-6 border-t border-gray-100 bg-white">
                  {isAdmin && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                      <AlertCircle className="shrink-0 mt-0.5" size={18} />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">System Role</p>
                        <p>The ADMIN role has full access to all system features. Its permissions cannot be modified.</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                    {permissions.map(perm => {
                      const isAssigned = role.permissions?.includes(perm);
                      return (
                        <label 
                          key={perm} 
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isAssigned ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-transparent hover:border-gray-200'} ${isAdmin ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isAssigned || false}
                            onChange={() => togglePermission(role.id, perm, role.permissions || [])}
                            className="mt-1 w-4 h-4 rounded text-[#00502D] focus:ring-[#00502D] border-gray-300 disabled:opacity-50"
                            disabled={isAdmin}
                          />
                          <div>
                            <span className={`block text-sm font-semibold ${isAssigned ? 'text-green-900' : 'text-gray-700'}`}>
                              {perm}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
