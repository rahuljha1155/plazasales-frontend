# Frontend + Dashboard Deployment (Docker Compose)

## Prereqs
- Docker + Docker Compose on the VPS
- External network already created: `plaza-network`
- Node on the VPS is irrelevant; Docker uses `node:24-alpine` for builds and runtime.

## Files and envs
- Frontend env (runtime): copy `.env.frontend.example` to `frontend/.env`

Note: `NEXT_PUBLIC_*` are build-time envs; with Docker Hub builds, set them as build args in CI if needed.

## Commands (VPS)
```bash
cd /var/www/plazasales-frontend
docker compose -f docker-compose.frontend.yml up -d

docker logs -f plazasales-frontend
# or
# docker logs -f plazasales-dashboard
```

## Apache reverse proxy snippets
Enable required modules:
```bash
a2enmod proxy proxy_http proxy_wstunnel headers rewrite
systemctl reload apache2
```

### Backend (already on host port 5436)
```apache
<VirtualHost *:80>
  ServerName app.plazasales.com.np

  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:5436/
  ProxyPassReverse / http://127.0.0.1:5436/
</VirtualHost>
```

### Next.js frontend (host port 3000)
```apache
<VirtualHost *:80>
  ServerName plazasales.com.np

  ProxyPreserveHost On

  # WebSocket support for Next.js
  RewriteEngine On
  RewriteCond %{HTTP:Upgrade} =websocket [NC]
  RewriteRule /(.*) ws://127.0.0.1:3000/$1 [P,L]
  RewriteCond %{HTTP:Upgrade} !=websocket [NC]
  RewriteRule /(.*) http://127.0.0.1:3000/$1 [P,L]

  ProxyPass / http://127.0.0.1:3000/
  ProxyPassReverse / http://127.0.0.1:3000/
</VirtualHost>
```

### Dashboard (host port 5173)
```apache
<VirtualHost *:80>
  ServerName plaza-dash.plazasales.com.np
  # or ServerName plaza-dash.webxnepal.com

  ProxyPreserveHost On
  ProxyPass / http://127.0.0.1:5173/
  ProxyPassReverse / http://127.0.0.1:5173/
</VirtualHost>
```
