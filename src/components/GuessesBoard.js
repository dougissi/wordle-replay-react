import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import useScreenSize from './useScreenSize';
import { Stack } from '@mui/material';

function GuessesBoard() {
    const screenSize = useScreenSize();
    const theme = useTheme();

    const boardVerticalPctOfScreen = 0.5;
    const numRows = 6;
    const numLetters = 5;
    const maxTileHeight = screenSize.height * boardVerticalPctOfScreen / numRows;
    const maxTileWidth = (screenSize.width * 0.9) / numLetters;
    const tileLenSqr = Math.min(maxTileHeight, maxTileWidth);

    const Tile = styled(Paper)(() => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        //padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: tileLenSqr,
        width: tileLenSqr 
    }));

    return (
        <div className="guessesBoard" style={{ padding: "10px 0px" }}>
            {[...Array(numRows)].map((_, rowIndex) => (
                <Stack direction="row" spacing={1} key={`BoardRow${rowIndex}`} style={{ paddingTop: "5px", justifyContent: "center"}}>
                    {[...Array(numLetters)].map((_, colIndex) => (
                        <Tile key={`guessTile${rowIndex}row-${colIndex}col`}>
                            {`(${colIndex + 1}, ${rowIndex + 1})`}
                        </Tile>
                    ))}
                </Stack>
            ))}
        </div>
    )
}

export default GuessesBoard;