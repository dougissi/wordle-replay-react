import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DistributionChart from './DistributionChart';
import { Stack, Typography } from '@mui/material';
import { colorToIcon } from '../constants';

function AlertDialog({ open, handleClose, title, text, buttons, addlContent, onKeyDown }) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            onKeyDown={ onKeyDown || handleClose}  // TODO: make more robust
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

function InvalidGuessDialog({ open, handleClose, guess, clearGuess, hardMode }) {
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
            buttons={[clearButton, editButton]}
        />
    )
}

function WonDialog({ open, handleClose, answer, numGuesses, guessesColors, distributionData, colorBlindMode, puzzleNum, puzzleDate, nextUnsolvedDate, changeDate, green, gray }) {
    const guessesIcons = [];
    for (let i = 0; i < guessesColors.length; i++) {
        const guessColors = guessesColors[i];
        if (guessColors[0] === "") {
            break;
        }
        const guessIcons = guessColors.map((color) => colorBlindMode ? colorToIcon.colorBlind[color] : colorToIcon.standard[color]).join("");
        guessesIcons.push(guessIcons);
    }
    const domain = "promisepress.com";  // TODO: update upon release
    const shareText = `Wordle: #${puzzleNum} ${puzzleDate}\nGuesses: ${numGuesses}\n\n${guessesIcons.join("\n")}\n\n${domain}/?date=${puzzleDate}`;

    const isShareSupported = () => {
        return navigator.share !== undefined;
    };
    
      const handleShare = async () => {
        if (isShareSupported()) {
            try {
                await navigator.share({
                    // title: 'Wordle Replay',
                    text: shareText,
                    // url: `https://www.${domain}/?date=${puzzleDate}`,
                });
            } catch (error) {
                console.error('Error sharing content', error);
            }
        } else {
            console.log('Share API not supported on this browser.');
        }
    };

    const handleClickPlayNextButton = () => {
        if (nextUnsolvedDate) {
            changeDate(nextUnsolvedDate);
            handleClose();
        }
    }

    const copyButton = <Button key="copyIconsButton" onClick={() => navigator.clipboard.writeText(shareText)}>Copy</Button>;
    const shareButton = <Button key="shareIconsButton" onClick={handleShare} disabled={!isShareSupported()}>Share</Button>;
    const playNextButton = <Button key="playNextButton" onClick={handleClickPlayNextButton} disabled={!nextUnsolvedDate}>Play Next</Button>

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`You found "${answer}"!`}
            // text="Thanks for playing."  // TODO: update
            buttons={[playNextButton]}
            addlContent={[
                <DistributionChart key="distributionChart" numGuesses={numGuesses} distributionData={distributionData} green={green} gray={gray} />,
                <Typography key="guesses" variant="h6">Guesses</Typography>,
                <Stack key="guessesStack" spacing={0}>
                    {guessesIcons.map((guessIcons, i) => (
                        <Typography key={`guess${i}`}>{guessIcons}</Typography>
                    ))}
                </Stack>,
                <Stack key="guessesIconsButtons" direction="row" spacing={2}>
                    {isShareSupported() ? [copyButton, shareButton] : [copyButton]}
                </Stack>
            ]}
        />
    )
}

function SuggestionsDialog({ open, handleClose, hardModeWords }) {
    const okButton = <Button key="hardModeWordsOkButton" onClick={handleClose}>OK</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title="Valid next guesses based on guesses so far"
            text={[...hardModeWords].join(", ")}
            buttons={[okButton]}
        />
    )
}

export {
    AlertDialog,
    InvalidGuessDialog,
    WonDialog,
    SuggestionsDialog
}