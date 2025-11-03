import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function OverrideWarningModal({ open, onAccept, onReject, dontRemind, setDontRemind }: any) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Override Warning</h3>
          <button onClick={onReject} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Clicking on <span className="text-purple-600 italic font-semibold">Accept </span>will override the uploaded file.
        </p>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dontRemind"
            checked={dontRemind}
            onChange={(e) => setDontRemind(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="dontRemind" className="ml-2 text-sm text-gray-700 dark:text-gray-400">
            Don't remind me for this session
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onReject} variant="outline" className="border-gray-300 hover:bg-gray-100">
            Reject
          </Button>
          <Button onClick={onAccept} className="bg-purple-600 hover:bg-purple-700 text-white">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
