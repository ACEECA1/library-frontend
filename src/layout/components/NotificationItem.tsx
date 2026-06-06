import { Check } from "lucide-react";

export function NotificationItem({ notification, onMarkRead }: { notification: any, onMarkRead: (id: number) => void }) {
  return (
    <div className={`px-4 py-3 border-b border-gray-50 flex items-start gap-3 hover:bg-gray-50 transition-colors ${notification.read ? 'opacity-60' : 'bg-green-50/30'}`}>
      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${notification.read ? 'bg-transparent' : 'bg-[#00502D]'}`}></div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{notification.text}</p>
        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
      </div>
      {!notification.read && (
        <button onClick={() => onMarkRead(notification.id)} className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-green-600" title="Mark as read">
          <Check size={14} />
        </button>
      )}
    </div>
  );
}
