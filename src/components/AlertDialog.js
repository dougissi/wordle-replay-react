import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DistributionChart } from './DistributionChart';

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
            {addlContent}
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
            title={`"${guess}" is not in the word list.`}  // TODO: specify the guess that's not in word list
            text="Please enter a different guess."
            buttons={[clearButton, editButton]}
        />
    )
}

function WonDialog({ open, handleClose, answer, resetGame, distributionData }) {
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
            addlContent={<DistributionChart distributionData={distributionData} />}
        />
    )
}

export {
    InvalidGuessDialog,
    WonDialog
}