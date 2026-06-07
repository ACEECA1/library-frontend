import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { metadataApi, bookApi } from "../../../lib/api";
export function ContentManagement() {
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
      await bookApi.uploadBook(formData);
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
