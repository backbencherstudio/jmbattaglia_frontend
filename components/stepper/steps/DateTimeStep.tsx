"use client";

import React, { useState, useEffect } from "react";
import { StepProps } from "@/types/stepper";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const DateTimeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  // Real-world current date
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Initial date: use formData.selectedDate if present, otherwise default to today
  const initialDate = formData.selectedDate ? new Date(formData.selectedDate) : today;

  const [currentYear, setCurrentYear] = useState<number>(
    isNaN(initialDate.getFullYear()) ? today.getFullYear() : initialDate.getFullYear()
  );
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(
    isNaN(initialDate.getMonth()) ? today.getMonth() : initialDate.getMonth()
  );

  // Initialize selectedDate with today's date if empty
  useEffect(() => {
    if (!formData.selectedDate) {
      updateFormData({ selectedDate: todayFormatted });
    }
  }, [formData.selectedDate, todayFormatted, updateFormData]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Dynamic calendar calculations
  const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();

  // Previous month padding
  const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();
  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + 1 + i
  );

  // Current month days
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);

  // Next month trailing padding
  const totalCellsSoFar = prevMonthDays.length + currentMonthDays.length;
  const trailingCellCount = (7 - (totalCellsSoFar % 7)) % 7;
  const nextMonthDays = Array.from({ length: trailingCellCount }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    updateFormData({ selectedDate: formattedDate });
    clearError("selectedDate");
  };

  const handleTimeSelect = (timeSlot: string) => {
    updateFormData({ selectedTimeSlot: timeSlot });
    clearError("selectedTimeSlot");
  };

  // Helper to check if a day is currently selected
  const isDaySelected = (day: number) => {
    const activeDateStr = formData.selectedDate || todayFormatted;
    const [selYear, selMonth, selDay] = activeDateStr.split("-").map(Number);
    return (
      selYear === currentYear &&
      selMonth === currentMonthIndex + 1 &&
      selDay === day
    );
  };

  // Helper to check if a day is actual real-world today
  const isToday = (day: number) => {
    return (
      today.getFullYear() === currentYear &&
      today.getMonth() === currentMonthIndex &&
      today.getDate() === day
    );
  };

  const selectedTime = formData.selectedTimeSlot || "1:00 PM";

  const timeCategories = [
    {
      category: "Morning",
      slots: ["8:00 AM", "9:00 AM", "10:00 AM"],
    },
    {
      category: "Afternoon",
      slots: ["12:00 PM", "1:00 PM", "2:00 PM"],
    },
    {
      category: "Evening",
      slots: ["6:00 PM", "7:00 PM", "8:00 PM"],
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Calendar Picker */}
        <div className="lg:col-span-6 flex flex-col w-full">
          <h3 className="text-lg font-bold text-main mb-3">Select a date</h3>

          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
            {/* Month / Year Navigation */}
            <div className="flex items-center justify-between px-1 py-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg text-sub hover:text-main hover:bg-white transition-all cursor-pointer"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-extrabold text-base sm:text-lg text-[var(--accent-green,#9CB800)] tracking-tight select-none">
                {months[currentMonthIndex]} {currentYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg text-sub hover:text-main hover:bg-white transition-all cursor-pointer"
                aria-label="Next Month"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center font-bold text-xs sm:text-sm text-main py-1">
              <span>Su</span>
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
            </div>

            {/* Date Cells Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {/* Prev Month Days */}
              {prevMonthDays.map((day, idx) => (
                <div
                  key={`prev-${idx}-${day}`}
                  className="py-2 rounded-xl text-center text-xs sm:text-sm text-gray-400 font-semibold bg-white/40 border border-transparent select-none"
                >
                  {day}
                </div>
              ))}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => {
                const selected = isDaySelected(day);
                const actualToday = isToday(day);

                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`py-2 rounded-xl text-center text-xs sm:text-sm font-bold transition-all select-none border cursor-pointer ${
                      selected
                        ? "bg-primary border-primary text-white shadow-xs scale-105"
                        : actualToday
                        ? "bg-white border-primary text-primary ring-2 ring-primary/30"
                        : "bg-white border-hairline text-main hover:border-primary hover:text-primary"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}

              {/* Next Month Days */}
              {nextMonthDays.map((day, idx) => (
                <div
                  key={`next-${idx}-${day}`}
                  className="py-2 rounded-xl text-center text-xs sm:text-sm text-gray-400 font-semibold bg-white/40 border border-transparent select-none"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {errors.selectedDate && (
            <p className="text-xs sm:text-sm text-red-500 font-medium mt-1.5">{errors.selectedDate}</p>
          )}
        </div>

        {/* Right Column: Time Slot Picker */}
        <div className="lg:col-span-6 flex flex-col w-full">
          <h3 className="text-lg font-bold text-main mb-3">Select a time</h3>

          <div className="flex flex-col gap-4">
            {timeCategories.map((group) => (
              <div key={group.category} className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  {group.category}
                </span>

                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {group.slots.map((slot) => {
                    const isSelected = selectedTime === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleTimeSelect(slot)}
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all border cursor-pointer select-none ${
                          isSelected
                            ? "bg-primary-subtle border-primary text-primary shadow-2xs"
                            : "bg-white border-hairline text-main hover:bg-canvas hover:border-primary/40"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {errors.selectedTimeSlot && (
            <p className="text-xs sm:text-sm text-red-500 font-medium mt-1.5">{errors.selectedTimeSlot}</p>
          )}
        </div>
      </div>
    </div>
  );
};
