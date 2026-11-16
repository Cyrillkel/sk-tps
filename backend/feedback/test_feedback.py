from http.client import HTTPConnection
from http.server import ThreadingHTTPServer
import io
import json
import threading
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

import delivery
from delivery import DeliveryError, check, make_transport, smtp_message
from request import InvalidRequest, Letter, compose_letter, parse_request
from server import make_handler


VALID = {
    "name": "Иван Петров",
    "phone": "+7 (900) 123-45-67",
    "email": "ivan@example.ru",
    "message": "Нужен монтаж\r\nнаружной канализации",
    "page": "/seti/",
    "consent": True,
}
LETTER = Letter("Заявка с сайта — Иван", "Имя: Иван\n", "ivan@example.ru")
RESEND_ENV = {"RESEND_API_KEY": "re_test", "FEEDBACK_FROM": "noreply@sk-tps.ru", "FEEDBACK_TO": "info@sk-tps.ru, boss@example.ru"}


class ParseRequestTests(unittest.TestCase):
    def test_valid_request(self) -> None:
        request = parse_request(VALID)
        self.assertEqual(request.name, "Иван Петров")
        self.assertEqual(request.message, "Нужен монтаж\nнаружной канализации")
        self.assertEqual(request.page, "/seti/")

    def test_optional_fields_may_be_missing(self) -> None:
        request = parse_request({"name": "Иван", "phone": "89001234567", "consent": True})
        self.assertEqual((request.email, request.message, request.page), ("", "", ""))

    def test_header_line_breaks_are_collapsed(self) -> None:
        request = parse_request({**VALID, "name": "Иван\r\nBcc: spam@example.com"})
        self.assertEqual(request.name, "Иван Bcc: spam@example.com")

    def test_unexpected_page_is_dropped(self) -> None:
        self.assertEqual(parse_request({**VALID, "page": "https://evil.example/"}).page, "")

    def test_invalid_requests(self) -> None:
        cases = [
            [],
            {**VALID, "consent": False},
            {**VALID, "name": "   "},
            {**VALID, "phone": "12345"},
            {**VALID, "email": "not-an-email"},
            {**VALID, "name": 42},
            {**VALID, "message": "x" * 2001},
        ]
        for data in cases:
            with self.subTest(data=data), self.assertRaises(InvalidRequest):
                parse_request(data)


class ComposeLetterTests(unittest.TestCase):
    def test_letter_contents(self) -> None:
        letter = compose_letter(parse_request(VALID))
        self.assertEqual(letter.subject, "Заявка с сайта — Иван Петров")
        self.assertEqual(letter.reply_to, "ivan@example.ru")
        self.assertIn("Телефон: +7 (900) 123-45-67", letter.text)
        self.assertIn("Страница: /seti/", letter.text)
        self.assertIn("Вопрос:\nНужен монтаж\nнаружной канализации", letter.text)

    def test_smtp_message_headers(self) -> None:
        message = smtp_message(LETTER, "info@sk-tps.ru", ["info@sk-tps.ru", "boss@example.ru"])
        self.assertEqual(message["Reply-To"], "ivan@example.ru")
        self.assertEqual(message["To"], "info@sk-tps.ru, boss@example.ru")
        no_reply = smtp_message(Letter("Тема", "Текст\n", ""), "info@sk-tps.ru", ["info@sk-tps.ru"])
        self.assertIsNone(no_reply["Reply-To"])


class FakeResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *args) -> None:
        self.close()


def http_error(status: int, body: dict) -> HTTPError:
    return HTTPError("https://api.resend.com", status, "error", {}, io.BytesIO(json.dumps(body).encode()))


class ResendTests(unittest.TestCase):
    def test_letter_is_posted_to_resend(self) -> None:
        with patch.object(delivery, "urlopen", return_value=FakeResponse(b'{"id": "1"}')) as urlopen:
            make_transport(RESEND_ENV)(LETTER)
        request = urlopen.call_args.args[0]
        self.assertEqual(request.full_url, "https://api.resend.com/emails")
        self.assertEqual(request.get_header("Authorization"), "Bearer re_test")
        self.assertEqual(request.get_header("User-agent"), delivery.USER_AGENT)
        payload = json.loads(request.data)
        self.assertEqual(payload["from"], "Сайт СК «ТПС» <noreply@sk-tps.ru>")
        self.assertEqual(payload["to"], ["info@sk-tps.ru", "boss@example.ru"])
        self.assertEqual(payload["reply_to"], "ivan@example.ru")

    def test_resend_error_becomes_delivery_error(self) -> None:
        error = http_error(403, {"name": "validation_error", "message": "domain is not verified"})
        with patch.object(delivery, "urlopen", side_effect=error), self.assertRaisesRegex(DeliveryError, "not verified"):
            make_transport(RESEND_ENV)(LETTER)

    def test_check_reports_domain_status(self) -> None:
        verified = b'{"data": [{"name": "sk-tps.ru", "status": "verified"}]}'
        with patch.object(delivery, "urlopen", return_value=FakeResponse(verified)):
            self.assertIn("verified", check(RESEND_ENV))
        pending = b'{"data": [{"name": "sk-tps.ru", "status": "pending"}]}'
        with patch.object(delivery, "urlopen", return_value=FakeResponse(pending)), self.assertRaises(DeliveryError):
            check(RESEND_ENV)

    def test_check_accepts_sending_only_key(self) -> None:
        error = http_error(401, {"name": "restricted_api_key", "message": "This API key is restricted"})
        with patch.object(delivery, "urlopen", side_effect=error):
            self.assertIn("sending only", check(RESEND_ENV))

    def test_recipients_are_required(self) -> None:
        with self.assertRaises(DeliveryError):
            make_transport({**RESEND_ENV, "FEEDBACK_TO": " , "})


class HandlerTests(unittest.TestCase):
    def setUp(self) -> None:
        self.sent = []
        self.failure = None

        def send(letter: Letter) -> None:
            if self.failure:
                raise self.failure
            self.sent.append(letter)

        self.server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(send))
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.addCleanup(self.server.server_close)
        self.addCleanup(self.server.shutdown)

    def post(self, body: bytes, content_type: str = "application/json", path: str = "/api/feedback"):
        connection = HTTPConnection(*self.server.server_address, timeout=5)
        self.addCleanup(connection.close)
        connection.request("POST", path, body, {"Content-Type": content_type})
        response = connection.getresponse()
        return response.status, json.loads(response.read())

    def test_valid_request_is_sent(self) -> None:
        self.assertEqual(self.post(json.dumps(VALID).encode()), (200, {"ok": True}))
        self.assertEqual(self.sent[0].subject, "Заявка с сайта — Иван Петров")

    def test_honeypot_is_accepted_but_not_sent(self) -> None:
        status, _ = self.post(json.dumps({**VALID, "website": "http://spam"}).encode())
        self.assertEqual(status, 200)
        self.assertEqual(self.sent, [])

    def test_invalid_json_is_rejected(self) -> None:
        self.assertEqual(self.post(b"{")[0], 400)
        self.assertEqual(self.post(json.dumps({**VALID, "phone": ""}).encode())[0], 400)
        self.assertEqual(self.sent, [])

    def test_wrong_content_type_and_path(self) -> None:
        self.assertEqual(self.post(b"name=x", "application/x-www-form-urlencoded")[0], 415)
        self.assertEqual(self.post(json.dumps(VALID).encode(), path="/api/other")[0], 404)

    def test_oversized_body_is_rejected(self) -> None:
        self.assertEqual(self.post(b" " * (16 * 1024 + 1))[0], 413)

    def test_delivery_failure_is_reported(self) -> None:
        self.failure = DeliveryError("Resend 403")
        status, payload = self.post(json.dumps(VALID).encode())
        self.assertEqual((status, payload["error"]), (502, "delivery_failed"))


if __name__ == "__main__":
    unittest.main()
