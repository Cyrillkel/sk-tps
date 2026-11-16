import type { FeedbackFields } from "./feedback-schema";

export type FeedbackRequest = FeedbackFields & {
  page: string;
  /** Скрытое поле-ловушка: человек его не видит, боты заполняют. */
  website: string;
};

/** Сервис отправки работает на VPS за Nginx (`backend/feedback`). */
const FEEDBACK_ENDPOINT = "/api/feedback";

export async function sendFeedback(request: FeedbackRequest): Promise<boolean> {
  try {
    const response = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    return response.ok;
  } catch {
    return false;
  }
}
