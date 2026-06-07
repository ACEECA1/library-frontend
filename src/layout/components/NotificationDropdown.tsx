import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";
import api, { notificationApi } from "../../lib/api";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { toast } from "sonner";
import { API_URL } from "../../lib/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function NotificationDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    notificationApi.getNotifications()
      .then(res => setNotifications(res.data.data || []))
      .catch(err => console.error("Failed to fetch notifications", err));

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const wsUrl = API_URL.replace('/api', '/ws');
    const socket = new SockJS(wsUrl);
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {}; 
    
    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      stompClient.subscribe('/user/queue/notifications', (message) => {
        if (message.body) {
          const newNotif = JSON.parse(message.body);
          setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)]);
          toast(newNotif.message, {
            duration: 1500,
            action: {
              label: 'View',
              onClick: () => handleNotificationClick(newNotif)
            }
          });
        }
      });
    }, (error: any) => {
      console.error("STOMP error:", error);
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, []);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const markAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (e) {
      console.error("Failed to mark as read", e);
    }
  };
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark all as read", e);
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setShowNotifications(false);
    switch(notification.type) {
      case 'REPLY':
      case 'BOOK_COMMENT':
        if (notification.targetId) navigate(`/book/${notification.targetId}`, { state: { tab: 'discussion' } });
        break;
      case 'UPVOTE':
      case 'DOWNVOTE':
      case 'REVIEW':
      case 'BOOK_PENDING_APPROVAL':
      case 'BOOK_APPROVED':
        if (notification.targetId) navigate(`/book/${notification.targetId}`);
        break;
      case 'REPORT_RESOLVED':
      case 'USER_APPROVED':
      case 'ROLE_ASSIGNED':
        navigate('/dashboard');
        break;
    }
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
            <span className="font-bold text-sm">{t('notifications.title')}</span>
            <button onClick={markAllAsRead} className="text-xs text-[#00502D] hover:underline font-medium">{t('notifications.markAllRead')}</button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map(notif => (
              <NotificationItem key={notif.id} notification={notif} onMarkRead={markAsRead} onClick={() => handleNotificationClick(notif)} />
            ))}
            {notifications.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-gray-500">{t('notifications.noNotifications')}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
