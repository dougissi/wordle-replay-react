import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function SettingsSwitch({ label, checked, onChange }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={onChange} />}
      label={label}
    />
  );
}

export function HardModeSwitch({ hardMode, handleChange }) {
  return <SettingsSwitch label="Hard Mode" checked={hardMode} onChange={handleChange} />;
}

export function DarkModeSwitch({ darkMode, handleChange }) {
  return <SettingsSwitch label="Dark Mode" checked={darkMode === 'dark'} onChange={handleChange} />;
}
