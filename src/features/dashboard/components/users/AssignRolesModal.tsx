import { useTranslation } from "react-i18next";
import api from "../../../../lib/api";
import { toast } from "sonner";
import { useState } from "react";
import { RoleDTO } from "../../../../lib/types";

export function AssignRolesModal({ 
  userId, 
  allRoles, 
  initialRoles, 
  onClose, 
  onSuccess 
}: { 
  userId: number; 
  allRoles: RoleDTO[]; 
  initialRoles: string[]; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);

  const handleSubmit = async () => {
    try {
      await api.put(`/admin/users/${userId}/roles`, selectedRoles);
      toast.success(t('userManagement.rolesUpdated'));
      onSuccess();
    } catch (e) {
      toast.error(t('userManagement.failedRoles'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-1 text-gray-900">{t('userManagement.manageRoles')}</h3>
        <p className="text-sm text-gray-500 mb-6">{t('userManagement.selectRolesMsg')}</p>
        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto border border-gray-200 p-3 rounded-lg bg-gray-50/50">
          {allRoles.map(role => (
            <label key={role.name} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 transition-colors">
              <input 
                type="checkbox" 
                checked={selectedRoles.includes(role.name)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRoles([...selectedRoles, role.name]);
                  } else {
                    setSelectedRoles(selectedRoles.filter(r => r !== role.name));
                  }
                }}
                className="rounded w-4 h-4 text-[#00502D] focus:ring-[#00502D]"
              />
              <span className="font-medium text-gray-800">{role.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">{t('userManagement.cancel')}</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-[#00502D] text-white rounded-lg font-medium hover:bg-[#003a20] transition-colors shadow-sm">{t('userManagement.saveRoles')}</button>
        </div>
      </div>
    </div>
  );
}
