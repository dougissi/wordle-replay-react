import { useState } from "react";
import Button from "@mui/material/Button";
import DistributionChart from "../DistributionChart";
import { Stack, Typography } from "@mui/material";
import { colorToIcon } from "../../constants";
import AlertDialog from './AlertDialog';
import IosShareIcon from '@mui/icons-material/IosShare';
import Alert from '@mui/material/Alert';


export default function WonDialog({
    open, handleClose, answer, numGuesses, deleteDBDates, guessesColors, distributionData, colorBlindMode, puzzleNum, puzzleDate, green, gray
}) {
    const [showCopyAlert, setShowCopyAlert] = useState(false);
    const [replayConfirm, setReplayConfirm] = useState(false);

    const guessesIcons = [];
    for (let i = 0; i < guessesColors.length; i++) {
        const guessColors = guessesColors[i];
        if (guessColors[0] === "") {
            break;
        }
        const guessIcons = guessColors.map((color) => colorBlindMode ? colorToIcon.colorBlind[color] : colorToIcon.standard[color]).join("");
        guessesIcons.push(guessIcons);
    }
    const domain = "wordlereplay.com";
    const shareText = `Wordle: #${puzzleNum} ${puzzleDate}\nGuesses: ${numGuesses}\n\n${guessesIcons.join("\n")}\n\nhttps://${domain}/?date=${puzzleDate}.`;  // period at end of URL prevents iMessage link preview

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

    const copyButton = (
        <div key="copy-button-with-alert">
            {showCopyAlert && <Alert severity="success">Guess icons copied</Alert>}
            <Button
                key="copyIconsButton"
                startIcon={<IosShareIcon/>}
                onClick={() => {
                    navigator.clipboard.writeText(shareText);
                    setShowCopyAlert(true);
                    setTimeout(() => {
                        setShowCopyAlert(false);
                    }, 1500);
                }}
            >
                Copy
            </Button>
        </div>
        
    );
    const shareButton = <Button key="shareIconsButton" startIcon={<IosShareIcon/>} onClick={handleShare} disabled={!isShareSupported()}>Share</Button>;
    const replayButton = <Button key="replayButton" onClick={() => setReplayConfirm(true)}>Replay</Button>
    const okButton = <Button key="wonDialogOkButton" onClick={handleClose}>OK</Button>;

    const areYouSureAlert = (
        <Alert severity="warning">
            <Stack spacing={2}>
                Are you sure you want to replay?
                <Stack direction="row" spacing={2}>
                    <Button onClick={() => {deleteDBDates([puzzleDate]); setReplayConfirm(false); handleClose();}}>Yes</Button>
                    <Button onClick={() => setReplayConfirm(false)}>No</Button>
                </Stack>
            </Stack>
            
        </Alert>
    )

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`You found "${answer}"!`}
            // text="Thanks for playing."  // TODO: update
            buttons={[(isShareSupported() ? shareButton: copyButton), replayButton, okButton]}
            addlContent={[
                <DistributionChart key="distributionChart" numGuesses={numGuesses} distributionData={distributionData} green={green} gray={gray} />,
                <Typography key="guesses" variant="h6">Guesses</Typography>,
                <Stack key="guessesStack" spacing={0}>
                    {guessesIcons.map((guessIcons, i) => (
                        <Typography key={`guess${i}`}>{guessIcons}</Typography>
                    ))}
                </Stack>,
                replayConfirm && areYouSureAlert
            ]}
        />
    );
}
