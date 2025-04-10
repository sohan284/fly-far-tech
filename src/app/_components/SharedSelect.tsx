import React from "react";

interface SharedSelectProps {
  label: string;
  options: number[];
  value: number;
  onChange: (value: number) => void;
}

const SharedSelect: React.FC<SharedSelectProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="bg-[#d7e7f4] text-sm rounded-sm p-2 w-full text-gray-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option} {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SharedSelect;
