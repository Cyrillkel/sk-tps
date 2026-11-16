#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 || "$#" -ne 0 ]]; then
  echo "Usage (as root): bash enable-https.sh" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
nginx_site="/etc/nginx/sites-available/sk-tps-demo.conf"
webroot="/var/www/letsencrypt"
certificate="/etc/letsencrypt/live/sk-tps.ru/fullchain.pem"

test -f "$script_dir/nginx.conf"
test -f "$nginx_site"

DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends certbot
install -d -o root -g root -m 0755 "$webroot"

if [[ ! -f "$certificate" ]]; then
  # nginx.conf needs the certificate, so the first challenge is served by the current HTTP-only site.
  cp -p "$nginx_site" "$nginx_site.bak"
  sed -i "0,/server_tokens off;/s##&\n    location ^~ /.well-known/acme-challenge/ { root $webroot; try_files \$uri =404; }#" "$nginx_site"
  if ! nginx -t; then
    mv "$nginx_site.bak" "$nginx_site"
    exit 1
  fi
  systemctl reload nginx
  certbot certonly --non-interactive --agree-tos --register-unsafely-without-email \
    --webroot --webroot-path "$webroot" --domain sk-tps.ru --domain www.sk-tps.ru \
    --deploy-hook "systemctl reload nginx"
fi

cp -p "$nginx_site" "$nginx_site.bak"
install -o root -g root -m 0644 "$script_dir/nginx.conf" "$nginx_site"
if ! nginx -t; then
  mv "$nginx_site.bak" "$nginx_site"
  echo "Nginx configuration test failed; the previous configuration is restored." >&2
  exit 1
fi
systemctl reload nginx

systemctl enable --now certbot.timer
certbot renew --dry-run --no-random-sleep-on-renew
echo "HTTPS is enabled for sk-tps.ru."
