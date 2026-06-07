import { Check, ThumbsUp, ThumbsDown, BookOpen, Info, MessageSquare, AlertCircle, Clock, Star, ShieldCheck, UserCheck, Shield, Reply } from "lucide-react";
import { useNavigate } from "react-router";

export function NotificationItem({ notification, onMarkRead, onClick }: { notification: any, onMarkRead: (id: number) => void, onClick?: () => void }) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case 'UPVOTE':
        return { icon: ThumbsUp, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Upvote' };
      case 'DOWNVOTE':
        return { icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-100', label: 'Downvote' };
      case 'REPLY':
        return { icon: Reply, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Reply' };
      case 'BOOK_COMMENT':
        return { icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Comment' };
      case 'REVIEW':
        return { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Review' };
      case 'BOOK_PENDING_APPROVAL':
        return { icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Pending Approval' };
      case 'BOOK_APPROVED':
        return { icon: BookOpen, color: 'text-green-600', bg: 'bg-green-100', label: 'Book Approved' };
      case 'SYSTEM_MESSAGE':
        return { icon: Info, color: 'text-purple-600', bg: 'bg-purple-100', label: 'System' };
      case 'REPORT_RESOLVED':
        return { icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Report Resolved' };
      case 'USER_APPROVED':
        return { icon: UserCheck, color: 'text-green-600', bg: 'bg-green-100', label: 'User Approved' };
      case 'ROLE_ASSIGNED':
        return { icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-100', label: 'Role Update' };
      default:
        return { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Notification' };
    }
  };

  const config = getTypeConfig(notification.type);
  const Icon = config.icon;

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

  const handleClick = () => {
    if (!notification.read) onMarkRead(notification.id);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`group px-4 py-3 flex items-start gap-3 transition-colors border-b border-gray-100 relative cursor-pointer ${notification.read ? 'hover:bg-gray-50' : 'bg-[#00502D]/5 hover:bg-[#00502D]/10'}`}
    >
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00502D]"></div>
      )}
      <div className={`mt-0.5 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
        <Icon size={16} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm ${config.bg} ${config.color}`}>
            {config.label}
          </span>
          <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap ml-2 mt-0.5">
            {getRelativeTime(notification.createdAt)}
          </span>
        </div>
        <p className={`text-sm mt-1.5 ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'} leading-relaxed`}>
          {notification.message}
        </p>
      </div>
      {!notification.read && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(notification.id);
          }} 
          className="shrink-0 p-1.5 rounded-full text-gray-400 hover:bg-[#00502D] hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
          title="Mark as read"
        >
          <Check size={14} />
        </button>
      )}
    </div>
  );
}
