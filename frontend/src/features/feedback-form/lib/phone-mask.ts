import type { FocusEvent, FormEvent, KeyboardEvent } from "react";

const PREFIX = "+7 ";
const NATIONAL_DIGITS = 10;

/** Digits after the country code: "+7 (900) 1" → "9001", pasted "8 900 123-45-67" → "9001234567". */
function nationalDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (value.trimStart().startsWith("+7")) return digits.slice(1, NATIONAL_DIGITS + 1);
  if (digits.length === NATIONAL_DIGITS + 1 && /^[78]/.test(digits)) return digits.slice(1);
  return digits.slice(0, NATIONAL_DIGITS);
}

export function isCompletePhone(value: string): boolean {
  return nationalDigits(value).length === NATIONAL_DIGITS;
}

/** Formats as "+7 (900) 123-45-67", adding separators only up to the typed digits. */
export function formatPhone(value: string): string {
  const digits = nationalDigits(value);
  let result = PREFIX;
  if (digits.length > 0) result += `(${digits.slice(0, 3)}`;
  if (digits.length > 3) result += `) ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

function caretAfterDigits(formatted: string, count: number): number {
  let seen = 0;
  for (let index = PREFIX.length; index < formatted.length; index++) {
    if (/\d/.test(formatted.charAt(index)) && ++seen === count) return index + 1;
  }
  return count === 0 ? PREFIX.length : formatted.length;
}

export function handlePhoneFocus(event: FocusEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  if (input.value) return;
  input.value = PREFIX;
  // Browsers place the caret after focus handling, so move it past the prefix on the next frame.
  requestAnimationFrame(() => input.setSelectionRange(PREFIX.length, PREFIX.length));
}

export function handlePhoneInput(event: FormEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  const caret = input.selectionStart ?? input.value.length;
  const atEnd = caret === input.value.length;
  const digitsBeforeCaret = nationalDigits(input.value.slice(0, caret)).length;
  input.value = formatPhone(input.value);
  const position = atEnd ? input.value.length : caretAfterDigits(input.value, digitsBeforeCaret);
  input.setSelectionRange(position, position);
}

export function handlePhoneKeyDown(event: KeyboardEvent<HTMLInputElement>) {
  if (event.key !== "Backspace") return;
  const input = event.currentTarget;
  const { selectionStart: start, selectionEnd: end } = input;
  if (start === null || start !== end) return;
  if (start <= PREFIX.length) {
    event.preventDefault();
    return;
  }
  // Step over ") " and "-" so Backspace removes the digit before them, not the separator.
  let position = start;
  while (position > PREFIX.length && !/\d/.test(input.value.charAt(position - 1))) position--;
  if (position <= PREFIX.length) {
    event.preventDefault();
    return;
  }
  input.setSelectionRange(position, position);
}

export function handlePhoneBlur(event: FocusEvent<HTMLInputElement>) {
  const input = event.currentTarget;
  input.value = nationalDigits(input.value) ? formatPhone(input.value) : "";
}
