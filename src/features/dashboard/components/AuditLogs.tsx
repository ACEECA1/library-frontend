import { useState, useEffect } from "react";
import { adminApi } from "../../../lib/api";
import { 
  UploadCloud, BookOpen, MessageSquare, AlertTriangle, ShieldCheck, 
  Shield, UserCheck, UserX, Clock, Key, Activity
} from "lucide-react";
import { useTranslation } from "react-i18next";

export function AuditLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminApi.getAuditLogs({ size: 50, sort: 'createdAt,desc' });
        // The API returns the Page directly, so we use res.data.content
        setLogs(res.data.content || []);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const getActionConfig = (action: string) => {
    switch (action) {
      case 'UPLOAD_BOOK': return { icon: UploadCloud, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Upload' };
      case 'APPROVE_BOOK': return { icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Approve Book' };
      case 'ADD_COMMENT':
      case 'PUBLISH_COMMENT': return { icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Comment' };
      case 'SUBMIT_REPORT': return { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Report' };
      case 'RESOLVE_REPORT': return { icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-100', label: 'Resolve Report' };
      case 'CREATE_ROLE':
      case 'UPDATE_ROLE':
      case 'ASSIGN_ROLE':
      case 'ASSIGN_ROLE_BULK': return { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Role Update' };
      case 'APPROVE_USER': return { icon: UserCheck, color: 'text-teal-600', bg: 'bg-teal-100', label: 'User Approve' };
      case 'BAN_USER': return { icon: UserX, color: 'text-red-600', bg: 'bg-red-100', label: 'Ban User' };
      case 'TIMEOUT_USER': return { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Timeout' };
      case 'APPROVE_PASSWORD_RESET':
      case 'REJECT_PASSWORD_RESET': return { icon: Key, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Password Reset' };
      default: return { icon: Activity, color: 'text-gray-500', bg: 'bg-gray-100', label: 'System Action' };
    }
  };

  if (loading) return <div className="text-gray-500 p-4">{t('audit.loading')}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">{t('audit.title')}</h2>
      
      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500 border border-gray-100">
            {t('audit.noLogs')}
          </div>
        ) : (
          logs.map((log, i) => {
            const config = getActionConfig(log.action);
            const Icon = config.icon;
            return (
              <div key={log.id || i} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon size={20} className={config.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{log.username}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-400 font-medium whitespace-nowrap ml-2">
                      {getRelativeTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
