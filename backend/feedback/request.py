"""Feedback request rules: validation and the letter sent to the company."""

from dataclasses import dataclass
import re
from typing import Any


EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")
PHONE_DIGITS_MIN = 10
LIMITS = {"name": 100, "phone": 20, "email": 120, "message": 2000, "page": 300}
# Hidden field that people never see; bots fill it.
HONEYPOT_FIELD = "website"


class InvalidRequest(ValueError):
    pass


@dataclass(frozen=True)
class FeedbackRequest:
    name: str
    phone: str
    email: str
    message: str
    page: str


@dataclass(frozen=True)
class Letter:
    subject: str
    text: str
    reply_to: str


def _single_line(value: str) -> str:
    return " ".join(value.split())


def _text(data: dict[str, Any], field: str) -> str:
    value = data.get(field, "")
    if not isinstance(value, str):
        raise InvalidRequest(f"Invalid {field}")
    value = value.strip()
    if len(value) > LIMITS[field]:
        raise InvalidRequest(f"{field} is too long")
    return value


def is_spam(data: dict[str, Any]) -> bool:
    return bool(data.get(HONEYPOT_FIELD))


def parse_request(data: Any) -> FeedbackRequest:
    if not isinstance(data, dict):
        raise InvalidRequest("Expected a JSON object")
    if data.get("consent") is not True:
        raise InvalidRequest("Consent is required")

    name = _single_line(_text(data, "name"))
    phone = _single_line(_text(data, "phone"))
    email = _text(data, "email")
    message = _text(data, "message").replace("\r\n", "\n")
    page = _text(data, "page")

    if not name:
        raise InvalidRequest("Name is required")
    if len(re.sub(r"\D", "", phone)) < PHONE_DIGITS_MIN:
        raise InvalidRequest("Phone is incomplete")
    if email and not EMAIL_PATTERN.fullmatch(email):
        raise InvalidRequest("Invalid email")
    if page and not re.fullmatch(r"/[\w\-./%]*", page):
        page = ""

    return FeedbackRequest(name, phone, email, message, page)


def compose_letter(request: FeedbackRequest) -> Letter:
    lines = [f"Имя: {request.name}", f"Телефон: {request.phone}"]
    if request.email:
        lines.append(f"Email: {request.email}")
    if request.page:
        lines.append(f"Страница: {request.page}")
    if request.message:
        lines += ["", "Вопрос:", request.message]
    return Letter(f"Заявка с сайта — {request.name}", "\n".join(lines) + "\n", request.email)
