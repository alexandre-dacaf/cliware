import { useState, useRef, useEffect } from 'react';
import { DateLimitFunction, DateKeyDownHandler } from 'types';

const useDatePrompt = (initialYear: number, initialMonth: number, initialDay: number) => {
    const [date, setDate] = useState<Date | null>(null);
    const [year, setYear] = useState<number>(initialYear ?? 1900);
    const [month, setMonth] = useState<number>(initialMonth ?? 1);
    const [day, setDay] = useState<number>(initialDay ?? 1);
    const yearRef = useRef<HTMLSpanElement>(null);
    const monthRef = useRef<HTMLSpanElement>(null);
    const dayRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const monthIndex = month - 1;
        const newDate = new Date(year, monthIndex, day);
        setDate(newDate);

        if (yearRef.current) {
            yearRef.current.innerText = year.toString();
        }

        if (monthRef.current) {
            monthRef.current.innerText = month.toString().padStart(2, '0');
        }

        if (dayRef.current) {
            dayRef.current.innerText = day.toString().padStart(2, '0');
        }
    }, [year, month, day]);

    useEffect(() => {
        let dayValue = day;
        dayValue = applyDayLimits(dayValue);
        setDay(dayValue);
    }, [year, month]);

    const adjustYear = (amount: number) => {
        let yearValue = year + amount;
        yearValue = applyYearLimits(yearValue);
        setYear(yearValue);
    };

    const adjustMonth = (amount: number) => {
        let monthValue = month + amount;
        monthValue = applyMonthLimits(monthValue);
        setMonth(monthValue);
    };

    const adjustDay = (amount: number) => {
        let dayValue = day + amount;
        dayValue = applyDayLimits(dayValue);
        setDay(dayValue);
    };

    const applyYearLimits: DateLimitFunction = (yearValue: number) => {
        if (yearValue < 1) return 1;
        return yearValue;
    };

    const applyMonthLimits: DateLimitFunction = (monthValue: number) => {
        if (monthValue < 1) return 1;
        if (monthValue > 12) return 12;
        return monthValue;
    };

    const applyDayLimits: DateLimitFunction = (dayValue: number) => {
        if (dayValue < 1) return 1;

        const maxDaysInMonth = new Date(year, month, 0).getDate();
        if (dayValue > maxDaysInMonth) return maxDaysInMonth;

        return dayValue;
    };

    const focusYear = () => {
        yearRef.current?.focus();
    };

    const focusMonth = () => {
        monthRef.current?.focus();
    };

    const focusDay = () => {
        dayRef.current?.focus();
    };

    const yearHandler: DateKeyDownHandler = {
        adjust: adjustYear,
        focusLeft: focusDay,
        focusRight: focusMonth,
    };

    const monthHandler: DateKeyDownHandler = {
        adjust: adjustMonth,
        focusLeft: focusYear,
        focusRight: focusDay,
    };

    const dayHandler: DateKeyDownHandler = {
        adjust: adjustDay,
        focusLeft: focusMonth,
        focusRight: focusYear,
    };

    const clear = () => {
        const currentTime = new Date();
        setYear(currentTime.getFullYear());
        setMonth(currentTime.getMonth() + 1);
        setDay(currentTime.getDate());
    };

    return { date, yearRef, monthRef, dayRef, yearHandler, monthHandler, dayHandler, focusYear, clear };
};

export default useDatePrompt;
