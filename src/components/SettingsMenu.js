import * as React from 'react';
import Menu from '@mui/material/Menu';
import { IconButton, MenuItem, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsSwitch from './SettingsSwitch';

export default function SettingsMenu({ hardMode, handleHardModeChange, colorBlindMode, handleColorBlindModeChange, darkMode, toggleColorMode }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip title="Game Settings">
        <IconButton
          id="basic-button"
          aria-label="settings-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
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
      </Menu>
    </div>
  );
}