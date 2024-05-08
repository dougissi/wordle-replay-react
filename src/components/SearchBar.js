import { Autocomplete } from "@mui/material";
import TextField from '@mui/material/TextField';
import { dateToPuzzleNum } from "../assets/date_to_puzzle_num";

export function SearchBar({ today, changeDate, solvedPuzzleNums }) {
    const options = [];
    for ( const [date, puzzleNum] of dateToPuzzleNum.entries()) {
        // console.log(date, puzzleNum);
        if (date > today) {
            break;
        }
        options.push({date: date, puzzleNum: puzzleNum, solved: solvedPuzzleNums.has(puzzleNum) ? "Solved" : "Unsolved"});
    }

    const handleChange = (event, option) => {
        changeDate(option.date);
    };

    return (
        <Autocomplete
            id="search-bar"
            sx={{ width: 250 }}
            size="small"
            options={options.sort((a,b) => b.solved.localeCompare(a.solved) || b.puzzleNum - a.puzzleNum)}
            groupBy={(option) => option.solved}
            getOptionLabel={(option) => `#${option.puzzleNum}: ${option.date}`}
            isOptionEqualToValue={(option, value) => option.puzzleNum === value.puzzleNum}
            renderInput={(params) => <TextField {...params} label="Search by # or date" />}
            onChange={handleChange}
            style={{ paddingTop: '10px' }}
            disableClearable
        />
    )
}