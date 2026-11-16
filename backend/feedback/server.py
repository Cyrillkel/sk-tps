#!/usr/bin/python3
"""HTTP endpoint behind Nginx: POST /api/feedback delivers the request by email."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import logging
import os
import sys
from typing import Callable

from delivery import DeliveryError, check, make_transport
from request import InvalidRequest, Letter, compose_letter, is_spam, parse_request


MAX_BODY_BYTES = 16 * 1024


def make_handler(send: Callable[[Letter], None]) -> type[BaseHTTPRequestHandler]:
    class FeedbackHandler(BaseHTTPRequestHandler):
        server_version = "sk-tps-feedback"
        sys_version = ""

        def do_POST(self) -> None:
            if self.path != "/api/feedback":
                return self.reply(404, {"ok": False, "error": "not_found"})
            if self.headers.get_content_type() != "application/json":
                return self.reply(415, {"ok": False, "error": "unsupported_media_type"})
            try:
                length = int(self.headers.get("Content-Length", ""))
            except ValueError:
                return self.reply(411, {"ok": False, "error": "length_required"})
            if not 0 < length <= MAX_BODY_BYTES:
                return self.reply(413, {"ok": False, "error": "too_large"})

            try:
                data = json.loads(self.rfile.read(length))
                if isinstance(data, dict) and is_spam(data):
                    logging.info("Feedback dropped by honeypot")
                    return self.reply(200, {"ok": True})
                request = parse_request(data)
            except (UnicodeDecodeError, json.JSONDecodeError, InvalidRequest) as error:
                logging.info("Feedback rejected: %s", error)
                return self.reply(400, {"ok": False, "error": "invalid_request"})

            try:
                send(compose_letter(request))
            except DeliveryError as error:
                logging.error("Feedback delivery failed: %s", error)
                return self.reply(502, {"ok": False, "error": "delivery_failed"})

            logging.info("Feedback delivered")
            self.reply(200, {"ok": True})

        def do_GET(self) -> None:
            self.reply(405, {"ok": False, "error": "method_not_allowed"})

        def reply(self, status: int, payload: dict) -> None:
            body = json.dumps(payload).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, format: str, *args) -> None:
            # Request lines are already in the Nginx access log; keep personal data out of journald.
            pass

    return FeedbackHandler


def main() -> None:
    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")
    environ = dict(os.environ)
    if sys.argv[1:] == ["--check"]:
        # Used by deploy/install-feedback.sh; nothing is sent.
        try:
            logging.info(check(environ))
        except (DeliveryError, KeyError) as error:
            logging.error("Check failed: %s", error)
            sys.exit(1)
        return

    port = int(environ.get("FEEDBACK_PORT", "8081"))
    server = ThreadingHTTPServer(("127.0.0.1", port), make_handler(make_transport(environ)))
    logging.info("Listening on 127.0.0.1:%d", port)
    server.serve_forever()


if __name__ == "__main__":
    main()
