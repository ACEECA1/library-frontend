import { useState, useEffect } from "react";
import { UserCog, Search, X, Clock } from "lucide-react";
import { adminApi } from "../../../../lib/api";
import { useTranslation } from "react-i18next";
import { UserDTO, RoleDTO } from "../../../../lib/types";
import { AssignRolesModal } from "./AssignRolesModal";
import { BanUserModal } from "./BanUserModal";
import { TimeoutUserModal } from "./TimeoutUserModal";

export function AllUsersTab({ hasBanPermission }: { hasBanPermission: boolean }) {
  const { t } = useTranslation();
  const [allUsers, setAllUsers] = useState<UserDTO[]>([]);
  const [allRoles, setAllRoles] = useState<RoleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [assignRoleUserId, setAssignRoleUserId] = useState<number | null>(null);
  const [selectedRolesForUser, setSelectedRolesForUser] = useState<string[]>([]);
  const [banUserId, setBanUserId] = useState<number | null>(null);
  const [timeoutUserId, setTimeoutUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        adminApi.getUsers({ search: searchQuery }),
        adminApi.getRoles({ size: 50 })
      ]);
      setAllUsers(usersRes.data.data?.content || []);
      setAllRoles(rolesRes.data.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchData();
  };

  const openAssignRoles = (user: UserDTO) => {
    setAssignRoleUserId(user.id);
    setSelectedRolesForUser(user.roles || []);
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
    <div className="animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
        <h2 className="text-lg font-bold text-gray-800">{t('userManagement.allUsers')}</h2>
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder={t('userManagement.searchPlaceholder')}
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
              <th className="px-4 py-3">{t('userManagement.user')}</th>
              <th className="px-4 py-3">{t('userManagement.status')}</th>
              <th className="px-4 py-3">{t('userManagement.roles')}</th>
              <th className="px-4 py-3">{t('userManagement.joined')}</th>
              <th className="px-4 py-3 text-right">{t('userManagement.actions')}</th>
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
                    )) : <span className="text-gray-400 italic text-xs">{t('userManagement.noRoles')}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openAssignRoles(u)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors" title={t('userManagement.manageRoles')}>
                      <UserCog size={18} />
                    </button>
                    {hasBanPermission && (
                      <>
                        <button onClick={() => setBanUserId(u.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors" title={t('userManagement.banUser')}>
                          <X size={18} />
                        </button>
                        <button onClick={() => setTimeoutUserId(u.id)} className="p-1.5 text-orange-600 hover:bg-orange-100 rounded transition-colors" title={t('userManagement.timeoutUser')}>
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
                <td colSpan={5} className="px-4 py-12 text-center text-gray-500">{t('userManagement.noUsers')}</td>
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

      {assignRoleUserId && (
        <AssignRolesModal 
          userId={assignRoleUserId} 
          allRoles={allRoles} 
          initialRoles={selectedRolesForUser} 
          onClose={() => setAssignRoleUserId(null)} 
          onSuccess={() => { setAssignRoleUserId(null); fetchData(); }} 
        />
      )}

      {banUserId && (
        <BanUserModal 
          userId={banUserId} 
          onClose={() => setBanUserId(null)} 
          onSuccess={() => { setBanUserId(null); fetchData(); }} 
        />
      )}

      {timeoutUserId && (
        <TimeoutUserModal 
          userId={timeoutUserId} 
          onClose={() => setTimeoutUserId(null)} 
          onSuccess={() => { setTimeoutUserId(null); fetchData(); }} 
        />
      )}
    </div>
  );
}
