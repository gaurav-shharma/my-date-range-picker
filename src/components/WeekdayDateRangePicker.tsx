import React, { useState, useEffect } from "react";
import { formatDate, getWeekendsInRange, isWeekend } from "../utils/Helpers";

interface WeekdayDateRangePickerProps {
  onChange: (range: [string[], string[]]) => void;
  predefinedRanges?: boolean;
}

const WeekdayDateRangePicker: React.FC<WeekdayDateRangePickerProps> = ({
  onChange,
  predefinedRanges = true,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (startDate && endDate) {
      const weekends = getWeekendsInRange(startDate, endDate);
      const selectedRange = [formatDate(startDate), formatDate(endDate)];
      onChange([selectedRange, weekends]);
    }
  }, [startDate, endDate, onChange]);

  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) return; // Ignore weekends

    const dateToSelect = new Date(date);
    dateToSelect.setHours(0, 0, 0, 0); // Set to midnight

    if (!startDate || (startDate && endDate)) {
      setStartDate(dateToSelect);
      setEndDate(null);
    } else if (dateToSelect >= startDate) {
      setEndDate(dateToSelect);
      setHoveredDate(null);
    } else {
      setStartDate(dateToSelect);
    }
  };

  const handleDateHover = (date: Date) => {
    if (!startDate || endDate || isWeekend(date)) return;
    setHoveredDate(date);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentMonth(parseInt(event.target.value));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentYear(parseInt(event.target.value));
  };

  const handlePredefinedRange = (days: number) => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - days);
    setStartDate(start);
    setEndDate(today);
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendarDays = [];

    const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    weekLabels.forEach((label, index) => {
      calendarDays.push(
        <div key={`label-${index}`} className="week-label">
          {label}
        </div>
      );
    });

    const firstDateOfMonth = new Date(currentYear, currentMonth, 1);
    const firstDayOfMonth = (firstDateOfMonth.getDay() + 6) % 7;

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(
        <div key={`empty-${i}`} className="calendar-day empty"></div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isWeekday = !isWeekend(date);
      const isSelected =
        startDate &&
        endDate &&
        date >= startDate &&
        date <= endDate &&
        isWeekday;
      const isHoveredRange =
        startDate &&
        !endDate &&
        hoveredDate &&
        date >= startDate &&
        date <= hoveredDate &&
        isWeekday;

      calendarDays.push(
        <button
          key={i}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => handleDateHover(date)}
          onMouseLeave={() => setHoveredDate(null)}
          className={`calendar-day ${isWeekday ? "weekday" : "weekend"} ${
            isSelected ? "selected" : ""
          } ${isHoveredRange ? "hovered-range" : ""}`}
        >
          {i}
        </button>
      );
    }

    return calendarDays;
  };

  return (
    <div className="date-picker-container">
      <h3>Weekday Date Range Picker</h3>

      <div className="month-year-selection">
        <button className="next-prev-button" onClick={handlePreviousMonth}>
          {"<"}
        </button>
        <select value={currentMonth} onChange={handleMonthChange}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <select value={currentYear} onChange={handleYearChange}>
          {Array.from({ length: 10 }, (_, index) => (
            <option key={index} value={currentYear - 5 + index}>
              {currentYear - 5 + index}
            </option>
          ))}
        </select>
        <button className="next-prev-button" onClick={handleNextMonth}>
          {">"}
        </button>
      </div>

      <div className="calendar-grid">{renderCalendar()}</div>

      {predefinedRanges && (
        <div className="predefined-ranges">
          <button onClick={() => handlePredefinedRange(7)}>Last 7 Days</button>
          <button onClick={() => handlePredefinedRange(30)}>
            Last 30 Days
          </button>
        </div>
      )}
    </div>
  );
};

export default WeekdayDateRangePicker;
