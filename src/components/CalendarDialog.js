import * as React from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import CheckIcon from '@mui/icons-material/Check';
import CircleIcon from '@mui/icons-material/Circle';
import { earliestDate } from '../constants';
import { AlertDialog } from './AlertDialog';
import { Typography } from '@mui/material';

/**
 * Mimic fetch with abort controller https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort
 * ⚠️ No IE11 support
 */
function fakeFetch(date, db, { signal }) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      const monthDates = Object.keys(db).filter(x => dayjs(x).isSame(date, 'month'));
      const daysToHighlight = monthDates.map(x => dayjs(x).date());  // day of month
      const solvedDates = monthDates.filter(x => db[x].solvedDate).map(x => dayjs(x).date());
      // console.log("daysToHighlight:", daysToHighlight);
      // console.log("solved dates:", solvedDates);

      resolve({ daysToHighlight, solvedDates });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException('aborted', 'AbortError'));
    };
  });
}

// const initialValue = dayjs('2024-05-17');

function ServerDay(props) {
  const { highlightedDays = [], solvedDays = [], unfinishedIcon, solvedIcon, day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  const isNotDone = isSelected && solvedDays.indexOf(props.day.date()) < 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? (isNotDone ? unfinishedIcon : solvedIcon) : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

function Calendar({ today, puzzleDate, guessesDB, changeDate, handleClose, unfinishedIcon, solvedIcon }) {
  const [value, setValue] = React.useState(dayjs(puzzleDate));
  const requestAbortController = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([]);
  const [solvedDays, setSolvedDays] = React.useState([]);

  const fetchHighlightedDays = (date, db) => {
    const controller = new AbortController();
    fakeFetch(date, db, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight, solvedDates }) => {
        setHighlightedDays(daysToHighlight);
        setSolvedDays(solvedDates);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== 'AbortError') {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(dayjs(puzzleDate), guessesDB);
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, [guessesDB, puzzleDate]);

  const handleMonthChange = (date) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

    // console.log("month change date:", date.format("YYYY-MM-DD"));
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date, guessesDB);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        // defaultValue={dayjs(puzzleDate)}
        value={value}
        loading={isLoading}
        minDate={dayjs(earliestDate)}
        maxDate={dayjs(today)}
        onChange={(date, selectionComplete) => {
          if (selectionComplete) {
            // console.log("selected:", date.format('YYYY-MM-DD'));
            changeDate(date.format('YYYY-MM-DD'));
            setValue(date);
            if (date.year() === value.year()) {  // change year selects a date, so don't close calendar unless specifically selected
              handleClose();
            }
          }
        }}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
            solvedDays,
            unfinishedIcon,
            solvedIcon
          },
        }}
      />
    </LocalizationProvider>
  );
}

export default function CalendarDialog({ open, handleClose, today, puzzleDate, guessesDB, changeDate, green, yellow }) {
  const unfinishedIcon = <CircleIcon fontSize='small' style={{ color: yellow }} />;
  const solvedIcon = <CheckIcon fontSize='small' style={{ color: green }} />;

  return (
    <AlertDialog
      open={open}
      handleClose={handleClose}
      title="Calendar"
      text={
        <Typography component={'span'}>
          {solvedIcon} = solved<br></br>
          {unfinishedIcon} = unfinished
        </Typography>
      }
      buttons={[]}
      addlContent={[
        <Calendar
          key="dialog-calendar"
          today={today}
          puzzleDate={puzzleDate}
          guessesDB={guessesDB}
          changeDate={changeDate}
          handleClose={handleClose}
          unfinishedIcon={unfinishedIcon}
          solvedIcon={solvedIcon}
        />
      ]}
    />
  );
}