import { forwardRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';

const GuessesBoard = forwardRef(({ screenSize, guessesData, guessesColors, handleInputText }, ref) => {
    const theme = useTheme();

    const numRows = guessesData.length;
    const numLetters = guessesData[0].length;
    const boardVerticalPctOfScreen = 0.5;
    const maxTileHeight = screenSize.height * boardVerticalPctOfScreen / numRows;
    const maxTileWidth = (screenSize.width * 0.9) / numLetters;
    const tileLenSqr = Math.min(maxTileHeight, maxTileWidth);

    const Tile = styled(Paper)(() => ({
        // backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        //padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: tileLenSqr,
        width: tileLenSqr,
        fontSize: tileLenSqr / 2,
        fontWeight: 'bold',
        lineHeight: `${tileLenSqr}px`,  // center text
    }));

    return (
        <div 
            className="guessesBoard" 
            ref={ref}
            tabIndex={0}  // Make div focusable
            onKeyDown={(event) => handleInputText(event.key.toUpperCase())} 
            style={{ 
                padding: "10px 0px", 
                outline: "none"  // Remove the focus outline
            }}
        >
            {guessesData.map((guess, i) => (
                <Stack direction="row" spacing={1} key={`BoardRow${i}`} style={{ paddingTop: "5px", justifyContent: "center"}}>
                    {guess.map((letter, j) => (
                        <Tile key={`guessTile-row${i}-col${j}`} style={{ backgroundColor: guessesColors[i][j] }}>
                            {letter.toUpperCase()}
                        </Tile>
                    ))}
                </Stack>
            ))}
        </div>
    )
});

export default GuessesBoard;