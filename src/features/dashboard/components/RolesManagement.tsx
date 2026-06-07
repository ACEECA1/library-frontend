import { useState, useEffect } from "react";
import { Shield, Plus } from "lucide-react";
import api, { adminApi } from "../../../lib/api";
import { toast } from "sonner";
export function RolesManagement() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const fetchData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        adminApi.getRoles({ size: 50 }),
        adminApi.getPermissions()
      ]);
      setRoles(rolesRes.data.data.content || []);
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
      await adminApi.addRole({ name: newRoleName, permissions: [] });
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
    try {
      await api.put(`/admin/roles/${roleId}`, { permissions: newPerms });
      toast.success("Permissions updated");
      fetchData();
    } catch (err) {
      toast.error("Failed to update permissions");
    }
  };
  if (loading) return <div className="text-gray-500">Loading roles...</div>;
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Roles & Permissions</h2>
          <p className="text-gray-500 text-sm mt-1">Manage what different user roles can do across the platform.</p>
        </div>
        <form onSubmit={handleCreateRole} className="flex gap-2">
          <input 
            type="text" 
            value={newRoleName}
            onChange={e => setNewRoleName(e.target.value)}
            placeholder="New Role Name (e.g. EDITOR)" 
            className="border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00502D]"
          />
          <button type="submit" className="bg-[#00502D] text-white px-3 py-2 rounded flex items-center gap-1 hover:bg-[#003a20] transition-colors">
            <Plus size={16} /> Create
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roles.map(role => (
          <div key={role.id} className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Shield size={18} className="text-[#00502D]" />
                {role.name}
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Permissions</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                {permissions.map(perm => {
                  const isAssigned = role.permissions.includes(perm);
                  return (
                    <label key={perm} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900">
                      <input 
                        type="checkbox" 
                        checked={isAssigned}
                        onChange={() => togglePermission(role.id, perm, role.permissions)}
                        className="rounded text-[#00502D] focus:ring-[#00502D] disabled:opacity-50"
                        disabled={role.name === 'ADMIN'}
                      />
                      <span className={role.name === 'ADMIN' ? 'opacity-70' : ''}>{perm}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
