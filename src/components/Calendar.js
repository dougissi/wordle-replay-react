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
  const { highlightedDays = [], solvedDays = [], green, yellow, day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;

  const isNotDone = isSelected && solvedDays.indexOf(props.day.date()) < 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? (isNotDone ? <CircleIcon fontSize='small' style={{ color: yellow }} /> : <CheckIcon fontSize='small' style={{ color: green }} />) : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function Calendar({ today, puzzleDate, guessesDB, changeDate, setShowCalendar, green, yellow }) {
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

    console.log("month change date:", date.format("YYYY-MM-DD"));
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
            setShowCalendar(false);
            setValue(date);
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
            green,
            yellow
          },
        }}
      />
    </LocalizationProvider>
  );
}
