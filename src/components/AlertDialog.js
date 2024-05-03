import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function AlertDialog({ open, handleClose, title, text, buttons }) {

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
        </DialogContent>
        <DialogActions>
            {buttons}            
        </DialogActions>
        </Dialog>
    );
}

function NotInWordListDialog({ open, handleClose }) {
    const okButton = <Button key="notInWordListOkButton" onClick={handleClose} autoFocus>OK</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title="Word not in word list"  // TODO: specify the guess that's not in word list
            text="Please enter a different word."
            buttons={[okButton]}
        />
    )
}

function WonDialog({ open, handleClose, answer }) {
    const okButton = <Button key="wonOkButton" onClick={handleClose} autoFocus>OK</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`You found '${answer}'!`}
            text="Thanks for playing."  // TODO: update
            buttons={[okButton]}
        />
    )
}

export {
    NotInWordListDialog,
    WonDialog
}