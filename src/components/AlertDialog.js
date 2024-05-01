import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({ open, handleClose }) {

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
            {"Word not in word list"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
            Please enter a different word.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} autoFocus>OK</Button>
        </DialogActions>
        </Dialog>
    );
}
