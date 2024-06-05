import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import { Stack } from "@mui/material";
import AlertDialog from './AlertDialog';
import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function SuggestionsDialog({ open, handleClose, hardModeWords, suggestions, submitGuessFromButtonClick }) {
    const okButton = <Button key="hardModeWordsOkButton" onClick={handleClose}>OK</Button>;

    const SuggestionButtons = () => {
        return (
            <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
                {suggestions.map((s, i) => {
                    return (
                        <Button
                            key={`suggestion-button${i}`}
                            variant="contained"
                            onClick={() => {
                                submitGuessFromButtonClick(s);
                                handleClose();
                            }}
                        >
                            {s}
                        </Button>
                    );
                })}
            </Stack>
        );
    };

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
                <SuggestionButtons key="suggestion-buttons-row" />,
                <h3 key='all-possible-suggestions-heading'>All Remaining Possible Solutions</h3>,
                <DialogContentText key='all-possible-words-dialog-text'>{[...hardModeWords].join(", ")}</DialogContentText>
            ]} />
    );
}
