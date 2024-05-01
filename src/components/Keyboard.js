import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { backspaceSymbol } from '../utils';

function Keyboard({ screenSize, answer, handleInputText }) {
    const theme = useTheme();

    const keyboardVerticalPctOfScreen = 0.25;
    const numRows = 3;
    const rowHeight = screenSize.height * keyboardVerticalPctOfScreen / numRows;
    
    const topRowLetters = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
    const middleRowLetters = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
    const bottomRowLetters = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

    const normalKeyWidth = (screenSize.width * 0.8) / topRowLetters.length;
    const specialKeyWidth = normalKeyWidth * 1.5;

    const KeyboardRow = ({ children }) => {
        return (
            <Stack 
                direction="row" 
                spacing={1} 
                style={{ justifyContent: "center", padding: "5px" }}
            >
                {children}
            </Stack>
        )
    };

    const KeyboardKey = ({ text, width, rowHeight, fontSize }) => {    
        return (
            <Paper
                onClick={() => handleInputText(text)}
                style={{
                    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                    ...theme.typography.body2,
                    fontSize: fontSize ? fontSize : rowHeight / 2,
                    fontWeight: 'bold',
                    color: theme.palette.text.secondary,
                    height: rowHeight,
                    width: width,
                    lineHeight: `${rowHeight}px`,  // center text
                }}
            >
                {text}
            </Paper>
        )
    };

    const NormalKey = ({ text }) => {
        return (
            <KeyboardKey text={text} width={normalKeyWidth} rowHeight={rowHeight} />
        )
    };

    const EnterKey = () => {
        return (
            <KeyboardKey text="ENTER" width={specialKeyWidth} rowHeight={rowHeight} fontSize={rowHeight / 5} />
        )
    };

    const DeleteKey = () => {
        return (
            <KeyboardKey text={backspaceSymbol} width={specialKeyWidth} rowHeight={rowHeight} />
        )
    };

    return (
        <div className='Keyboard'>

            {/* top row */}
            <KeyboardRow>
                {topRowLetters.map((letter) => (
                    <NormalKey text={letter} key={`key${letter}`} />
                ))}
            </KeyboardRow>

            {/* middle row */}
            <KeyboardRow>
                {middleRowLetters.map((letter) => (
                    <NormalKey text={letter} key={`key${letter}`} />
                ))}
            </KeyboardRow>

            {/* bottom row */}
            <KeyboardRow>
                <EnterKey />
                {bottomRowLetters.map((letter) => (
                    <NormalKey text={letter} key={`key${letter}`} />
                ))}
                <DeleteKey />
            </KeyboardRow>

        </div>
    )
}

export default Keyboard;