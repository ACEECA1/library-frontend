import { useState, useEffect } from "react";
import { Upload, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
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

  const toggleSelection = (id: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(id)) {
      setter(current.filter(item => item !== id));
    } else {
      setter([...current, id]);
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
    if (thumbnailFile) formData.append("thumbnailFile", thumbnailFile);

    setUploading(true);
    setSuccess(false);
    
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
      setThumbnailFile(null);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Upload className="text-[#00502D]" />
          Upload New Book
        </h2>
        <p className="text-gray-600 mt-1">Add a new book to the library's pending queue for approval.</p>
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
        
        {/* Left Column: Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Book Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Author <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={author} onChange={e => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all outline-none" 
                  required 
                />
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea 
                value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Write a brief synopsis or description..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all outline-none resize-none" 
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Files */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Book Files</h3>
            
            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">PDF Document <span className="text-red-500">*</span></label>
              <label className={`block border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${file ? 'border-[#00502D] bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                <input 
                  type="file" 
                  accept="application/pdf"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  required
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`p-3 rounded-full ${file ? 'bg-green-100 text-[#00502D]' : 'bg-white text-gray-400 shadow-sm'}`}>
                    <FileText size={28} />
                  </div>
                  {file ? (
                    <div>
                      <p className="text-sm font-bold text-gray-800">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-gray-700">Click to upload PDF</p>
                      <p className="text-xs text-gray-500 mt-1">Only .pdf files are supported</p>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image (Optional)</label>
              <label className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${thumbnailFile ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => setThumbnailFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className={`p-3 rounded-full ${thumbnailFile ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400 shadow-sm'}`}>
                    <ImageIcon size={24} />
                  </div>
                  {thumbnailFile ? (
                    <div>
                      <p className="text-sm font-bold text-gray-800">{thumbnailFile.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Cover selected</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-gray-700">Click to upload Cover</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={uploading || !file || !title || !author}
            className="w-full bg-[#00502D] text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex justify-center items-center gap-2"
          >
            {uploading ? (
              <><span className="animate-pulse">Uploading...</span></>
            ) : (
              <><Upload size={20} /> Submit for Review</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
