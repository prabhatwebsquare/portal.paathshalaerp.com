import { Tooltip } from '@chakra-ui/react';
import dayjs from 'dayjs';
import { find, findIndex, map } from 'lodash';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CustomMultipleDatePicker = ({ holidays, month, year, selectedDates, setSelectedDates }) => {
    const [selectableMonth, setSelectableMonth] = useState(month);
    const [selectableYear, setSelectableYear] = useState(year);

    const today = dayjs(); // Get today's date using dayjs

    useEffect(() => {
        if (selectedDates.length > 0) {
            const firstSelectedDate = selectedDates[0];
            setSelectableMonth(firstSelectedDate.getMonth());
            setSelectableYear(firstSelectedDate.getFullYear());
        }
    }, [selectedDates]);

    const isDateSelected = (date) => {
        return selectedDates.some(
            (selectedDate) =>
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const isAbsent = (date) => {
        return selectedDates.some(
            (selectedDate) =>
                date.getDate() !== selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
        );
    };

    const isHoliday = (date) => {
        const dateFormat = dayjs(date).format("YYYY-MM-DD");
        return holidays?.includes(dateFormat);
    };

    const handleDateClick = (date) => {
        if (date.getMonth() === selectableMonth && date.getFullYear() === selectableYear) {
            if (dayjs(date).isAfter(today, 'day')) {
                return; // Prevent selecting future dates
            }
            if (isDateSelected(date)) {
                setSelectedDates(
                    selectedDates.filter(
                        (selectedDate) =>
                            date.getDate() !== selectedDate.getDate() ||
                            date.getMonth() !== selectedDate.getMonth() ||
                            date.getFullYear() !== selectedDate.getFullYear()
                    )
                );
            } else {
                setSelectedDates([...selectedDates, date]);
            }
        }
    };

    return (
        <div>
            <DatePicker
                selected={new Date(selectableYear, selectableMonth)}
                onChange={handleDateClick}
                dateFormat="dd-MM-yyyy"
                inline
                renderDayContents={(day, date) => {
                    const isSelected = isDateSelected(date);
                    const isSelectable = date.getMonth() === selectableMonth && date.getFullYear() === selectableYear;
                    const isSunday = date.getDay() === 0;
                    const isHolidayDate = isHoliday(date);
                    const absent = isAbsent(date);

                    let style = {};
                    if (dayjs(date).isAfter(today, 'day')) {
                        style.pointerEvents = 'none'; // Disable future dates
                        style.backgroundColor = '#ECE9EB';
                        style.color = 'gray';
                    } else if (isSelected) {
                        style.backgroundColor = '#48BB78';
                        style.color = "#ffffff";
                    } else if (!isSelectable) {
                        style.backgroundColor = '#ECE9EB';
                        style.pointerEvents = 'none';
                        style.color = "gray";
                    } else if (absent) {
                        style.backgroundColor = 'red';
                        style.color = 'white';
                    }
                    if (isSunday) {
                        style.color = '#FC73B8';
                        style.backgroundColor = 'white';
                    }
                    if (isHolidayDate) {
                        style.border = '1px solid red';
                        style.backgroundColor = 'white';
                        style.color = 'black';
                    }

                    return (
                        <Tooltip placement='top' label={isSunday ? "Sunday" : isHolidayDate ? "Holiday" : ""}>
                            <div style={style} onClick={() => handleDateClick(date)}>
                                {day}
                            </div>
                        </Tooltip>
                    );
                }}
            />
        </div>
    );
};

export default CustomMultipleDatePicker;
