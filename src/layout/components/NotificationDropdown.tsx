import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

export function NotificationDropdown() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your book upload 'Advanced Concrete Design' was approved.", read: false, time: "2m ago" },
    { id: 2, text: "Engineer Kamel replied to your comment on Structural Analysis.", read: false, time: "1h ago" },
    { id: 3, text: "System maintenance scheduled for tonight.", read: true, time: "1d ago" },
  ]);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={notifRef}>
      <button 
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 hover:bg-white/10 rounded-full relative transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl py-2 z-50 text-gray-800 border border-gray-100">
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-lg">
            <span className="font-bold text-sm">Notifications</span>
            <button onClick={markAllAsRead} className="text-xs text-[#00502D] hover:underline font-medium">Mark all read</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <NotificationItem key={notif.id} notification={notif} onMarkRead={markAsRead} />
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
