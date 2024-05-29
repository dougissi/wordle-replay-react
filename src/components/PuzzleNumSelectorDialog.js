import { useState } from "react";
import { TextField } from "@mui/material";
import { puzzleNumToDate } from "../utils";
import { AlertDialog } from "./AlertDialog";

function PuzzleNumSelector({ puzzleNum, isValidPuzzleNum, changeDate, handleClose }) {
    const [value, setValue] = useState(puzzleNum);
    const [isError, setIsError] = useState(!isValidPuzzleNum(puzzleNum));

    return (
        <TextField
            id="puzzle-selector-text-field"
            label="Puzzle Number"
            size="small"
            error={isError}
            style={{ margin: "10px 0px" }}
            helperText={isError ? "Invalid puzzle number" : null }
            value={value}
            onKeyDown={event => {
                if (event.key === 'Enter' && !isError) {
                    changeDate(puzzleNumToDate(value));
                    handleClose();
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

export default function PuzzleNumSelectorDialog({ open, handleClose, puzzleNum, isValidPuzzleNum, changeDate }) {
    return (
        <AlertDialog
            open={open}
            handleClose={handleClose}
            onKeyDown={() => void(0)}  // TODO: make more robust
            title="Enter Puzzle Number"
            addlContent={[
                <PuzzleNumSelector
                    key="puzzle-num-selector"
                    puzzleNum={puzzleNum}
                    isValidPuzzleNum={isValidPuzzleNum}
                    changeDate={changeDate}
                    handleClose={handleClose}
                />
            ]}
        />
    )
}
