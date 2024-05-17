import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function SettingsSwitch({ label, checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label={label}
    />
  );
}
