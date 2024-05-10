import { useState } from 'react';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { earliestDate } from '../constants';

export function DateSelector({ today, changeDate }) {
    const todayDate = dayjs(today);
    const [value, setValue] = useState(todayDate);

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
                maxDate={todayDate}
                value={value}
                onChange={handleOnChange}
                slotProps={{ textField: { size: 'small' } }}
            />
        </DemoContainer>
        </LocalizationProvider>
    );
}
