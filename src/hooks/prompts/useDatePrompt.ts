import { useState, useRef, useEffect } from 'react';

type LimitFunction = (value: number) => number;

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
            const stringContent = year.toString();

            if (isNaN(year)) {
                yearRef.current.innerText = '';
            } else {
                yearRef.current.innerText = stringContent;
            }
        }

        if (monthRef.current) {
            const stringContent = month.toString().padStart(2, '0');

            if (isNaN(month)) {
                monthRef.current.innerText = '';
            } else {
                monthRef.current.innerText = stringContent;
            }
        }

        if (dayRef.current) {
            const stringContent = day.toString().padStart(2, '0');

            if (isNaN(day)) {
                dayRef.current.innerText = '';
            } else {
                dayRef.current.innerText = stringContent;
            }
        }
    }, [year, month, day]);

    useEffect(() => {
        let dayValue = day;
        dayValue = applyDayLimits(dayValue);
        setDay(dayValue);
    }, [year, month]);

    const adjustYear = (amount: number) => {
        let yearValue = year;
        yearValue += amount;
        yearValue = applyYearLimits(yearValue);
        setYear(yearValue);

        if (yearRef.current) {
            const stringContent = yearValue.toString();

            if (isNaN(yearValue)) {
                yearRef.current.innerText = '';
            } else {
                yearRef.current.innerText = stringContent;
            }
        }
    };

    const adjustMonth = (amount: number) => {
        let monthValue = month;
        monthValue += amount;
        monthValue = applyMonthLimits(monthValue);
        setMonth(monthValue);

        if (monthRef.current) {
            const stringContent = monthValue.toString().padStart(2, '0');

            if (isNaN(monthValue)) {
                monthRef.current.innerText = '';
            } else {
                monthRef.current.innerText = stringContent;
            }
        }
    };

    const adjustDay = (amount: number) => {
        let dayValue = day;
        dayValue += amount;
        dayValue = applyDayLimits(dayValue);
        setDay(dayValue);

        if (dayRef.current) {
            const stringContent = dayValue.toString().padStart(2, '0');

            if (isNaN(dayValue)) {
                dayRef.current.innerText = '';
            } else {
                dayRef.current.innerText = stringContent;
            }
        }
    };

    const applyYearLimits: LimitFunction = (yearValue: number) => {
        if (yearValue < 1) {
            return 1;
        }

        return yearValue;
    };

    const applyMonthLimits: LimitFunction = (monthValue: number) => {
        if (monthValue < 1) {
            return 1;
        }

        if (monthValue > 12) {
            return 12;
        }

        return monthValue;
    };

    const applyDayLimits: LimitFunction = (dayValue: number) => {
        if (dayValue < 1) {
            return 1;
        }

        const maxDaysInMonth = new Date(year, month, 0).getDate();
        if (dayValue > maxDaysInMonth) {
            return maxDaysInMonth;
        }

        return dayValue;
    };

    const clear = () => {
        const currentTime = new Date();
        const newYear = currentTime.getFullYear();
        const newMonth = currentTime.getMonth() + 1;
        const newDay = currentTime.getDate();
        setYear(newYear);
        setMonth(newMonth);
        setDay(newDay);
    };

    return { date, yearRef, monthRef, dayRef, adjustYear, adjustMonth, adjustDay, clear };
};

export default useDatePrompt;
