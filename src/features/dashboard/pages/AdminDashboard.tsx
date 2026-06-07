import { useState } from "react";
import { Users, BookOpen, ShieldAlert, Activity, ShieldCheck, Tag } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { TabButton } from "../components/TabButton";
import { UserManagement } from "../components/UserManagement";
import { RolesManagement } from "../components/RolesManagement";
import { CategoryManagement } from "../components/CategoryManagement";
import { ContentManagement } from "../components/ContentManagement";
import { ModerationQueue } from "../components/ModerationQueue";
import { AuditLogs } from "../components/AuditLogs";
export function AdminDashboard() {
  const { hasPermission } = useAuth();
  const hasUsers = hasPermission('APPROVE_USER');
  const hasRoles = hasPermission('MANAGE_ROLE');
  const hasContent = hasPermission('UPLOAD_BOOK');
  const hasCategories = hasPermission('MANAGE_METADATA');
  const hasModeration = hasPermission('MODERATE_COMMENT');
  const hasAudit = hasPermission('VIEW_AUDIT_LOG');
  const availableTabs = [
    { id: 'users', label: 'Users & Approvals', icon: <Users size={18} />, show: hasUsers },
    { id: 'roles', label: 'Roles & Permissions', icon: <ShieldCheck size={18} />, show: hasRoles },
    { id: 'content', label: 'Content Management', icon: <BookOpen size={18} />, show: hasContent },
    { id: 'categories', label: 'Categories', icon: <Tag size={18} />, show: hasCategories },
    { id: 'moderation', label: 'Moderation', icon: <ShieldAlert size={18} />, show: hasModeration },
    { id: 'audit', label: 'Audit Logs', icon: <Activity size={18} />, show: hasAudit },
  ].filter(t => t.show);
  const initialTab = availableTabs.length > 0 ? availableTabs[0].id : '';
  const [activeTab, setActiveTab] = useState(initialTab);
  if (availableTabs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg font-bold border border-red-200">
          Access Denied. You do not have permission to view the dashboard.
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-500">Manage platform resources and users.</p>
      </div>
      {availableTabs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto border-b border-gray-200 mb-6">
          {availableTabs.map(tab => (
            <TabButton 
              key={tab.id}
              active={activeTab === tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              icon={tab.icon} 
              label={tab.label} 
            />
          ))}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[800px]">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'roles' && <RolesManagement />}
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'moderation' && <ModerationQueue />}
        {activeTab === 'audit' && <AuditLogs />}
      </div>
    </div>
  );
}
