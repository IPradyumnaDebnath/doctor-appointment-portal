import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export function FilterGroup({ label, filters }) {
  const [selectedValue, setSelectedValue] = useState(() => filters[0] ?? "");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl>
      <FormLabel
        className="text-left font-bold"
        id="filter-radio-buttons-group"
      >
        {label}
      </FormLabel>
      <RadioGroup
        aria-labelledby="filter-radio-buttons-group"
        name="filter-radio-buttons-group"
        value={selectedValue.id}
        onChange={handleChange}
      >
        {
          // As data is static/no user action to remove, update etc possible so index is suitable for key
          !!filters.length &&
            filters.map((filter, index) => (
              <FormControlLabel
                key={index}
                value={filter.id}
                control={<Radio />}
                label={filter?.name ?? "-"}
              />
            ))
        }
      </RadioGroup>
    </FormControl>
  );
}

export default FilterGroup;
