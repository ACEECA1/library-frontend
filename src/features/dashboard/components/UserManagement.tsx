import { useState, useEffect } from "react";
import { Users, UserPlus } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { adminApi } from "../../../lib/api";
import { PendingApprovalsTab } from "./users/PendingApprovalsTab";
import { AllUsersTab } from "./users/AllUsersTab";

export function UserManagement() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  
  const canAssignRole = hasPermission('ASSIGN_ROLE');
  const canApproveUser = hasPermission('APPROVE_USER');
  const canBanUser = hasPermission('BAN_USER');

  const [activeTab, setActiveTab] = useState<'users' | 'approvals'>(canAssignRole ? 'users' : 'approvals');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (canApproveUser) {
      adminApi.getPendingUsers().then(res => {
        setPendingCount(res.data.data?.content?.length || 0);
      }).catch(console.error);
    }
  }, [canApproveUser]);

  return (
    <div>
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {canAssignRole && (
          <button 
            className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'users' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> {t('userManagement.allUsers')}
          </button>
        )}
        {canApproveUser && (
          <button 
            className={`pb-3 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('approvals')}
          >
            <UserPlus size={18} /> {t('userManagement.pendingApprovals')}
            {pendingCount > 0 && activeTab !== 'approvals' && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        )}
      </div>

      {activeTab === 'approvals' && canApproveUser && (
        <PendingApprovalsTab onCountChange={setPendingCount} />
      )}

      {activeTab === 'users' && canAssignRole && (
        <AllUsersTab hasBanPermission={canBanUser} />
      )}
    </div>
  );
}
