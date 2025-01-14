import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const SearchInput = ({ value, onChange, placeholder }:SearchInputProps) => {
  return (
    <div className="relative">
      <div className="text-base p-2 rounded-md border outline-none flex placeholder-gray-500 items-center gap-2">
        <Search size={24} className="transform scale-x-[-1] text-gray-500" />
        <Input
          type="text"
          value={value}
          onChange={onChange}
          className="text-base min-h-12 rounded-1.5 border outline-none"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};

export default SearchInput;
