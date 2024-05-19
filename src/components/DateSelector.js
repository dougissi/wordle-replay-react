import { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { earliestDate } from '../constants';

export function DateSelector({ today, puzzleDate, changeDate }) {
    const [value, setValue] = useState(dayjs(puzzleDate));

    const handleOnChange = (newDate) => {
        setValue(newDate);
        const newDateStr = newDate.format('YYYY-MM-DD');
        changeDate(newDateStr);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label="Puzzle Date"
                    minDate={dayjs(earliestDate)}
                    maxDate={dayjs(today)}
                    value={value}
                    onChange={handleOnChange}
                    slotProps={{ textField: { size: 'small' } }}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
