"""Letter delivery: Resend HTTP API when RESEND_API_KEY is set, otherwise SMTP."""

from email.message import EmailMessage
from email.utils import formataddr, formatdate, make_msgid
import json
import smtplib
import ssl
from typing import Any, Callable
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from request import Letter


RESEND_API = "https://api.resend.com"
SENDER_NAME = "Сайт СК «ТПС»"
# Resend is behind Cloudflare, which rejects the default Python-urllib agent.
USER_AGENT = "sk-tps-feedback/1.0"


class DeliveryError(Exception):
    pass


def recipients(environ: dict[str, str]) -> list[str]:
    addresses = [address.strip() for address in environ.get("FEEDBACK_TO", "").split(",") if address.strip()]
    if not addresses:
        raise DeliveryError("FEEDBACK_TO is empty")
    return addresses


def smtp_message(letter: Letter, sender: str, to: list[str]) -> EmailMessage:
    message = EmailMessage()
    message["Subject"] = letter.subject
    message["From"] = formataddr((SENDER_NAME, sender))
    message["To"] = ", ".join(to)
    message["Date"] = formatdate(localtime=True)
    message["Message-ID"] = make_msgid(domain=sender.rpartition("@")[2])
    if letter.reply_to:
        message["Reply-To"] = letter.reply_to
    message.set_content(letter.text)
    return message


def smtp_connect(environ: dict[str, str]) -> smtplib.SMTP:
    host = environ["SMTP_HOST"]
    port = int(environ.get("SMTP_PORT", "465"))
    context = ssl.create_default_context()
    if port == 465:
        client = smtplib.SMTP_SSL(host, port, context=context, timeout=20)
    else:
        client = smtplib.SMTP(host, port, timeout=20)
    try:
        if port != 465:
            client.starttls(context=context)
        client.login(environ["SMTP_USER"], environ["SMTP_PASSWORD"])
    except BaseException:
        client.close()
        raise
    return client


def resend_call(environ: dict[str, str], method: str, path: str, payload: Any = None) -> Any:
    request = Request(
        RESEND_API + path,
        data=None if payload is None else json.dumps(payload).encode(),
        method=method,
        headers={
            "Authorization": f"Bearer {environ['RESEND_API_KEY']}",
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    try:
        with urlopen(request, timeout=20) as response:
            return json.load(response)
    except HTTPError as error:
        raise DeliveryError(f"Resend {error.code}: {error.read().decode(errors='replace')[:300]}") from error
    except OSError as error:
        raise DeliveryError(f"Resend is unavailable: {error}") from error


def make_transport(environ: dict[str, str]) -> Callable[[Letter], None]:
    to = recipients(environ)

    if environ.get("RESEND_API_KEY"):
        sender = f"{SENDER_NAME} <{environ['FEEDBACK_FROM']}>"

        def send_resend(letter: Letter) -> None:
            payload = {"from": sender, "to": to, "subject": letter.subject, "text": letter.text}
            if letter.reply_to:
                payload["reply_to"] = letter.reply_to
            resend_call(environ, "POST", "/emails", payload)

        return send_resend

    # Yandex and most providers only accept mail from the authenticated mailbox.
    sender = environ.get("FEEDBACK_FROM") or environ["SMTP_USER"]

    def send_smtp(letter: Letter) -> None:
        try:
            with smtp_connect(environ) as client:
                client.send_message(smtp_message(letter, sender, to))
        except (OSError, smtplib.SMTPException) as error:
            raise DeliveryError(f"SMTP: {error}") from error

    return send_smtp


def check(environ: dict[str, str]) -> str:
    """Verifies the configuration without sending mail."""
    recipients(environ)

    if environ.get("RESEND_API_KEY"):
        domain = environ["FEEDBACK_FROM"].rpartition("@")[2]
        try:
            domains = resend_call(environ, "GET", "/domains")["data"]
        except DeliveryError as error:
            # A sending-only key is the recommended one; it cannot list domains.
            if str(error).startswith("Resend 401") and "restricted" in str(error).lower():
                return "Resend key accepted (sending only); domain status is checked on the first letter"
            raise
        status = next((item["status"] for item in domains if item["name"] == domain), "not added")
        if status != "verified":
            raise DeliveryError(f"Resend domain {domain} is {status}")
        return f"Resend domain {domain} is verified"

    try:
        with smtp_connect(environ):
            return f"SMTP login succeeded for {environ['SMTP_USER']}"
    except (OSError, smtplib.SMTPException) as error:
        raise DeliveryError(f"SMTP: {error}") from error
