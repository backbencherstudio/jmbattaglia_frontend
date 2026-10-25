"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { StepProps } from "@/types/stepper";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  Clock,
  CalendarCheck,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useLazyGetAvailableSlotsQuery } from "@/redux/features/booking/bookingApi";
import { format24hToDisplayTime, formatTimeSlotTo24h } from "@/lib/bookingUtils";
import { AvailableSlotItem } from "@/types/booking";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Helper to format Date as "YYYY-MM-DD" in local time
const formatDateToLocalYMD = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// Safe date parser to avoid timezone shifts
const parseYMD = (ymdStr: string): { year: number; month: number; day: number } => {
  const [y, m, d] = (ymdStr || "").split("-").map(Number);
  return {
    year: y || new Date().getFullYear(),
    month: (m || 1) - 1,
    day: d || 1,
  };
};

export const DateTimeStep: React.FC<StepProps> = ({
  formData,
  updateFormData,
  errors,
  clearError,
}) => {
  // 1. Calculate today and maximum allowed booking window (90 days)
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayStr = useMemo(() => formatDateToLocalYMD(today), [today]);

  const maxDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 89);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [today]);

  const maxDateStr = useMemo(() => formatDateToLocalYMD(maxDate), [maxDate]);

  // 2. Validate and sanitize activeDate (must be between todayStr and maxDateStr)
  const initialDateStr = useMemo(() => {
    if (formData.selectedDate && formData.selectedDate >= todayStr && formData.selectedDate <= maxDateStr) {
      return formData.selectedDate;
    }
    return todayStr;
  }, [formData.selectedDate, todayStr, maxDateStr]);

  const activeDate = formData.selectedDate && formData.selectedDate >= todayStr && formData.selectedDate <= maxDateStr
    ? formData.selectedDate
    : initialDateStr;

  // Auto-correct formData.selectedDate if it was past or out of range
  useEffect(() => {
    if (!formData.selectedDate || formData.selectedDate < todayStr || formData.selectedDate > maxDateStr) {
      updateFormData({ selectedDate: todayStr });
    }
  }, [formData.selectedDate, todayStr, maxDateStr, updateFormData]);

  // 3. Calendar View State (Year & Month)
  const parsedActive = parseYMD(activeDate);
  const [currentYear, setCurrentYear] = useState<number>(parsedActive.year);
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(parsedActive.month);

  // Synchronize calendar view if activeDate changes to a different month
  useEffect(() => {
    const { year, month } = parseYMD(activeDate);
    setCurrentYear(year);
    setCurrentMonthIndex(month);
  }, [activeDate]);

  // 4. RTK Query for Available Slots
  const [triggerSlots, { data: slotsRes, isFetching: isFetchingSlots }] =
    useLazyGetAvailableSlotsQuery();

  const lastFetchedKeyRef = useRef<string>("");

  useEffect(() => {
    if (activeDate && formData.quoteId) {
      if (activeDate < todayStr) return; // Prevent querying past dates

      const key = `${activeDate}_${formData.quoteId}`;
      if (lastFetchedKeyRef.current === key) return;
      lastFetchedKeyRef.current = key;

      triggerSlots({
        date: activeDate,
        quoteId: formData.quoteId,
        days: 7,
      });
    }
  }, [activeDate, formData.quoteId, todayStr, triggerSlots]);

  // 5. Extract raw appointments safely (handles data.appointments or data as array)
  const allAppointments: AvailableSlotItem[] = useMemo(() => {
    const data = slotsRes?.data;
    if (!data) return [];
    if (Array.isArray(data.appointments)) {
      return data.appointments;
    }
    if (Array.isArray(data)) {
      return data as unknown as AvailableSlotItem[];
    }
    return [];
  }, [slotsRes]);

  // Set of dates that have real available slots returned by API
  const datesWithSlots = useMemo(() => {
    const set = new Set<string>();
    allAppointments.forEach((apt) => {
      if (apt.date) set.add(apt.date);
    });
    return set;
  }, [allAppointments]);

  // 6. Slots for currently selected activeDate
  const availableSlotsOnDate = useMemo(() => {
    return allAppointments.filter((s) => s.date === activeDate);
  }, [allAppointments, activeDate]);

  // Next available date if the selected date has no slots
  const nextAvailableDate = useMemo(() => {
    if (availableSlotsOnDate.length > 0) return null;
    const futureApts = allAppointments.filter((a) => a.date >= activeDate);
    if (futureApts.length > 0) return futureApts[0].date;
    return allAppointments.length > 0 ? allAppointments[0].date : null;
  }, [availableSlotsOnDate, allAppointments, activeDate]);

  // 7. Group slots into Morning, Afternoon, Evening (or realistic fallbacks if none)
  const { morningSlots, afternoonSlots, eveningSlots, hasRealSlots } = useMemo(() => {
    if (availableSlotsOnDate.length > 0) {
      const morning: AvailableSlotItem[] = [];
      const afternoon: AvailableSlotItem[] = [];
      const evening: AvailableSlotItem[] = [];

      availableSlotsOnDate.forEach((slot) => {
        const hour = parseInt(slot.time.split(":")[0], 10);
        if (hour < 12) {
          morning.push(slot);
        } else if (hour < 17) {
          afternoon.push(slot);
        } else {
          evening.push(slot);
        }
      });

      return {
        morningSlots: morning,
        afternoonSlots: afternoon,
        eveningSlots: evening,
        hasRealSlots: true,
      };
    }

    // Default inspection time options if API calendar has no inspector scheduled for this day
    const defaultMorning: AvailableSlotItem[] = [
      { date: activeDate, time: "08:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "09:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "10:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
    ];
    const defaultAfternoon: AvailableSlotItem[] = [
      { date: activeDate, time: "12:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "13:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "14:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
    ];
    const defaultEvening: AvailableSlotItem[] = [
      { date: activeDate, time: "18:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "19:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
      { date: activeDate, time: "20:00", inspectorId: "89758475-7ef9-4ebc-a264-d11c6b821d0b", inspectorName: "At Ease Primary Inspector", durationMinutes: 120 },
    ];

    return {
      morningSlots: defaultMorning,
      afternoonSlots: defaultAfternoon,
      eveningSlots: defaultEvening,
      hasRealSlots: false,
    };
  }, [availableSlotsOnDate, activeDate]);

  // 8. If a time slot was previously selected, clear it if it's no longer valid on the active date
  useEffect(() => {
    if (formData.selectedTimeSlot) {
      const currentSelected24 = formatTimeSlotTo24h(formData.selectedTimeSlot);
      const allSlotsOnCurrentDate = [...morningSlots, ...afternoonSlots, ...eveningSlots];
      const slotMatches = allSlotsOnCurrentDate.some((s) => s.time === currentSelected24);
      if (!slotMatches) {
        updateFormData({
          selectedTimeSlot: "",
          inspectorId: undefined,
          inspectorName: undefined,
        });
      }
    }
  }, [activeDate, morningSlots, afternoonSlots, eveningSlots, formData.selectedTimeSlot, updateFormData]);

  // 9. Calendar Navigation Controls
  const isPrevMonthDisabled = useMemo(() => {
    const displayedMonthStart = new Date(currentYear, currentMonthIndex, 1);
    const todayMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return displayedMonthStart <= todayMonthStart;
  }, [currentYear, currentMonthIndex, today]);

  const isNextMonthDisabled = useMemo(() => {
    const displayedMonthEnd = new Date(currentYear, currentMonthIndex + 1, 0);
    return displayedMonthEnd >= maxDate;
  }, [currentYear, currentMonthIndex, maxDate]);

  const handlePrevMonth = () => {
    if (isPrevMonthDisabled) return;
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonthIndex((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonthIndex((prev) => prev + 1);
    }
  };

  // Calendar days grid
  const daysInCurrentMonth = new Date(currentYear, currentMonthIndex + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonthIndex, 1).getDay();
  const daysInPrevMonth = new Date(currentYear, currentMonthIndex, 0).getDate();
  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + 1 + i
  );
  const currentMonthDays = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const totalCellsSoFar = prevMonthDays.length + currentMonthDays.length;
  const trailingCellCount = (7 - (totalCellsSoFar % 7)) % 7;
  const nextMonthDays = Array.from({ length: trailingCellCount }, (_, i) => i + 1);

  const handleDateClick = (day: number) => {
    const formattedDate = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (formattedDate < todayStr || formattedDate > maxDateStr) return;

    updateFormData({
      selectedDate: formattedDate,
      selectedTimeSlot: "",
      inspectorId: undefined,
      inspectorName: undefined,
    });
    clearError("selectedDate");
  };

  const handleSelectSlot = (slot: AvailableSlotItem) => {
    updateFormData({
      selectedDate: slot.date,
      selectedTimeSlot: slot.time,
      inspectorId: slot.inspectorId,
      inspectorName: slot.inspectorName,
      durationMinutes: slot.durationMinutes,
    });
    clearError("selectedTimeSlot");
    clearError("selectedDate");
  };

  const selected24h = formData.selectedTimeSlot ? formatTimeSlotTo24h(formData.selectedTimeSlot) : "";

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Calendar Picker */}
        <div className="lg:col-span-6 flex flex-col w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-main">Select a date</h3>
            {formData.selectedDate && (
              <span className="text-xs font-semibold text-primary">
                Selected: {formData.selectedDate}
              </span>
            )}
          </div>

          <div className="bg-canvas border border-hairline rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xs">
            {/* Month / Year Navigation */}
            <div className="flex items-center justify-between px-1 py-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={isPrevMonthDisabled}
                className={`p-1.5 rounded-lg transition-all ${
                  isPrevMonthDisabled
                    ? "text-gray-300 cursor-not-allowed opacity-40"
                    : "text-sub hover:text-main hover:bg-white cursor-pointer"
                }`}
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-extrabold text-base sm:text-lg text-[var(--accent-green,#9CB800)] tracking-tight select-none">
                {MONTH_NAMES[currentMonthIndex]} {currentYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={isNextMonthDisabled}
                className={`p-1.5 rounded-lg transition-all ${
                  isNextMonthDisabled
                    ? "text-gray-300 cursor-not-allowed opacity-40"
                    : "text-sub hover:text-main hover:bg-white cursor-pointer"
                }`}
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
                  className="py-2.5 rounded-xl text-center text-xs sm:text-sm text-gray-300 font-semibold bg-white/20 select-none opacity-40"
                >
                  {day}
                </div>
              ))}

              {/* Current Month Days */}
              {currentMonthDays.map((day) => {
                const cellDateStr = `${currentYear}-${String(currentMonthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isPast = cellDateStr < todayStr;
                const isBeyondMax = cellDateStr > maxDateStr;
                const isDisabled = isPast || isBeyondMax;
                const isSelected = activeDate === cellDateStr;
                const isCurrentToday = todayStr === cellDateStr;
                const hasSlots = datesWithSlots.has(cellDateStr);

                return (
                  <button
                    key={`curr-${day}`}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleDateClick(day)}
                    className={`relative py-2.5 rounded-xl text-center text-xs sm:text-sm font-bold transition-all select-none border flex flex-col items-center justify-center ${
                      isDisabled
                        ? "cursor-not-allowed opacity-35 bg-gray-50 border-transparent text-gray-400"
                        : isSelected
                        ? "bg-primary border-primary text-white shadow-xs scale-105 z-10 cursor-pointer"
                        : isCurrentToday
                        ? "bg-white border-primary text-primary ring-2 ring-primary/20 cursor-pointer hover:border-primary"
                        : "bg-white border-hairline text-main hover:border-primary hover:text-primary cursor-pointer"
                    }`}
                  >
                    <span>{day}</span>
                    {/* Indicator dot if real appointment slots are available on this date */}
                    {hasSlots && !isDisabled && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                          isSelected ? "bg-white" : "bg-emerald-500"
                        }`}
                        title="Available appointment slots"
                      />
                    )}
                  </button>
                );
              })}

              {/* Next Month Days */}
              {nextMonthDays.map((day, idx) => (
                <div
                  key={`next-${idx}-${day}`}
                  className="py-2.5 rounded-xl text-center text-xs sm:text-sm text-gray-300 font-semibold bg-white/20 select-none opacity-40"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Legend */}
            <div className="flex items-center justify-between pt-2 border-t border-hairline/60 text-[11px] text-sub">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Available inspection slots</span>
              </div>
              <span>Next 90 days only</span>
            </div>
          </div>

          {errors.selectedDate && (
            <p className="text-xs sm:text-sm text-red-500 font-medium mt-1.5">{errors.selectedDate}</p>
          )}
        </div>

        {/* Right Column: Time Slot Picker */}
        <div className="lg:col-span-6 flex flex-col w-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-main">Select an available time</h3>
            {isFetchingSlots && (
              <span className="text-xs text-sub flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" /> Loading slots...
              </span>
            )}
          </div>

          {/* Real-time Slots Header Banner */}
          {hasRealSlots && (
            <div className="mb-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>{availableSlotsOnDate.length}</strong> real-time inspection appointments available on <strong>{activeDate}</strong>.
              </span>
            </div>
          )}

          {/* No Real Slots Warning + Quick Jump to Next Available Date */}
          {!hasRealSlots && !isFetchingSlots && (
            <div className="mb-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/90 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs sm:text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>No live calendar slots for {activeDate}</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Inspectors may be fully booked on this date. You can select an upcoming date below, or choose a preferred standard inspection window.
              </p>
              {nextAvailableDate && nextAvailableDate !== activeDate && (
                <button
                  type="button"
                  onClick={() => {
                    updateFormData({ selectedDate: nextAvailableDate });
                    clearError("selectedDate");
                  }}
                  className="mt-1 self-start px-3 py-1.5 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-hover transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  Jump to next available slots ({nextAvailableDate})
                </button>
              )}
            </div>
          )}

          {/* Time Slots Categories */}
          <div className="flex flex-col gap-4">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Morning
                </span>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {morningSlots.map((slot) => {
                    const isSelected = Boolean(selected24h && selected24h === slot.time);
                    return (
                      <button
                        key={`m-${slot.time}-${slot.inspectorId || "id"}`}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all border cursor-pointer select-none ${
                          isSelected
                            ? "bg-primary-subtle border-primary text-primary shadow-2xs ring-1 ring-primary/40"
                            : "bg-white border-hairline text-main hover:bg-canvas hover:border-primary/40"
                        }`}
                      >
                        {format24hToDisplayTime(slot.time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Afternoon
                </span>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {afternoonSlots.map((slot) => {
                    const isSelected = Boolean(selected24h && selected24h === slot.time);
                    return (
                      <button
                        key={`a-${slot.time}-${slot.inspectorId || "id"}`}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all border cursor-pointer select-none ${
                          isSelected
                            ? "bg-primary-subtle border-primary text-primary shadow-2xs ring-1 ring-primary/40"
                            : "bg-white border-hairline text-main hover:bg-canvas hover:border-primary/40"
                        }`}
                      >
                        {format24hToDisplayTime(slot.time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted uppercase tracking-wider">
                  Evening
                </span>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                  {eveningSlots.map((slot) => {
                    const isSelected = Boolean(selected24h && selected24h === slot.time);
                    return (
                      <button
                        key={`e-${slot.time}-${slot.inspectorId || "id"}`}
                        type="button"
                        onClick={() => handleSelectSlot(slot)}
                        className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-bold text-center transition-all border cursor-pointer select-none ${
                          isSelected
                            ? "bg-primary-subtle border-primary text-primary shadow-2xs ring-1 ring-primary/40"
                            : "bg-white border-hairline text-main hover:bg-canvas hover:border-primary/40"
                        }`}
                      >
                        {format24hToDisplayTime(slot.time)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Inspector Display */}
          {formData.inspectorName && (
            <div className="mt-4 p-3 rounded-xl bg-canvas border border-hairline text-xs text-sub flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>
                  Assigned Inspector:{" "}
                  <strong className="text-main font-semibold">
                    {formData.inspectorName}
                  </strong>
                </span>
              </div>
              {formData.durationMinutes && (
                <span className="text-[11px] text-muted">
                  Duration: {formData.durationMinutes} mins
                </span>
              )}
            </div>
          )}

          {errors.selectedTimeSlot && (
            <p className="text-xs sm:text-sm text-red-500 font-medium mt-1.5">{errors.selectedTimeSlot}</p>
          )}
        </div>
      </div>
    </div>
  );
};
