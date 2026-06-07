import { useState, useEffect } from "react";
import { Plus, Trash2, Tag as TagIcon, Folder, Layers } from "lucide-react";
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
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 border-b pb-2">
            <Folder size={20} className="text-yellow-500" /> Categories
          </div>
          <form onSubmit={handleCreateCategory} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="New Category Name" 
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00502D]"
            />
            <button type="submit" className="bg-[#00502D] text-white px-3 py-2 rounded text-sm hover:bg-[#003a20]">
              <Plus size={16} />
            </button>
          </form>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {categories.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border rounded text-sm">
                <span>{c.name}</span>
                <button onClick={() => handleDeleteCategory(c.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 border-b pb-2">
            <TagIcon size={20} className="text-blue-500" /> Tags
          </div>
          <form onSubmit={handleCreateTag} className="flex gap-2 mb-4">
            <input 
              type="text" 
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              placeholder="New Tag Name" 
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00502D]"
            />
            <button type="submit" className="bg-[#00502D] text-white px-3 py-2 rounded text-sm hover:bg-[#003a20]">
              <Plus size={16} />
            </button>
          </form>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tags.map(t => (
              <div key={t.id} className="flex items-center justify-between p-2 hover:bg-gray-50 border rounded text-sm">
                <span>{t.name}</span>
                <button onClick={() => handleDeleteTag(t.id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-2 mb-4 text-lg font-bold text-gray-800 border-b pb-2">
          <Layers size={20} className="text-purple-500" /> Series
        </div>
        <form onSubmit={handleCreateSeries} className="flex gap-2 mb-4">
          <input 
            type="text" 
            value={newSeriesName}
            onChange={e => setNewSeriesName(e.target.value)}
            placeholder="Series Name" 
            className="w-1/3 border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00502D]"
          />
          <input 
            type="text" 
            value={newSeriesDesc}
            onChange={e => setNewSeriesDesc(e.target.value)}
            placeholder="Description (Optional)" 
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#00502D]"
          />
          <button type="submit" className="bg-[#00502D] text-white px-4 py-2 rounded text-sm hover:bg-[#003a20]">
            Add Series
          </button>
        </form>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {seriesList.map(s => (
            <div key={s.id} className="flex flex-col p-3 hover:bg-gray-50 border rounded text-sm">
              <span className="font-semibold">{s.name}</span>
              {s.description && <span className="text-gray-500 mt-1">{s.description}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
