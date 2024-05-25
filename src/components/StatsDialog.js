import * as React from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemButton from '@mui/material/ListItemButton';
// import List from '@mui/material/List';
// import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import DistributionChart from './DistributionChart';
import HistoryPieChart from './HistoryPieChart';
import HistoryTable from './HistoryTable';
import { puzzleNumToDate, dateToPuzzleNum } from '../utils';
import { Stack } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StatsDialog({ open, setOpen, today, distributionData, guessesDB, changeDate, green, yellow, gray }) {
    const puzzleNumToday = dateToPuzzleNum(today);

    const handleClose = () => {
        setOpen(false);
    };

    const historyPieData = [  // initialize
        { id: 0, value: 0, label: 'Solved', color: green },
        { id: 1, value: 0, label: 'Unfinished', color: yellow },
        { id: 2, value: 0, label: 'To Do', color: gray },
    ];

    const historyData = [];

    for (let i = 0; i <= puzzleNumToday; i++) {
        const date = puzzleNumToDate(i);
        let status;
        if (!guessesDB.hasOwnProperty(date)) {
            historyPieData[2].value++;
            status = 'To Do';
        } else if (guessesDB[date].solvedDate) {
            historyPieData[0].value++;
            status = 'Solved';
        } else {
            historyPieData[1].value++;
            status = 'Unfinished';
        }

        const PlayButton = ({ text }) => {
            return (
                <Button onClick={() => {
                    changeDate(date);
                    setOpen(false);
                }}>
                    {text}
                </Button>
            );
        }

        historyData.push({
            id: i,
            puzzleNum: i,
            date: (
                <Button onClick={() => {
                    changeDate(date);
                    setOpen(false);
                }}>
                    {date}
                </Button>
            ),
            status: status,
            numGuesses: guessesDB[date] ? guessesDB[date].guesses.length : null,
        });
    }
    

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        Stats & History
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack>
                <DistributionChart distributionData={distributionData} />
                <HistoryPieChart data={historyPieData} />
                <HistoryTable historyData={historyData} />
            </Stack>
            
            {/* <List>
                <ListItemButton>
                <ListItemText primary="Phone ringtone" secondary="Titania" />
                </ListItemButton>
                <Divider />
                <ListItemButton>
                <ListItemText
                    primary="Default notification ringtone"
                    secondary="Tethys"
                />
                </ListItemButton>
            </List> */}
        </Dialog>
    );
}
