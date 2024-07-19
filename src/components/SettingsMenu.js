import Menu from '@mui/material/Menu';
import { MenuItem } from '@mui/material';
import SettingsSwitch from './SettingsSwitch';

export default function SettingsMenu({
  handleClose,
  anchorEl,
  hardMode,
  handleHardModeChange,
  colorBlindMode,
  handleColorBlindModeChange,
  suggestionsVisible,
  handleSuggestionsVisibleChange,
  darkMode,
  toggleColorMode
}) {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem>
        <SettingsSwitch
          label="Hard Mode"
          checked={hardMode}
          onChange={handleHardModeChange}
        />
      </MenuItem>
      <MenuItem>
        <SettingsSwitch
          label="Dark Mode"
          checked={darkMode}
          onChange={toggleColorMode}
        />
      </MenuItem>
      <MenuItem>
        <SettingsSwitch
          label="Color Blind Mode"
          checked={colorBlindMode}
          onChange={handleColorBlindModeChange}
        />
      </MenuItem>
      <MenuItem>
        <SettingsSwitch
          label="Suggestions Visible"
          checked={suggestionsVisible}
          onChange={handleSuggestionsVisibleChange}
        />
      </MenuItem>
    </Menu>
  );
}
