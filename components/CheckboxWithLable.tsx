import { FC } from "react";

interface CheckboxWithLabelProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const CheckboxWithLabel: FC<CheckboxWithLabelProps> = ({ checked, onChange, label }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <input type="checkbox" checked={checked} onChange={onChange} className="mr-2" />
        <span>{label}</span>
      </div>
    </div>
  );
};

export default CheckboxWithLabel;
