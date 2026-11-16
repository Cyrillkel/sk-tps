"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";

import { company } from "@/entities/company";
import { CheckCircleIcon, CloseIcon, SendIcon } from "@/shared/ui";

import { handlePhoneBlur, handlePhoneFocus, handlePhoneInput, handlePhoneKeyDown } from "../lib/phone-mask";
import { validateFeedback, type FeedbackErrors, type FeedbackField } from "../model/feedback-schema";
import { sendFeedback } from "../model/send-feedback";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD_ORDER: FeedbackField[] = ["name", "phone", "email", "message", "consent"];

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="text-xs leading-snug text-danger">{message}</p> : null;
}

export function FeedbackForm() {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FeedbackErrors>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogButtonRef = useRef<HTMLButtonElement>(null);
  // The button is disabled while sending and loses focus, so the dialog cannot restore it by itself.
  const submitRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);

    const validation = validateFeedback({
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email"),
      message: data.get("message"),
      consent: data.get("consent") === "on",
    });
    if (!validation.success) {
      setErrors(validation.errors);
      const firstInvalid = FIELD_ORDER.find((field) => validation.errors[field]);
      if (firstInvalid) (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    const delivered = await sendFeedback({
      ...validation.data,
      page: window.location.pathname,
      website: String(data.get("website") ?? ""),
    });
    setStatus(delivered ? "sent" : "error");
    if (delivered) {
      form.reset();
      dialogRef.current?.showModal();
      dialogButtonRef.current?.focus();
    }
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function clearError(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement).name as FeedbackField;
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function describedBy(field: FeedbackField) {
    return errors[field] ? { "aria-invalid": true, "aria-describedby": `${id}-${field}-error` } : {};
  }

  const errorMessage = status === "error"
    ? `Не удалось отправить заявку. Позвоните нам: ${company.phone} или напишите на ${company.email}.`
    : null;

  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        onChange={clearError}
        className="grid gap-4 sm:grid-cols-2 sm:gap-5"
        aria-describedby={errorMessage ? `${id}-status` : undefined}
      >
        <div className="field">
          <label htmlFor={`${id}-name`} className="field-label">Контактное лицо <span className="text-accent" aria-hidden="true">*</span></label>
          <input id={`${id}-name`} name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Как к вам обращаться" className="field-input" {...describedBy("name")} />
          <FieldError id={`${id}-name-error`} message={errors.name} />
        </div>

        <div className="field">
          <label htmlFor={`${id}-phone`} className="field-label">Телефон <span className="text-accent" aria-hidden="true">*</span></label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            maxLength={20}
            placeholder="+7 (___) ___-__-__"
            className="field-input"
            onFocus={handlePhoneFocus}
            onInput={handlePhoneInput}
            onKeyDown={handlePhoneKeyDown}
            onBlur={handlePhoneBlur}
            {...describedBy("phone")}
          />
          <FieldError id={`${id}-phone-error`} message={errors.phone} />
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-email`} className="field-label">Email <span className="font-normal text-muted">— необязательно</span></label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={120} placeholder="name@company.ru" className="field-input" {...describedBy("email")} />
          <FieldError id={`${id}-email-error`} message={errors.email} />
        </div>

        <div className="field sm:col-span-2">
          <label htmlFor={`${id}-message`} className="field-label">Ваш вопрос</label>
          <textarea id={`${id}-message`} name="message" rows={4} maxLength={2000} placeholder="Опишите объект и задачу" className="field-input field-textarea" {...describedBy("message")} />
          <FieldError id={`${id}-message-error`} message={errors.message} />
        </div>

        <div className="sr-only" aria-hidden="true">
          <label>
            Сайт
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <label className="field-consent">
            <input name="consent" type="checkbox" required className="field-checkbox" {...describedBy("consent")} />
            <span>
              Я согласен с{" "}
              <Link href={company.privacyPolicyUrl} target="_blank" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
                политикой обработки персональных данных
              </Link>
            </span>
          </label>
          <FieldError id={`${id}-consent-error`} message={errors.consent} />
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button ref={submitRef} type="submit" disabled={status === "sending"} className="button-brand min-h-12 gap-6 px-7 text-sm disabled:cursor-wait disabled:opacity-70 sm:min-h-14">
            {status === "sending" ? "Отправляем…" : "Отправить"}
            <SendIcon className="size-5" />
          </button>
          <p id={`${id}-status`} role="status" className="max-w-sm text-xs leading-relaxed text-danger">
            {errorMessage}
          </p>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${id}-sent-title`}
        aria-describedby={`${id}-sent-text`}
        className="feedback-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onClose={() => {
          setStatus("idle");
          submitRef.current?.focus();
        }}
      >
        <div className="relative flex flex-col items-center px-6 pt-10 pb-7 text-center sm:px-10">
          <span className="feedback-dialog-icon"><CheckCircleIcon className="size-9" /></span>
          <h2 id={`${id}-sent-title`} className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-primary">Заявка отправлена</h2>
          <p id={`${id}-sent-text`} className="mt-3 text-sm leading-relaxed text-muted">
            Спасибо! Мы свяжемся с вами в ближайшее рабочее время. Если вопрос срочный, позвоните:{" "}
            <a href={company.phoneHref} className="font-semibold whitespace-nowrap text-accent hover:text-accent-hover">{company.phone}</a>
          </p>
          <button ref={dialogButtonRef} type="button" onClick={closeDialog} className="button-brand mt-7 min-h-12 w-full px-7 text-sm sm:w-auto sm:min-w-44">
            Хорошо
          </button>
          <button type="button" onClick={closeDialog} aria-label="Закрыть" className="feedback-dialog-close">
            <CloseIcon className="size-5" />
          </button>
        </div>
      </dialog>
    </>
  );
}
