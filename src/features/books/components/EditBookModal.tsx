import { useState, useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { bookApi, metadataApi } from "../../../lib/api";
import { toast } from "sonner";

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: any;
  onSuccess: (updatedBook: any) => void;
}

export function EditBookModal({ isOpen, onClose, book, onSuccess }: EditBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [seriesId, setSeriesId] = useState("");

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMetadata();
      setTitle(book?.title || "");
      setAuthor(book?.author || "");
      setDescription(book?.description || "");
      
      // We will match the existing string arrays with the loaded metadata
      // This is done after metadata loads
    }
  }, [isOpen, book]);

  const fetchMetadata = async () => {
    try {
      const [catRes, tagRes, seriesRes] = await Promise.all([
        metadataApi.getCategories(),
        metadataApi.getTags(),
        metadataApi.getSeries()
      ]);
      const cats = catRes.data.data || [];
      const tgs = tagRes.data.data || [];
      const srs = seriesRes.data.data || [];
      
      setCategories(cats);
      setTags(tgs);
      setSeries(srs);

      if (book) {
        if (book.categories) {
          const matchedCats = cats.filter((c: any) => book.categories.includes(c.name)).map((c: any) => c.id.toString());
          setSelectedCategoryIds(matchedCats);
        }
        if (book.tags) {
          const matchedTags = tgs.filter((t: any) => book.tags.includes(t.name)).map((t: any) => t.id.toString());
          setSelectedTagIds(matchedTags);
        }
        if (book.series) {
          setSeriesId(book.series.id?.toString() || "");
        }
      }
    } catch (err) {
      toast.error("Failed to load metadata");
    }
  };

  const toggleSelection = (id: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(id)) {
      setter(current.filter(item => item !== id));
    } else {
      setter([...current, id]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author) return;

    try {
      setSaving(true);
      const data = {
        title,
        author,
        description,
        seriesId: seriesId ? parseInt(seriesId) : null,
        categoryIds: selectedCategoryIds.map(id => parseInt(id)),
        tagIds: selectedTagIds.map(id => parseInt(id))
      };
      
      const res = await bookApi.updateBook(book.id, data);
      toast.success("Book updated successfully");
      onSuccess(res.data.data);
      onClose();
    } catch (err) {
      toast.error("Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Edit Book metadata</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-all outline-none"
                  placeholder="Enter book title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-all outline-none"
                  placeholder="Enter author name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Series</label>
                <select
                  value={seriesId}
                  onChange={(e) => setSeriesId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-all outline-none"
                >
                  <option value="">No Series</option>
                  {series.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00502D] focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Brief synopsis or description"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Categories</label>
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleSelection(cat.id.toString(), selectedCategoryIds, setSelectedCategoryIds)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategoryIds.includes(cat.id.toString())
                          ? 'bg-[#00502D] text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-[#00502D] hover:text-[#00502D]'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {tags.map(tag => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleSelection(tag.id.toString(), selectedTagIds, setSelectedTagIds)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedTagIds.includes(tag.id.toString())
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title || !author}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-[#00502D] hover:bg-green-800 disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
