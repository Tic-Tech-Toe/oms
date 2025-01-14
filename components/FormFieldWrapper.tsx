import { FC } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import SearchInput from "./SearchInput";
import SuggestionDropdown from "./SuggestionDropdown";

interface FormFieldWrapperProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  suggestions: any[];
  onSelectSuggestion: (item: any) => void;
  renderSuggestion: (item: any) => React.ReactNode;
}

const FormFieldWrapper: FC<FormFieldWrapperProps> = ({
  name,
  value,
  onChange,
  placeholder,
  suggestions,
  onSelectSuggestion,
  renderSuggestion,
}) => {
  return (
    <FormField name={name}>
      <FormItem className="flex w-full flex-col gap-2.5">
        <FormLabel className="text-base">{placeholder}</FormLabel>
        <FormControl>
          <div className="relative">
            <SearchInput value={value} onChange={onChange} placeholder={`Start typing to search ${placeholder.toLowerCase()}`} />
            {suggestions.length > 0 && (
              <SuggestionDropdown suggestions={suggestions} onSelect={onSelectSuggestion} renderItem={renderSuggestion} />
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
  );
};

export default FormFieldWrapper;
