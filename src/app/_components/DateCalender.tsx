import { useState } from "react";
import { SlCalender } from "react-icons/sl";
import { FaAngleDown } from "react-icons/fa";
// Add minDate prop to the interface
interface DateCalenderProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  minDate?: Date | null; // Add this prop for return date validation
}

// Update the component definition
export default function DateCalender({
  selectedDate,
  setSelectedDate,
  minDate,
}: DateCalenderProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthSelector, setShowMonthSelector] = useState(false);
  const [showYearSelector, setShowYearSelector] = useState(false);

  // Get current date information
  const today = new Date();

  // Format date as DD MMM YY
  const formatDate = (date: Date | null): string => {
    if (!date) return "Select date";
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().substr(-2);
    return `${day} ${month} ${year}`;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  // Get days in month
  // Add types to these functions
  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // const isDateInPast = (date: Date): boolean => {
  //   const compareDate = new Date(date);
  //   compareDate.setHours(0, 0, 0, 0);

  //   const compareToday = new Date(today);
  //   compareToday.setHours(0, 0, 0, 0);

  //   return compareDate < compareToday;
  // };

  const handleMonthSelect = (monthIndex: number): void => {
    if (
      currentMonth.getFullYear() === today.getFullYear() &&
      monthIndex < today.getMonth()
    ) {
      return;
    }

    const newDate = new Date(currentMonth);
    newDate.setMonth(monthIndex);
    setCurrentMonth(newDate);
    setShowMonthSelector(false);
  };

  const handleYearSelect = (year: number): void => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);

    if (year === today.getFullYear() && newDate.getMonth() < today.getMonth()) {
      newDate.setMonth(today.getMonth());
    }

    setCurrentMonth(newDate);
    setShowYearSelector(false);
  };

  const generateYearOptions = (): number[] => {
    const years: number[] = [];
    const currentYear = today.getFullYear();

    for (let i = 0; i <= 10; i++) {
      years.push(currentYear + i);
    }

    return years;
  };

  // Generate calendar days
  // Add this function near the other date-related functions
  const isDateInRange = (date: Date): boolean => {
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);

    const compareToday = new Date(today);
    compareToday.setHours(0, 0, 0, 0);

    const maxDate = new Date(compareToday);
    if (minDate) {
      maxDate.setDate(maxDate.getDate() + 15);
    } else {
      maxDate.setDate(maxDate.getDate() + 10);
    }

    // If minDate is provided (for return date), use it as the minimum
    if (minDate) {
      const compareMinDate = new Date(minDate);
      compareMinDate.setHours(0, 0, 0, 0);
      return compareDate >= compareMinDate && compareDate <= maxDate;
    }

    return compareDate >= compareToday && compareDate <= maxDate;
  };

  // Update the generateCalendarDays function
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      // const isPast = isDateInPast(date);
      const isInRange = isDateInRange(date);
      const isToday =
        today.getDate() === day &&
        today.getMonth() === month &&
        today.getFullYear() === year;

      days.push(
        <div
          key={day}
          onClick={() => isInRange && handleDateSelect(date)}
          className={`w-8 h-8 flex items-center justify-center rounded-full
                     ${isToday ? "bg-blue-100 text-blue-600" : ""}
                     ${
                       !isInRange
                         ? "text-gray-300 cursor-not-allowed"
                         : "cursor-pointer text-gray-700 hover:border-[#32d095] hover:border"
                     }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);

    // Don't allow navigating to months before current month
    if (
      newDate.getMonth() >= today.getMonth() ||
      newDate.getFullYear() > today.getFullYear()
    ) {
      setCurrentMonth(newDate);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="relative text-gray-800">
      {/* Date Input Field */}
      <div
        className=" rounded  flex items-center cursor-pointer bg-[#d7e7f4]"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div className="bg-[#32d095] p-2 rounded-l flex items-center mr-2">
          <SlCalender size={20} className="text-white" />
        </div>
        <span className={`${selectedDate ? "text-gray-800" : "text-gray-400"}`}>
          {formatDate(selectedDate)}
        </span>
      </div>

      {/* Calendar Dropdown */}
      {showCalendar && (
        <div className="absolute top-12 left-0 bg-white border border-gray-200 rounded-md shadow-lg p-3 z-10 w-64">
          {/* Month and Year Header with Selectors */}
          <div className="flex justify-between items-center mb-4 relative">
            <button
              onClick={goToPrevMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              &lt;
            </button>

            {/* Month Year Selector */}
            <div className="flex items-center">
              {/* Month Selector */}
              <div className="relative mr-1">
                <button
                  onClick={() => {
                    setShowMonthSelector(!showMonthSelector);
                    setShowYearSelector(false);
                  }}
                  className="flex items-center font-medium hover:bg-gray-100 px-1 rounded"
                >
                  {currentMonth.toLocaleString("default", { month: "long" })}
                  <FaAngleDown size={16} className="ml-1" />
                </button>

                {/* Month Dropdown */}
                {showMonthSelector && (
                  <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-32 max-h-48 overflow-y-auto">
                    {months.map((month, index) => {
                      const isDisabled =
                        currentMonth.getFullYear() === today.getFullYear() &&
                        index < today.getMonth();
                      return (
                        <div
                          key={month}
                          onClick={() =>
                            !isDisabled && handleMonthSelect(index)
                          }
                          className={`px-2 py-1 rounded cursor-pointer ${
                            isDisabled
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          } ${
                            currentMonth.getMonth() === index
                              ? "bg-blue-100"
                              : ""
                          }`}
                        >
                          {month}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Year Selector */}
              <div className="relative text-gray-800">
                <button
                  onClick={() => {
                    setShowYearSelector(!showYearSelector);
                    setShowMonthSelector(false);
                  }}
                  className="flex items-center font-medium hover:bg-gray-100 px-1 rounded"
                >
                  {currentMonth.getFullYear()}
                  <FaAngleDown size={16} className="ml-1" />
                </button>

                {/* Year Dropdown */}
                {showYearSelector && (
                  <div className="absolute top-8 left-0 bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-20 max-h-48 overflow-y-auto">
                    {generateYearOptions().map((year) => (
                      <div
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 ${
                          currentMonth.getFullYear() === year
                            ? "bg-blue-100"
                            : ""
                        }`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              &gt;
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="w-8 h-8 flex items-center justify-center text-gray-500 text-xs"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">{generateCalendarDays()}</div>

          {/* Today Button */}
          {!minDate && (
            <div className="mt-2 text-center">
              <button
                onClick={() => {
                  setCurrentMonth(new Date());
                  handleDateSelect(today);
                }}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Today
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
