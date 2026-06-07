import { useState, useEffect } from "react";
import { Shield, Plus, ChevronDown, ChevronUp, AlertCircle, Trash2 } from "lucide-react";
import api, { adminApi } from "../../../lib/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export function RolesManagement() {
  const { t } = useTranslation();
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
      toast.error(t('rolesManagement.failedUpdate'));
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
      toast.success(t('rolesManagement.roleCreated'));
      setNewRoleName("");
      fetchData();
    } catch (err) {
      toast.error(t('rolesManagement.failedCreate'));
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
      toast.success(t('rolesManagement.permissionsUpdated'));
    } catch (err) {
      toast.error(t('rolesManagement.failedUpdate'));
      // Revert on failure
      fetchData();
    }
  };

  const handleDeleteRole = async (e: React.MouseEvent, roleId: number) => {
    e.stopPropagation();
    if (!window.confirm(t('rolesManagement.deleteConfirm'))) return;

    try {
      await api.delete(`/admin/roles/${roleId}`);
      toast.success(t('rolesManagement.roleDeleted'));
      fetchData();
    } catch (err) {
      toast.error(t('rolesManagement.failedDelete'));
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">{t('rolesManagement.loading')}</div>;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <Shield className="text-[#00502D]" />
          {t('rolesManagement.rolesAndPermissions')}
        </h2>
        <p className="text-gray-600">{t('rolesManagement.description')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={20} className="text-[#00502D]" />
          {t('rolesManagement.createNewRole')}
        </h3>
        <form onSubmit={handleCreateRole} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('rolesManagement.roleName')}</label>
            <input 
              type="text" 
              value={newRoleName}
              onChange={e => setNewRoleName(e.target.value)}
              placeholder={t('rolesManagement.roleNamePlaceholder')} 
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00502D] focus:ring-1 focus:ring-[#00502D] transition-colors uppercase"
            />
            <p className="text-xs text-gray-500 mt-1">{t('rolesManagement.roleNameHint')}</p>
          </div>
          <button 
            type="submit" 
            disabled={!newRoleName.trim()}
            className="w-full sm:w-auto bg-[#00502D] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#003a20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {t('rolesManagement.createRole')}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('rolesManagement.existingRoles')}</h3>
        {roles.map(role => {
          const isExpanded = expandedRoleId === role.id;
          const isAdmin = role.name === 'ADMIN' || role.name === 'USER'; // Prevent deleting fundamental roles

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
                    <p className="text-sm text-gray-500">{role.permissions?.length || 0} {t('rolesManagement.permissionsAssigned')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!isAdmin && (
                    <button 
                      onClick={(e) => handleDeleteRole(e, role.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Role"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="text-gray-400">
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-6 py-6 border-t border-gray-100 bg-white">
                  {isAdmin && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800">
                      <AlertCircle className="shrink-0 mt-0.5" size={18} />
                      <div className="text-sm">
                        <p className="font-semibold mb-1">{t('rolesManagement.systemRole')}</p>
                        <p>{t('rolesManagement.systemRoleDesc')}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                    {permissions.map(perm => {
                      const isAssigned = role.permissions?.includes(perm);
                      const isPermDisabled = role.name === 'ADMIN';

                      return (
                        <label 
                          key={perm} 
                          className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${isAssigned ? 'bg-green-50/50 border-green-200' : 'bg-gray-50 border-transparent hover:border-gray-200'} ${isPermDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            checked={isAssigned || false}
                            onChange={() => togglePermission(role.id, perm, role.permissions || [])}
                            className="mt-1 w-4 h-4 rounded text-[#00502D] focus:ring-[#00502D] border-gray-300 disabled:opacity-50"
                            disabled={isPermDisabled}
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
