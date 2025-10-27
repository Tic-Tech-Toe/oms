import { Upload } from "lucide-react";

export default function UploadInvoiceBox({ uploadedFile, onChange }: any) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">Upload invoice</h2>
      <div className="relative flex flex-col items-center justify-center w-full p-6 border-4 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 border-gray-300">
        <input
          type="file"
          onChange={onChange}
          className="absolute w-full h-full opacity-0 cursor-pointer"
          accept="image/*, .pdf"
        />
        <Upload size={32} className="w-10 h-10 mb-3 text-gray-400" />
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">PDF or Image (JPG, PNG)</p>
        {uploadedFile && (
          <p className="mt-2 text-sm text-green-600">
            File selected: {uploadedFile.name}
            {uploadedFile.type.startsWith("image/") && " (Will be converted to PDF)"}
          </p>
        )}
      </div>
    </div>
  );
}
