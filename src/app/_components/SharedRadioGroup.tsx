import React from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface SharedRadioGroupProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
}

const SharedRadioGroup: React.FC<SharedRadioGroupProps> = ({
  value,
  onChange,
  options,
}) => {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="shared-radio-group-label"
        name="shared-radio-group"
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: value === option.value ? "#32d095" : "gray",
                  "&.Mui-checked": {
                    color: "#32d095",
                  },
                }}
              />
            }
            label={option.label}
            sx={{
              "& .MuiFormControlLabel-label": {
                color: value === option.value ? "#32d095" : "gray",
              },
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default SharedRadioGroup;
