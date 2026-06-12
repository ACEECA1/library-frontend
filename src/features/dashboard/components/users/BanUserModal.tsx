import { useTranslation } from "react-i18next";
import { adminApi } from "../../../../../lib/api";
import { toast } from "sonner";
import { useState } from "react";

export function BanUserModal({ 
  userId, 
  onClose, 
  onSuccess 
}: { 
  userId: number; 
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { t } = useTranslation();
  const [actionReason, setActionReason] = useState("");

  const handleSubmit = async () => {
    if (!actionReason.trim()) return;
    try {
      await adminApi.banUser(userId, actionReason);
      toast.success(t('userManagement.userBanned'));
      onSuccess();
    } catch (e) {
      toast.error(t('userManagement.failedBan'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold mb-4 text-red-600">{t('userManagement.banUser')}</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('userManagement.reasonForBan')}</label>
          <textarea
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-[#00502D] focus:border-[#00502D]"
            rows={3}
            placeholder={t('userManagement.provideBanReason')}
            required
          />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors">{t('userManagement.cancel')}</button>
          <button onClick={handleSubmit} disabled={!actionReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50">{t('userManagement.banUser')}</button>
        </div>
      </div>
    </div>
  );
}
