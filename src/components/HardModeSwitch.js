import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function HardModeSwitch({ hardMode, handleChange }) {

  return (
    <FormControlLabel
      control={<Switch checked={hardMode} onChange={handleChange} />}
      label="Hard Mode"
    />
  );
}
