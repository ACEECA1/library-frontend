import { useState, useEffect } from "react";
import { Users, BookOpen, ShieldAlert, Activity, Check, X, Ban, Upload, Plus, Tag, ShieldCheck, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/api";

export function AdminDashboard() {
  const { hasPermission, user } = useAuth();
  
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
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

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${active ? 'border-[#00502D] text-[#00502D]' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
    >
      {icon} {label}
    </button>
  );
}

function UserManagement() {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [selectedPending, setSelectedPending] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {

      setPendingUsers([
        {id: 1, name: 'Eng. Youssef', username: 'youssef@eng.dz'},
        {id: 2, name: 'Dr. Amina', username: 'amina@eng.dz'}
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (id: number) => {
    try {
      await api.post(`/admin/users/${id}/approve`);
      setPendingUsers(prev => prev.filter(u => u.id !== id));
      setSelectedPending(prev => prev.filter(selectedId => selectedId !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const batchApprove = async () => {
    if (selectedPending.length === 0) return;
    try {
      await api.post('/admin/users/approve-bulk', selectedPending);
      setPendingUsers(prev => prev.filter(u => !selectedPending.includes(u.id)));
      setSelectedPending([]);
    } catch (err) {
      console.error(err);
    }
  };

  const togglePending = (id: number) => {
    setSelectedPending(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPending(pendingUsers.map(u => u.id));
    } else {
      setSelectedPending([]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-bold">Pending Approvals</h2>
        {selectedPending.length > 0 && (
          <button onClick={batchApprove} className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-bold flex items-center gap-1 hover:bg-green-700">
            <Check size={16} /> Batch Approve ({selectedPending.length})
          </button>
        )}
      </div>
      <div className="overflow-x-auto mb-10 border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-10">
                <input 
                  type="checkbox" 
                  className="rounded text-[#00502D] focus:ring-[#00502D]" 
                  onChange={toggleAllPending} 
                  checked={selectedPending.length === pendingUsers.length && pendingUsers.length > 0} 
                />
              </th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded text-[#00502D] focus:ring-[#00502D]" 
                    checked={selectedPending.includes(u.id)} 
                    onChange={() => togglePending(u.id)} 
                  />
                </td>
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.username}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => approveUser(u.id)} className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"><Check size={18} /></button>
                    <button className="p-1.5 text-red-600 hover:bg-red-100 rounded transition-colors"><X size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No pending users.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RolesManagement() {
  return <div className="text-gray-500 italic">Roles Management coming soon.</div>;
}
function CategoryManagement() {
  return <div className="text-gray-500 italic">Category Management coming soon.</div>;
}
function ModerationQueue() {
  return <div className="text-gray-500 italic">Moderation Queue coming soon.</div>;
}
function AuditLogs() {
  return <div className="text-gray-500 italic">Audit Logs coming soon.</div>;
}

function ContentManagement() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [seriesId, setSeriesId] = useState("");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const [catRes, tagRes, seriesRes] = await Promise.all([
        api.get('/metadata/categories'),
        api.get('/metadata/tags'),
        api.get('/metadata/series')
      ]);
      setCategories(catRes.data.data || []);
      setTags(tagRes.data.data || []);
      setSeries(seriesRes.data.data || []);
    } catch (err) {
      console.error("Failed to load metadata", err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !author) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (description) formData.append("description", description);
    
    selectedCategoryIds.forEach(id => formData.append("categoryIds", id));
    selectedTagIds.forEach(id => formData.append("tagIds", id));
    if (seriesId) formData.append("seriesId", seriesId);
    
    formData.append("pdfFile", file);

    setUploading(true);
    try {
      await api.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess(true);
      setTitle("");
      setAuthor("");
      setDescription("");
      setSelectedCategoryIds([]);
      setSelectedTagIds([]);
      setSeriesId("");
      setFile(null);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleMultiSelect = (e: React.ChangeEvent<HTMLSelectElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setter(options);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Upload New Book</h2>

      {success && (
        <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md border border-green-200">
          Book uploaded successfully!
        </div>
      )}

      <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input 
              type="text" 
              value={title} onChange={e => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D]" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
            <input 
              type="text" 
              value={author} onChange={e => setAuthor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D]" 
              required 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categories (Ctrl+Click)</label>
              <select 
                multiple 
                value={selectedCategoryIds}
                onChange={e => handleMultiSelect(e, setSelectedCategoryIds)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D] h-24"
              >
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Ctrl+Click)</label>
              <select 
                multiple 
                value={selectedTagIds}
                onChange={e => handleMultiSelect(e, setSelectedTagIds)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D] h-24"
              >
                {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series (Optional)</label>
            <select 
              value={seriesId} 
              onChange={e => setSeriesId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D]"
            >
              <option value="">None</option>
              {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              value={description} onChange={e => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-[#00502D] focus:border-[#00502D]" 
              rows={3}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">PDF File *</label>
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex flex-col items-center justify-center">
            <Upload size={32} className="mb-2 text-gray-400" />
            <input 
              type="file" 
              accept="application/pdf"
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="mt-2 text-sm text-gray-500"
              required
            />
            {file && <p className="mt-2 text-sm font-medium text-[#00502D]">{file.name}</p>}
          </div>

          <button 
            type="submit" 
            disabled={uploading || !file || !title || !author}
            className="w-full mt-6 bg-[#00502D] text-white py-3 rounded-lg font-bold hover:bg-green-800 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Submit Upload"}
          </button>
        </div>
      </form>
    </div>
  );
}
