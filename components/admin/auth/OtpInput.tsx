"use client";

import React, { useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  isError?: boolean;
  autoFocus?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  isError = false,
  autoFocus = true,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Ensure digits array always matches `length`
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  useEffect(() => {
    if (autoFocus && inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus, disabled]);

  const setDigits = (newDigits: string[]) => {
    const combined = newDigits.join("");
    onChange(combined);
    if (combined.length === length && onComplete) {
      onComplete(combined);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const rawVal = e.target.value;
    const cleanVal = rawVal.replace(/\D/g, "");

    // If user typed/pasted multiple digits into one field
    if (cleanVal.length > 1) {
      handlePastedData(cleanVal, index);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal ? cleanVal[cleanVal.length - 1] : "";
    setDigits(newDigits);

    // If digit entered, advance to next input
    if (cleanVal && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous and clear it
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePastedData = (pastedText: string, startIndex = 0) => {
    const numbersOnly = pastedText.replace(/\D/g, "").slice(0, length);
    if (!numbersOnly) return;

    // If user pastes full code (length matches), always fill from index 0 regardless of focused box
    const start = numbersOnly.length === length ? 0 : startIndex;
    const newDigits = [...digits];
    for (let i = 0; i < numbersOnly.length; i++) {
      const targetIndex = start + i;
      if (targetIndex < length) {
        newDigits[targetIndex] = numbersOnly[i];
      }
    }

    setDigits(newDigits);

    // Focus on the last input if full code, otherwise next empty input
    const nextFocusIndex = Math.min(
      start + numbersOnly.length,
      length - 1,
    );
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    handlePastedData(pasted, index);
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3 w-full">
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] || "";
        const isFilled = Boolean(digit);

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            autoComplete="one-time-code"
            value={digit}
            disabled={disabled}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={(e) => handlePaste(e, index)}
            onFocus={(e) => e.target.select()}
            className={`w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl border transition-all outline-none select-none ${
              isError
                ? "border-red-400 bg-red-50/50 text-red-900 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                : isFilled
                  ? "border-primary bg-primary/5 text-main font-extrabold focus:ring-2 focus:ring-primary/20"
                  : "border-hairline bg-canvas text-main placeholder:text-muted focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          />
        );
      })}
    </div>
  );
}

export default OtpInput;
