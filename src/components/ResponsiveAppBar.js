import { useRef, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "react-router-dom";
import { Tooltip } from '@mui/material';
import SettingsMenu from './SettingsMenu';
import SettingsIcon from '@mui/icons-material/Settings';

const title = "WORDLE REPLAY"

function ResponsiveAppBar({
  pages,
  hardMode,
  handleHardModeChange,
  colorBlindMode,
  handleColorBlindModeChange,
  darkMode,
  toggleColorMode,
  focusGuessesBoard
}) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElSettings, setAnchorElSettings] = useState(null);

  const settingsButtonRef = useRef(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={`${page.label}-menu-item`} onClick={handleCloseNavMenu}>
                  <Typography
                    component={Link}  // react-router-dom Link faster than @mui Link
                    to={page.path}
                    style={{ color: 'inherit', textAlign: 'center', textDecoration: 'none' }}
                  >
                    {page.label}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={`${page.label}-nav-link`}
                component={Link}  // react-router-dom Link faster than @mui Link
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                style={{ textDecoration: 'none' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>

          {/* Settings Icon */}
          <Tooltip title="Game Settings">
            <IconButton
              id="basic-button"
              ref={settingsButtonRef}
              aria-label="settings-button"
              aria-controls={Boolean(anchorElSettings) ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorElSettings) ? 'true' : undefined}
              onClick={(event) => {
                setAnchorElSettings(event.currentTarget);
                settingsButtonRef.current.blur();
              }}
            >
              <SettingsIcon sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>

          <SettingsMenu
            handleClose={() => {
              setAnchorElSettings(null);
              settingsButtonRef.current.blur();  // prevent focusing on button
              focusGuessesBoard();
            }}
            anchorEl={anchorElSettings}
            hardMode={hardMode}
            handleHardModeChange={handleHardModeChange}
            colorBlindMode={colorBlindMode}
            handleColorBlindModeChange={handleColorBlindModeChange}
            darkMode={darkMode}
            toggleColorMode={toggleColorMode}
          />

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
