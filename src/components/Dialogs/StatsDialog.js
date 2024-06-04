import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { PieChart } from '@mui/x-charts/PieChart';
import DistributionChart from '../DistributionChart';
import HistoryTable from './HistoryTable';
import { puzzleNumToDate, dateToPuzzleNum, getDistCountLabel } from '../../utils';
import { Stack } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StatsDialog({ open, handleClose, today, distributionData, guessesDB, changeDate, deleteDBDates, green, yellow, gray }) {
    const puzzleNumToday = dateToPuzzleNum(today);

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

        historyData.push({
            id: i,
            puzzleNum: i,
            date: (
                <Button onClick={() => {
                    changeDate(date);
                    handleClose();
                }}>
                    {date}
                </Button>
            ),
            status: status,
            numGuesses: guessesDB[date] ? getDistCountLabel(guessesDB[date].guesses.length) : null
        });
    }

    function HistoryPieChart({ data }) {
        return (
          <PieChart
            series={[
              {
                arcLabel: (item) => item.value,
                arcLabelMinAngle: 45,
                data: data,
              },
            ]}
            width={400}
            height={200}
          />
        );
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
                <Stack 
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2} 
                    useFlexGap
                    flexWrap="wrap">
                    <DistributionChart distributionData={distributionData} green={green} gray={gray} />
                    <HistoryPieChart data={historyPieData} />
                </Stack>
                
                <HistoryTable historyData={historyData} deleteDBDates={deleteDBDates} />
            </Stack>
        </Dialog>
    );
}
