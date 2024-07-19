import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import AlertDialog from './AlertDialog';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { remainingSolutionsText } from "../../constants";

export default function SuggestionsDialog({ open, handleClose, hardModeWords, SuggestedGuessButtonsForDialog }) {
    const okButton = <Button key="hardModeWordsOkButton" onClick={handleClose}>OK</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            buttons={[okButton]}
            addlContent={[
                <h3 key="help header">Need Help?</h3>,
                <DialogContentText key="help-text">
                    See the <Link component={RouterLink} to='/about' onClick={handleClose}>About</Link> page for general instructions.
                </DialogContentText>,
                <h3 key='top-suggestions-heading'>Top Suggestions</h3>,
                <SuggestedGuessButtonsForDialog key="suggestion-buttons-row" />,
                <h3 key='all-possible-suggestions-heading'>{remainingSolutionsText(hardModeWords)}</h3>,
                <DialogContentText key='all-possible-solutions-dialog-text'>{[...hardModeWords].join(", ")}</DialogContentText>
            ]}
        />
    );
}
