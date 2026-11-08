export type FeedbackRequest = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

/**
 * Временная отправка без backend: открывает почтовую программу с готовым письмом.
 * При появлении серверной обработки заменить эту функцию на запрос к API.
 */
export function sendFeedback(request: FeedbackRequest, recipient: string) {
  const body = [
    `Имя: ${request.name}`,
    `Телефон: ${request.phone}`,
    request.email && `Email: ${request.email}`,
    request.message && `\nВопрос:\n${request.message}`,
  ].filter(Boolean).join("\n");

  const subject = `Заявка с сайта — ${request.name}`;
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
