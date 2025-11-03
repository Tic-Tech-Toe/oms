export default function EditableField({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="block text-gray-500 dark:text-gray-400 text-xs mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-1.5 text-sm dark:bg-neutral-800 dark:text-gray-100"
      />
    </div>
  );
}
