#!/usr/bin/env bash
set -euo pipefail

if [[ "$EUID" -ne 0 || "$#" -ne 1 ]]; then
  echo "Usage (as root): bash bootstrap.sh /path/to/ci_ed25519.pub" >&2
  exit 1
fi

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
public_key_file="$1"
deploy_user="deploy-sk-tps"
deploy_home="/var/lib/sk-tps-deploy"

test -f "$script_dir/receive.py"
test -f "$script_dir/nginx.conf"
ssh-keygen -lf "$public_key_file" > /dev/null
read -r key_type key_data _ < "$public_key_file"
if [[ "$key_type" != "ssh-ed25519" || ! "$key_data" =~ ^[A-Za-z0-9+/=]+$ ]]; then
  echo "An ED25519 public key is required." >&2
  exit 1
fi

if id "$deploy_user" > /dev/null 2>&1; then
  existing_home="$(getent passwd "$deploy_user" | cut -d: -f6)"
  if [[ "$existing_home" != "$deploy_home" ]]; then
    echo "Existing deployment user has an unexpected home directory." >&2
    exit 1
  fi
fi

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install --yes --no-install-recommends nginx

if ! id "$deploy_user" > /dev/null 2>&1; then
  useradd --system --user-group --create-home --home-dir "$deploy_home" --shell /bin/bash "$deploy_user"
fi

install -d -o root -g root -m 0755 "$deploy_home" "$deploy_home/.ssh"
printf 'restrict,command="/usr/local/bin/sk-tps-deploy" %s %s\n' "$key_type" "$key_data" \
  > "$deploy_home/.ssh/authorized_keys"
chown root:root "$deploy_home/.ssh/authorized_keys"
chmod 0644 "$deploy_home/.ssh/authorized_keys"

install -d -o "$deploy_user" -g "$deploy_user" -m 0755 \
  /srv/sk-tps /srv/sk-tps/releases /srv/sk-tps/shared
install -o root -g root -m 0755 "$script_dir/receive.py" /usr/local/bin/sk-tps-deploy
install -o root -g root -m 0644 "$script_dir/nginx.conf" /etc/nginx/sites-available/sk-tps-demo.conf

if [[ ! -e /etc/nginx/sites-enabled/sk-tps-demo.conf ]]; then
  ln -s /etc/nginx/sites-available/sk-tps-demo.conf /etc/nginx/sites-enabled/sk-tps-demo.conf
fi

nginx -t
systemctl enable --now nginx
systemctl reload nginx
echo "VPS prepared. Upload a build using the restricted deployment key."
