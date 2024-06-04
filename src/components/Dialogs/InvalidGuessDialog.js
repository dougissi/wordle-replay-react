import Button from "@mui/material/Button";
import AlertDialog from './AlertDialog';

export default function InvalidGuessDialog({ open, handleClose, guess, clearGuess, hardMode }) {
    const handleClickClearButton = () => {
        clearGuess();
        handleClose();
    };

    const editButton = <Button key="invalidGuessEditButton" onClick={handleClose}>Edit Manually</Button>;
    const clearButton = <Button key="invalidGuessClearButton" onClick={handleClickClearButton}>Clear Guess</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`"${guess}" is not ${hardMode ? "allowed in hard mode" : "in the word list"}.`}
            text="Please enter a different guess."
            buttons={[clearButton, editButton]} />
    );
}
