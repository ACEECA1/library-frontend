import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon, Folder, Layers, BookOpen } from "lucide-react";
import api, { metadataApi } from "../../../lib/api";
import { toast } from "sonner";

export function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [seriesList, setSeriesList] = useState<any[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newSeriesName, setNewSeriesName] = useState("");
  const [newSeriesDesc, setNewSeriesDesc] = useState("");

  const fetchData = async () => {
    try {
      const [catRes, tagRes, serRes] = await Promise.all([
        metadataApi.getCategories(),
        metadataApi.getTags(),
        metadataApi.getSeries()
      ]);
      setCategories(catRes.data.data || []);
      setTags(tagRes.data.data || []);
      setSeriesList(serRes.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch metadata");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await metadataApi.addCategory({ name: newCatName });
      toast.success("Category created");
      setNewCatName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await api.delete(`/metadata/categories/${id}`);
      toast.success("Category deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      await metadataApi.addTag({ name: newTagName });
      toast.success("Tag created");
      setNewTagName("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create tag");
    }
  };

  const handleDeleteTag = async (id: number) => {
    try {
      await api.delete(`/metadata/tags/${id}`);
      toast.success("Tag deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete tag");
    }
  };

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeriesName.trim()) return;
    try {
      await metadataApi.addSeries({ name: newSeriesName, description: newSeriesDesc });
      toast.success("Series created");
      setNewSeriesName("");
      setNewSeriesDesc("");
      fetchData();
    } catch (err) {
      toast.error("Failed to create series");
    }
  };

  const handleDeleteSeries = async (id: number) => {
    try {
      await api.delete(`/metadata/series/${id}`);
      toast.success("Series deleted");
      fetchData();
    } catch (err) {
      toast.error("Failed to delete series");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          <BookOpen className="text-[#00502D]" />
          Metadata Management
        </h2>
        <p className="text-gray-600">Organize and structure the library content by managing categories, tags, and series.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-gray-50 border-b border-gray-200 p-5 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Folder size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Categories</h3>
              <p className="text-xs text-gray-500">Broad classifications</p>
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-100 bg-white">
            <form onSubmit={handleCreateCategory} className="flex gap-3">
              <input 
                type="text" 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="New Category Name..." 
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all"
              />
              <button 
                type="submit" 
                disabled={!newCatName.trim()}
                className="bg-[#00502D] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#003a20] transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1.5"
              >
                <Plus size={18} /> Add
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <div key={c.id} className="group flex items-center gap-2 bg-white border border-gray-200 pl-3 pr-1.5 py-1.5 rounded-full shadow-sm hover:border-gray-300 transition-all hover:shadow-md">
                  <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  <button 
                    onClick={() => handleDeleteCategory(c.id)} 
                    className="p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="w-full text-center py-10 text-gray-400 italic text-sm">No categories created yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Tags Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
          <div className="bg-gray-50 border-b border-gray-200 p-5 flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <TagIcon size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Tags</h3>
              <p className="text-xs text-gray-500">Specific keywords</p>
            </div>
          </div>
          
          <div className="p-5 border-b border-gray-100 bg-white">
            <form onSubmit={handleCreateTag} className="flex gap-3">
              <input 
                type="text" 
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                placeholder="New Tag Name..." 
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all"
              />
              <button 
                type="submit" 
                disabled={!newTagName.trim()}
                className="bg-[#00502D] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#003a20] transition-colors disabled:opacity-50 shadow-sm flex items-center gap-1.5"
              >
                <Plus size={18} /> Add
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-5 bg-gray-50/30">
            <div className="flex flex-wrap gap-2">
              {tags.map(t => (
                <div key={t.id} className="group flex items-center gap-2 bg-white border border-blue-100 pl-3 pr-1.5 py-1.5 rounded-full shadow-sm hover:border-blue-200 transition-all hover:shadow-md">
                  <span className="text-sm font-medium text-blue-800">#{t.name}</span>
                  <button 
                    onClick={() => handleDeleteTag(t.id)} 
                    className="p-1 rounded-full text-blue-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete Tag"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <div className="w-full text-center py-10 text-gray-400 italic text-sm">No tags created yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Series Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 p-5 flex items-center gap-3">
          <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Layers size={20} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Book Series</h3>
            <p className="text-xs text-gray-500">Group related books together</p>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-100 bg-white">
          <form onSubmit={handleCreateSeries} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-1/3">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Series Name</label>
              <input 
                type="text" 
                value={newSeriesName}
                onChange={e => setNewSeriesName(e.target.value)}
                placeholder="e.g. Harry Potter" 
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all"
              />
            </div>
            <div className="w-full md:flex-1">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description (Optional)</label>
              <input 
                type="text" 
                value={newSeriesDesc}
                onChange={e => setNewSeriesDesc(e.target.value)}
                placeholder="Brief description about the series..." 
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00502D]/20 focus:border-[#00502D] transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={!newSeriesName.trim()}
              className="w-full md:w-auto bg-[#00502D] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#003a20] transition-colors disabled:opacity-50 shadow-sm flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Create Series
            </button>
          </form>
        </div>
        
        <div className="p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {seriesList.map(s => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative pr-10">
                <h4 className="font-bold text-gray-900 text-base">{s.name}</h4>
                {s.description ? (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{s.description}</p>
                ) : (
                  <p className="text-gray-400 text-sm mt-1 italic">No description provided</p>
                )}
                
                <button 
                  onClick={() => handleDeleteSeries(s.id)} 
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Series"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {seriesList.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-400 italic text-sm border-2 border-dashed border-gray-200 rounded-xl">
                No series created yet. Add one above.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
