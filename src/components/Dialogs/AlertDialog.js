import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Stack } from '@mui/material';

export default function AlertDialog({ open, handleClose, title, text, buttons, addlContent, addlActions, onKeyDown }) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            onKeyDown={ onKeyDown || handleClose }  // TODO: make more robust
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
        {addlActions && <DialogActions>{addlActions}</DialogActions>}
        </Dialog>
    );
}
