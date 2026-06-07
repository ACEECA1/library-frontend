import { useState, useEffect } from "react";
import { Upload, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import api, { bookApi, metadataApi } from "../../../lib/api";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";

export function ContentManagement() {
  const { t } = useTranslation();
  const { hasPermission } = useAuth();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [seriesId, setSeriesId] = useState("");
  
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, tagRes, seriesRes] = await Promise.all([
        metadataApi.getCategories(),
        metadataApi.getTags(),
        metadataApi.getSeries()
      ]);
      setCategories(catRes.data.data || []);
      setTags(tagRes.data.data || []);
      setSeries(seriesRes.data.data || []);
    } catch (err) {
      console.error("Failed to load metadata", err);
    }
  };

  const toggleSelection = (id: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(id)) {
      setter(current.filter(item => item !== id));
    } else {
      setter([...current, id]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookFile || !title || !author) return;
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    if (description) formData.append("description", description);
    selectedCategoryIds.forEach(id => formData.append("categoryIds", id));
    selectedTagIds.forEach(id => formData.append("tagIds", id));
    if (seriesId) formData.append("seriesId", seriesId);
    formData.append("pdfFile", bookFile);
    if (coverImage) formData.append("thumbnailFile", coverImage);

    setUploading(true);
    setSuccess(false);
    
    try {
      await bookApi.uploadBook(formData);
      toast.success(t('content.bookUploaded'));
      
      setTitle("");
      setAuthor("");
      setDescription("");
      setSelectedCategoryIds([]);
      setSelectedTagIds([]);
      setSeriesId("");
      setBookFile(null);
      setCoverImage(null);
      
      fetchData();
    } catch (err: any) {
      toast.error(t('content.failedUpload'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Upload className="text-[#00502D]" />
          {t('content.uploadBook')}
        </h2>
        <p className="text-gray-600 mt-1">{t('content.uploadDesc')}</p>
      </div>

      {success && (
        <div className="mb-8 bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="text-green-600 shrink-0" />
          <div>
            <p className="font-bold">Book uploaded successfully!</p>
            <p className="text-sm opacity-90">The book has been sent to the moderation queue.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpload} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Book Details</h3>
            
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content.titleLabel')}</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder={t('content.titlePlaceholder')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00502D] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content.authorLabel')}</label>
                  <input type="text" required value={author} onChange={e => setAuthor(e.target.value)} placeholder={t('content.authorPlaceholder')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00502D] focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content.descriptionLabel')}</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t('content.descriptionPlaceholder')} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#00502D] focus:border-transparent outline-none" rows={3}></textarea>
                </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Series (Optional)</label>
              <select 
                value={seriesId} 
                onChange={e => setSeriesId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all outline-none bg-white"
              >
                <option value="">None / Standalone Book</option>
                {series.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Categories</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {categories.length === 0 ? <p className="text-sm text-gray-500 italic">No categories available.</p> : null}
                {categories.map(c => {
                  const isSelected = selectedCategoryIds.includes(c.id);
                  return (
                    <button 
                      key={c.id}
                      type="button" 
                      onClick={() => toggleSelection(c.id, selectedCategoryIds, setSelectedCategoryIds)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${isSelected ? 'bg-[#00502D] text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                {tags.length === 0 ? <p className="text-sm text-gray-500 italic">No tags available.</p> : null}
                {tags.map(t => {
                  const isSelected = selectedTagIds.includes(t.id);
                  return (
                    <button 
                      key={t.id}
                      type="button" 
                      onClick={() => toggleSelection(t.id, selectedTagIds, setSelectedTagIds)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${isSelected ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`}
                    >
                      #{t.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Book Files</h3>
            
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content.coverImage')}</label>
                  <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#00502D] hover:file:bg-green-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('content.bookFile')}</label>
                  <input type="file" required accept=".pdf,.epub" onChange={e => setBookFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <div className="pt-4">
                  <button type="submit" disabled={uploading} className="w-full bg-[#00502D] text-white py-3 rounded-lg font-bold hover:bg-[#003a20] transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
                    <Upload size={20} />
                    {uploading ? t('content.uploading') : t('content.uploadContent')}
                  </button>
                </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
