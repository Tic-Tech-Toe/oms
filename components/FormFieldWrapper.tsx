import { FC } from "react";
import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import SearchInput from "./SearchInput";
import SuggestionDropdown from "./SuggestionDropdown";

interface FormFieldWrapperProps {
  name: string;
  placeholder: string;
  suggestions: any[];
  renderSuggestion: (item: any) => React.ReactNode;
}

const FormFieldWrapper: FC<FormFieldWrapperProps> = ({
  name,
  placeholder,
  suggestions,
  renderSuggestion,
}) => {
  const { control } = useFormContext(); // Get control from form context

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }: { field: ControllerRenderProps }) => (
        <FormItem className="flex w-full flex-col gap-2.5">
          <FormLabel className="text-base">{placeholder}</FormLabel>
          <FormControl>
            <div className="relative">
              <SearchInput {...field} placeholder={`Start typing to search ${placeholder.toLowerCase()}`} />
              {suggestions.length > 0 && (
                <SuggestionDropdown suggestions={suggestions} onSelect={field.onChange} renderItem={renderSuggestion} />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldWrapper;
