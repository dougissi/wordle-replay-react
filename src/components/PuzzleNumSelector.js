import { useState } from "react";
import { TextField } from "@mui/material";
import { puzzleNumToDate } from "../utils";

export default function PuzzleNumSelector({ puzzleNum, isValidPuzzleNum, changeDate, setShowPuzzleSelector }) {
    const [value, setValue] = useState(puzzleNum);
    const [isError, setIsError] = useState(!isValidPuzzleNum(puzzleNum));

    return (
        <TextField
            id="puzzle-selector-text-field"
            label="Puzzle Number"
            size="small"
            error={isError}
            helperText={isError ? "Invalid puzzle number" : null }
            value={value}
            onKeyDown={event => {
                if (event.key === 'Enter' && !isError) {
                    changeDate(puzzleNumToDate(value));
                    setShowPuzzleSelector(false);
                } 
            }}
            onChange={(event) => {
                setValue(event.target.value);
                if (isValidPuzzleNum(event.target.value)) {
                    setIsError(false);
                } else {
                    setIsError(true);
                }
            }}
        />
    );
}
