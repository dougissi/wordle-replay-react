import Button from "@mui/material/Button";
import DistributionChart from "../DistributionChart";
import { Stack, Typography } from "@mui/material";
import { colorToIcon } from "../../constants";
import AlertDialog from './AlertDialog';

export default function WonDialog({
    open, handleClose, answer, numGuesses, guessesColors, distributionData, colorBlindMode, puzzleNum, puzzleDate, nextUnsolvedDate, previousUnsolvedDate, changeDate, green, gray
}) {
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

    const handleClickPlayUnsolvedButton = (newDate) => {
        if (newDate) {
            handleClose(); // close right away
            setTimeout(() => changeDate(newDate), 150); // change date after delay (prevent answer in heading updating to new date's answer)
        }
    };

    const copyButton = <Button key="copyIconsButton" onClick={() => navigator.clipboard.writeText(shareText)}>Copy</Button>;
    const shareButton = <Button key="shareIconsButton" onClick={handleShare} disabled={!isShareSupported()}>Share</Button>;
    const okButton = <Button key="wonDialogOkButton" onClick={handleClose}>OK</Button>;
    const playNextButton = <Button key="playNextButton" onClick={() => handleClickPlayUnsolvedButton(nextUnsolvedDate)} disabled={!nextUnsolvedDate}>Next Unsolved</Button>;
    const playPreviousButton = <Button key="playPreviousButton" onClick={() => handleClickPlayUnsolvedButton(previousUnsolvedDate)} disabled={!previousUnsolvedDate}>Previous Unsolved</Button>;

    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            title={`You found "${answer}"!`}
            // text="Thanks for playing."  // TODO: update
            buttons={[playPreviousButton, playNextButton, okButton]}
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
            ]} />
    );
}
