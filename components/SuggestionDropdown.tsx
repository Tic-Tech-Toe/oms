import { FC } from "react";

interface SuggestionDropdownProps<T> {
  suggestions: T[];
  onSelect: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
}

const SuggestionDropdown: FC<SuggestionDropdownProps<any>> = ({ suggestions, onSelect, renderItem }) => {
  if (!suggestions.length) return null;

  return (
    <div className="absolute w-full mt-1 bg-white z-10 shadow-lg border rounded-md">
      {suggestions.map((item) => (
        <div
          key={item.id}
          className="p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(item)}
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

export default SuggestionDropdown;
