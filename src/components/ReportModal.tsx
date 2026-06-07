import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { reportApi } from "../lib/api";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'BOOK' | 'COMMENT' | 'REVIEW' | 'USER';
  targetId: number | string;
}

export function ReportModal({ isOpen, onClose, targetType, targetId }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    try {
      setSubmitting(true);
      await reportApi.submitReport(targetType, targetId, reason);
      toast.success("Report submitted successfully. Thank you.");
      onClose();
      setReason("");
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="bg-orange-50 border-b border-orange-100 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800 font-bold">
            <AlertTriangle size={20} />
            <span>Report Content</span>
          </div>
          <button onClick={onClose} className="text-orange-600 hover:bg-orange-100 p-1 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Please describe why you are reporting this {targetType.toLowerCase()}. Our moderation team will review it shortly.
          </p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-[#00502D] focus:border-[#00502D] min-h-[120px]"
            placeholder={`Reason for reporting this ${targetType.toLowerCase()}...`}
            required
            autoFocus
          />
          <div className="mt-6 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting || !reason.trim()} 
              className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
