"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

import { company } from "@/entities/company";
import { SendIcon } from "@/shared/ui";

import { sendFeedback } from "../model/send-feedback";

const PHONE_DIGITS_MIN = 10;

export function FeedbackForm() {
  const id = useId();
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const phoneInput = form.elements.namedItem("phone") as HTMLInputElement;
    const digits = phoneInput.value.replace(/\D/g, "");
    phoneInput.setCustomValidity(digits.length >= PHONE_DIGITS_MIN ? "" : "Укажите номер телефона полностью");
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    sendFeedback(
      {
        name: String(data.get("name") ?? "").trim(),
        phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
        message: String(data.get("message") ?? "").trim(),
      },
      company.email,
    );
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 sm:gap-5" aria-describedby={sent ? `${id}-status` : undefined}>
      <label className="field">
        <span className="field-label">Контактное лицо <span className="text-accent" aria-hidden="true">*</span></span>
        <input name="name" type="text" autoComplete="name" required maxLength={100} placeholder="Как к вам обращаться" className="field-input" />
      </label>

      <label className="field">
        <span className="field-label">Телефон <span className="text-accent" aria-hidden="true">*</span></span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          maxLength={20}
          placeholder="+7 (___) ___-__-__"
          className="field-input"
          onInput={(event) => event.currentTarget.setCustomValidity("")}
        />
      </label>

      <label className="field sm:col-span-2">
        <span className="field-label">Email <span className="font-normal text-muted">— необязательно</span></span>
        <input name="email" type="email" autoComplete="email" maxLength={120} placeholder="name@company.ru" className="field-input" />
      </label>

      <label className="field sm:col-span-2">
        <span className="field-label">Ваш вопрос</span>
        <textarea name="message" rows={4} maxLength={2000} placeholder="Опишите объект и задачу" className="field-input field-textarea" />
      </label>

      <label className="field-consent sm:col-span-2">
        <input name="consent" type="checkbox" required className="field-checkbox" />
        <span>
          Я согласен с{" "}
          <Link href={company.privacyPolicyUrl} target="_blank" className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
            политикой обработки персональных данных
          </Link>
        </span>
      </label>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="button-brand min-h-12 gap-6 px-7 text-sm sm:min-h-14">
          Отправить
          <SendIcon className="size-5" />
        </button>
        {sent && (
          <p id={`${id}-status`} role="status" className="max-w-sm text-xs leading-relaxed text-muted">
            Письмо с заявкой открыто в почтовой программе — отправьте его. Если почта не открылась, позвоните нам: {company.phone}.
          </p>
        )}
      </div>
    </form>
  );
}
