import { useRef, useState } from 'react';
import dayjs from 'dayjs';
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
import { Link, useNavigate } from "react-router-dom";
import { Badge, Tooltip } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PuzzleNumSelectorDialog from './Dialogs/PuzzleNumSelectorDialog';
import CalendarDialog from "./Dialogs/CalendarDialog";
import SuggestionsDialog from './Dialogs/SuggestionsDialog';
import StatsDialog from './Dialogs/StatsDialog';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import SettingsMenu from './SettingsMenu';
import { earliestDate } from '../constants';


const title = "WORDLE REPLAY";
const textColor = 'white';

function ResponsiveAppBar({
  pages,
  today,
  puzzleDate,
  puzzleNum,
  isValidPuzzleNum,
  hardMode,
  handleHardModeChange,
  hardModeWords,
  colorBlindMode,
  handleColorBlindModeChange,
  darkMode,
  distributionData,
  guessesDB,
  toggleColorMode,
  focusGuessesBoard,
  changeDate,
  deleteDBDates,
  showNewsBadge,
  suggestions,
  submitGuessFromButtonClick,
  nextUnsolvedDate,
  previousUnsolvedDate,
  earliestUnsolvedDate,
  latestUnsolvedDate,
  gamePath,
  green,
  yellow,
  gray,
}) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElPreviousPuzzle, setAnchorElPreviousPuzzle] = useState(null);
  const [anchorElNextPuzzle, setAnchorElNextPuzzle] = useState(null);
  const [showPuzzleSelectorDialog, setShowPuzzleSelectorDialog] = useState(false);
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const [suggestionsDialogOpen, setSuggestionsDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [anchorElSettings, setAnchorElSettings] = useState(null);
  const navigate = useNavigate();

  const puzzleNumSelectorButtonRef = useRef(null);
  const calendarButtonRef = useRef(null);
  const suggestionsButtonRef = useRef(null);
  const statsButtonRef = useRef(null);
  const settingsButtonRef = useRef(null);
  const previousPuzzleButtonRef = useRef(null);
  const nextPuzzleButtonRef = useRef(null);

  const navToGame = () => {
    if (window.location.pathname !== gamePath) {
      navigate(gamePath);
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setTimeout(focusGuessesBoard, 200);  // TODO: why need timeout?
  };

  const handleOpenPreviousPuzzleMenu = (event) => {
    setAnchorElPreviousPuzzle(event.currentTarget);
  };

  const handleClosePreviousPuzzleMenu = () => {
    setAnchorElPreviousPuzzle(null);
    navToGame();
  };

  const handleOpenNextPuzzleMenu = (event) => {
    setAnchorElNextPuzzle(event.currentTarget);
  };

  const handleCloseNextPuzzleMenu = () => {
    setAnchorElNextPuzzle(null);
    navToGame();
  };

  const labelWithBadge = (label, showBadge) => {
    return <Badge color="warning" variant="dot" badgeContent={Number(showBadge)}>{label}</Badge>;
  };

  const navButtonSX = { 
    minHeight: 0, 
    minWidth: 0, 
    padding: '3px'
  };

  const SuggestionsButton = ({ sx }) => {
    return (
      <Box sx={sx}>
        <Tooltip title="Suggestions">
          <IconButton
            variant="contained"
            ref={suggestionsButtonRef}
            onClick={() => {
              setSuggestionsDialogOpen(true);
              suggestionsButtonRef.current.blur();
            }}
            sx={navButtonSX}
          >
            <HelpOutlineIcon sx={{ color: textColor }} />
          </IconButton>
        </Tooltip>
        <SuggestionsDialog
          open={suggestionsDialogOpen}
          handleClose={() => {
            setSuggestionsDialogOpen(false);
            setTimeout(focusGuessesBoard, 200);  // TODO: why need this timeout?
          }}
          hardModeWords={hardModeWords}
          suggestions={suggestions}
          submitGuessFromButtonClick={submitGuessFromButtonClick}
        />
      </Box> 
    );
  }

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
              display: { xs: 'none', lg: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {title}
          </Typography>

          <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu button"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={navButtonSX}
            >
              {labelWithBadge(<MenuIcon />, showNewsBadge)}
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
                display: { xs: 'block', lg: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={`${page.label}-menu-item`} onClick={handleCloseNavMenu}>
                  <Typography
                    component={Link}  // react-router-dom Link faster than @mui Link
                    to={page.path}
                    style={{ color: 'inherit', textAlign: 'center', textDecoration: 'none' }}
                  >
                    {labelWithBadge(page.label, page.label === 'News' && showNewsBadge)}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>       

          <Box sx={{ display: { xs: 'none', lg: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={`${page.label}-nav-link`}
                component={Link}  // react-router-dom Link faster than @mui Link
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: textColor, display: 'block' }}
                style={{ textDecoration: 'none' }}
              >
                {labelWithBadge(page.label, page.label === 'News' && showNewsBadge)}
              </Button>
            ))}
          </Box>

          <SuggestionsButton sx={{ display: { xs: 'inherit', lg: 'none'}}} />

          
          <Box sx={{ flexGrow: 1 }}>
            {/* Previous Arrow Icon */}
            <Tooltip title="Play Previous">
              <span>
                <IconButton
                  disabled={puzzleDate === earliestDate || !previousUnsolvedDate}
                  id="basic-button"
                  ref={previousPuzzleButtonRef}
                  aria-label="previous-puzzle-button"
                  aria-controls={Boolean(anchorElPreviousPuzzle) ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorElPreviousPuzzle) ? 'true' : undefined}
                  onClick={(event) => {
                    handleOpenPreviousPuzzleMenu(event);
                    previousPuzzleButtonRef.current.blur();
                  }}
                  sx={navButtonSX}
                >
                  <KeyboardArrowLeftIcon sx={{ color: (puzzleDate === earliestDate || !previousUnsolvedDate) ? "inherit" : textColor }} />
                </IconButton>
              </span>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorElPreviousPuzzle}
              open={Boolean(anchorElPreviousPuzzle)}
              onClose={handleClosePreviousPuzzleMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem 
                onClick={() => {
                  changeDate(dayjs(puzzleDate).subtract(1, 'day').format('YYYY-MM-DD'));
                  handleClosePreviousPuzzleMenu();
                }}
              >
                Previous
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  changeDate(previousUnsolvedDate);
                  handleClosePreviousPuzzleMenu();
                }}
              >
                Previous Unsolved
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  changeDate(earliestUnsolvedDate);
                  handleClosePreviousPuzzleMenu();
                }}
              >
                Earliest Unsolved
              </MenuItem>
            </Menu>

            {/* Puzzle Number */}
            <Tooltip title="Choose Puzzle Number">
              <Button
                ref={puzzleNumSelectorButtonRef}
                onClick={() => {
                  setShowPuzzleSelectorDialog(prev => !prev);
                  puzzleNumSelectorButtonRef.current.blur();
                }}
                sx={navButtonSX}
              >
                <Typography color={textColor}>{`#${puzzleNum}`}</Typography>
              </Button>
            </Tooltip>
            <PuzzleNumSelectorDialog
              open={showPuzzleSelectorDialog}
              handleClose={() => {
                setShowPuzzleSelectorDialog(false);
                focusGuessesBoard();
                navToGame();
              }}
              puzzleNum={puzzleNum}
              isValidPuzzleNum={isValidPuzzleNum}
              changeDate={changeDate}
            />

            {/* Puzzle Date */}
            <Tooltip title="Choose Puzzle Date">
              <Button
                ref={calendarButtonRef}
                onClick={() => {
                  setShowCalendarDialog(prev => !prev);
                  calendarButtonRef.current.blur();
                }}
                sx={navButtonSX}
              >
                <Typography color={textColor}>{puzzleDate}</Typography>
              </Button>
            </Tooltip>
            <CalendarDialog
              open={showCalendarDialog}
              handleClose={() => {
                setShowCalendarDialog(false);
                focusGuessesBoard();
                navToGame();
              }}
              today={today}
              puzzleDate={puzzleDate}
              guessesDB={guessesDB}
              changeDate={changeDate}
              green={green}
              yellow={yellow}
            />

            {/* Next Unsolved Arrow Icon */}
            <Tooltip title="Play Next">
              <span>
                <IconButton
                  disabled={puzzleDate === today || !nextUnsolvedDate}
                  id="basic-button"
                  ref={nextPuzzleButtonRef}
                  aria-label="next-puzzle-button"
                  aria-controls={Boolean(anchorElNextPuzzle) ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorElNextPuzzle) ? 'true' : undefined}
                  onClick={(event) => {
                    handleOpenNextPuzzleMenu(event);
                    nextPuzzleButtonRef.current.blur();
                  }}
                  sx={navButtonSX}
                >
                  <KeyboardArrowRightIcon sx={{ color: (puzzleDate === today || !nextUnsolvedDate) ? "inherit" : textColor }} />
                </IconButton>
              </span>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorElNextPuzzle}
              open={Boolean(anchorElNextPuzzle)}
              onClose={handleCloseNextPuzzleMenu}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem 
                onClick={() => {
                  changeDate(dayjs(puzzleDate).add(1, 'day').format('YYYY-MM-DD'));
                  handleCloseNextPuzzleMenu();
                }}
              >
                Next
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  changeDate(nextUnsolvedDate);
                  handleCloseNextPuzzleMenu();
                }}
              >
                Next Unsolved
              </MenuItem>
              <MenuItem 
                onClick={() => {
                  changeDate(latestUnsolvedDate);
                  handleCloseNextPuzzleMenu();
                }}
              >
                Latest Unsolved
              </MenuItem>
            </Menu>
          </Box>

          <SuggestionsButton sx={{ display: { xs: 'none', lg: 'inherit'}}} />

          {/* Stats & History */}
          <Tooltip title="Stats & History">
            <IconButton
              variant="contained"
              ref={statsButtonRef}
              onClick={() => {
                setStatsDialogOpen(true);
                statsButtonRef.current.blur();
              }}
              sx={navButtonSX}
            >
              <BarChartIcon sx={{ color: textColor }} />
            </IconButton>
          </Tooltip>
          <StatsDialog
            open={statsDialogOpen}
            handleClose={() => {
              setStatsDialogOpen(false);
              focusGuessesBoard();
              navToGame();
            }}
            today={today}
            distributionData={distributionData}
            guessesDB={guessesDB}
            changeDate={changeDate}
            deleteDBDates={deleteDBDates}
            green={green}
            yellow={yellow}
            gray={gray}
          />

          {/* Settings */}
          <Tooltip title="Settings">
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
              sx={navButtonSX}
            >
              <SettingsIcon sx={{ color: textColor }} />
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
