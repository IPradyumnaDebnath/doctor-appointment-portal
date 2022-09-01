import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

//Type definitions start -->
type Option = {
  name: string;
  id: string;
};
type SelectProp = {
  onChange: Function;
  options: Option[];
  selected?: string;
  label?: string;
};
//<--Type definitions end

export default function SelectVariants({
  label = "Select",
  options,
  selected = "",
  onChange,
}: SelectProp) {
  const handleChange = (event: SelectChangeEvent, object) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard" className="w-full">
        <InputLabel id="demo-simple-select-standard-label">{label}</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={selected}
          onChange={handleChange}
          label={label}
        >
          {!!options?.length ? (
            options.map((option, index) => (
              <MenuItem key={index} value={option.id}>
                {option.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="none">No options available</MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}
