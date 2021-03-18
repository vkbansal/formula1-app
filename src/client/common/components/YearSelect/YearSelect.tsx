import React from 'react';
import { Select, SelectProps } from '@chakra-ui/react';

const LIMIT = 2020;
const START = 1950;

export function YearSelect(props: SelectProps): React.ReactElement {
  return (
    <Select display="flex" alignItems="center" {...props}>
      {Array.from({ length: LIMIT - START + 1 }, (_, i) => {
        return (
          <option key={LIMIT - i} value={LIMIT - i}>
            {LIMIT - i}
          </option>
        );
      })}
    </Select>
  );
}
