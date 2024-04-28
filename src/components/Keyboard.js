import { useTheme } from '@mui/material/styles';
import useScreenSize from './useScreenSize';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

// import KeyboardKey from './KeyboardKey';

function Keyboard() {
    const screenSize = useScreenSize();
    const theme = useTheme();

    const keyboardVerticalPctOfScreen = 0.25;
    const numRows = 3;
    const rowHeight = screenSize.height * keyboardVerticalPctOfScreen / numRows;
    
    const topRowLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
    const middleRowLetters = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
    const bottomRowLetters = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];

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
                onClick={() => {console.log(`clicked ${text}`)}}
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
                {text.toUpperCase()}
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
            <KeyboardKey text="&#11013;" width={specialKeyWidth} rowHeight={rowHeight} />
        )
    };

    return (
        <div className='Keyboard'>

            {/* top row */}
            <KeyboardRow>
                {topRowLetters.map((keyLetter, i) => (
                    <NormalKey text={keyLetter} key={`key${keyLetter}`} />
                ))}
            </KeyboardRow>

            {/* middle row */}
            <KeyboardRow>
                {middleRowLetters.map((keyLetter, i) => (
                    <NormalKey text={keyLetter} key={`key${keyLetter}`} />
                ))}
            </KeyboardRow>

            {/* bottom row */}
            <KeyboardRow>
                <EnterKey />
                {bottomRowLetters.map((keyLetter, i) => (
                    <NormalKey text={keyLetter} key={`key${keyLetter}`} />
                ))}
                <DeleteKey />
            </KeyboardRow>

        </div>
    )
}

export default Keyboard;