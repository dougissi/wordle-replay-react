import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DistributionChart } from './DistributionChart';
import { Stack, Typography } from '@mui/material';
import { colorToIcon } from '../constants';

function AlertDialog({ open, handleClose, title, text, buttons, addlContent }) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            onKeyDown={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            disableEscapeKeyDown
        >
        <DialogTitle id="alert-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {text}
            </DialogContentText>
            <Stack
                spacing={2}
                justifyContent="center"
                alignItems="center"
            >
                {addlContent}
            </Stack>
        </DialogContent>
        <DialogActions>
            {buttons}            
        </DialogActions>
        </Dialog>
    );
}

function InvalidGuessDialog({ open, handleClose, guess, clearGuess }) {
    const handleClickClearButton = () => {
        clearGuess();
        handleClose();
    };

    const editButton = <Button key="invalidGuessEditButton" onClick={handleClose} autoFocus>Edit Manually</Button>;
    const clearButton = <Button key="invalidGuessClearButton" onClick={handleClickClearButton}>Clear Guess</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`"${guess}" is not in the word list.`}
            text="Please enter a different guess."
            buttons={[clearButton, editButton]}
        />
    )
}

function WonDialog({ open, handleClose, answer, numGuesses, resetGame, guessesColors, distributionData }) {


    const guessesIcons = [];
    for (let i = 0; i < guessesColors.length; i++) {
        const guessColors = guessesColors[i];
        if (guessColors[0] === "") {
            break;
        }
        const guessIcons = guessColors.map((color) => colorToIcon[color]).join("");
        guessesIcons.push(guessIcons);
    }

    const handleClickRestartButton = () => {
        resetGame();
        handleClose();
    }

    const okButton = <Button key="wonOkButton" onClick={handleClose} autoFocus>OK</Button>;
    const restartButton = <Button key="wonRestartButton" onClick={handleClickRestartButton}>Restart</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`You found "${answer}"!`}
            text="Thanks for playing."  // TODO: update
            buttons={[restartButton, okButton]}
            addlContent={[
                <Typography key="guesses" variant="h6">Guesses</Typography>,
                <Stack key="guessesStack" spacing={0}>
                    {guessesIcons.map((guessIcons, i) => (
                        <Typography key={`guess${i}`}>{guessIcons}</Typography>
                    ))}
                </Stack>,
                <DistributionChart key="distributionChart" numGuesses={numGuesses} distributionData={distributionData} />
            ]}
        />
    )
}

export {
    InvalidGuessDialog,
    WonDialog
}