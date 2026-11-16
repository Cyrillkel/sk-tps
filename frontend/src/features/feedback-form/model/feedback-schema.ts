import * as z from "zod/mini";

import { isCompletePhone } from "../lib/phone-mask";

// Same rules as backend/feedback/request.py, so the server accepts everything the form lets through.
// The phone is stricter: the +7 mask needs all ten digits after the country code.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const feedbackSchema = z.object({
  name: z.string().check(
    z.trim(),
    z.minLength(1, "Укажите, как к вам обращаться"),
    z.maxLength(100, "Не длиннее 100 символов"),
  ),
  phone: z.string().check(
    z.trim(),
    z.refine(isCompletePhone, "Укажите номер телефона полностью"),
    z.maxLength(20, "Не длиннее 20 символов"),
  ),
  email: z.string().check(
    z.trim(),
    z.maxLength(120, "Не длиннее 120 символов"),
    z.refine((value) => !value || EMAIL_PATTERN.test(value), "Проверьте адрес почты"),
  ),
  message: z.string().check(z.trim(), z.maxLength(2000, "Не длиннее 2000 символов")),
  consent: z.literal(true, "Нужно согласие на обработку персональных данных"),
});

export type FeedbackFields = z.infer<typeof feedbackSchema>;
export type FeedbackField = keyof FeedbackFields;
export type FeedbackErrors = Partial<Record<FeedbackField, string>>;

export function validateFeedback(
  input: Record<FeedbackField, unknown>,
): { success: true; data: FeedbackFields } | { success: false; errors: FeedbackErrors } {
  const result = feedbackSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };

  const errors: FeedbackErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as FeedbackField;
    errors[field] ??= issue.message;
  }
  return { success: false, errors };
}
