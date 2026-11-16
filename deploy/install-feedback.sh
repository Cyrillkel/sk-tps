#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 || "$#" -ne 1 ]]; then
  echo "Usage (as root): bash install-feedback.sh /path/to/feedback.env" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
backend_dir="$script_dir/../backend/feedback"
env_source="$1"
nginx_site="/etc/nginx/sites-available/sk-tps-demo.conf"

for name in server.py request.py delivery.py; do
  test -f "$backend_dir/$name"
done
test -f "$script_dir/sk-tps-feedback.service"
test -f "$script_dir/nginx.conf"
has() { grep -q "^$1=." "$env_source"; }
# Resend (RESEND_API_KEY, FEEDBACK_FROM) or SMTP (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).
if ! has FEEDBACK_TO || ! { { has RESEND_API_KEY && has FEEDBACK_FROM; } || { has SMTP_HOST && has SMTP_USER && has SMTP_PASSWORD; }; }; then
  echo "$env_source needs FEEDBACK_TO and either RESEND_API_KEY with FEEDBACK_FROM or SMTP_* settings" >&2
  exit 1
fi
python3 -c 'import sys; assert sys.version_info >= (3, 9), "Python 3.9+ is required"'

install -d -o root -g root -m 0755 /opt/sk-tps-feedback
install -o root -g root -m 0644 "$backend_dir/request.py" "$backend_dir/delivery.py" "$backend_dir/server.py" /opt/sk-tps-feedback/
install -d -o root -g root -m 0700 /etc/sk-tps
install -o root -g root -m 0600 "$env_source" /etc/sk-tps/feedback.env
install -o root -g root -m 0644 "$script_dir/sk-tps-feedback.service" /etc/systemd/system/sk-tps-feedback.service

# Same environment and sandbox as the service; checks the credentials without sending mail.
systemd-run --quiet --wait --pipe --collect \
  -p EnvironmentFile=/etc/sk-tps/feedback.env -p DynamicUser=yes \
  /usr/bin/python3 -B /opt/sk-tps-feedback/server.py --check

systemctl daemon-reload
systemctl enable sk-tps-feedback
systemctl restart sk-tps-feedback

cp -p "$nginx_site" "$nginx_site.bak"
install -o root -g root -m 0644 "$script_dir/nginx.conf" "$nginx_site"
if ! nginx -t; then
  mv "$nginx_site.bak" "$nginx_site"
  echo "Nginx configuration test failed; the previous configuration is restored." >&2
  exit 1
fi
systemctl reload nginx

sleep 1
status="$(curl --silent --output /dev/null --write-out '%{http_code}' \
  --header 'Content-Type: application/json' --data '{}' http://127.0.0.1:8081/api/feedback)"
if [[ "$status" != "400" ]]; then
  echo "Unexpected response from /api/feedback: $status" >&2
  exit 1
fi
echo "Feedback service is running. Send a test request from the site form."
