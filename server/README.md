# portfolio-api

Go backend for the portfolio — replaces Next.js Server Actions, middleware,
and Drizzle/Supabase Postgres with a standalone REST API you run yourself.
The Next.js app stays on Vercel as a pure client and calls this over HTTPS.

## Stack

- `net/http` + [chi](https://github.com/go-chi/chi) router
- [pgx/v5](https://github.com/jackc/pgx) — direct Postgres driver, no ORM
- [goose](https://github.com/pressly/goose) — SQL migrations, embedded in the binary, run automatically on boot
- JWT (Bearer token) auth for the single admin user — no cookies, no sessions table, no public signup
- [MinIO](https://min.io) (S3-compatible) for file uploads, via [minio-go](https://github.com/minio/minio-go)

## Local dev

```bash
cp .env.example ../.env   # repo root, see docker-compose.yml
cd .. && docker compose up -d --build
```

Or run the API alone against a local Postgres/MinIO:

```bash
export DATABASE_URL=postgres://...
export JWT_SECRET=dev-secret
export ADMIN_EMAIL=you@example.com
export ADMIN_PASSWORD=devpassword
export CORS_ALLOWED_ORIGINS=http://localhost:3000
export MINIO_ENDPOINT=localhost:9000
export MINIO_ACCESS_KEY=... MINIO_SECRET_KEY=...
export MINIO_BUCKET=media
export MINIO_PUBLIC_URL=http://localhost:9000
go run ./cmd/api
```

Migrations and the admin-user seed both run automatically on boot — no
separate `db:migrate` / `db:seed` step to remember.

## Deploying on your own server

Assumes a Traefik instance already running on the box with an external
`proxy` Docker network (the same pattern your Vikunja deployment uses) —
this stack doesn't run its own reverse proxy or provision its own TLS; it
just joins `proxy` and adds Traefik labels, same as Vikunja's does.

1. Point a DNS A record for `PORTFOLIO_DOMAIN` (e.g. `portfolio.mandalafoods.co`) at the server.
2. Put this repo (or at least `server/`, `docker-compose.yml`, `.env.example`) somewhere like `/opt/portfolio` on the server.
3. `cp .env.example .env`, fill in real secrets (`openssl rand -base64 48` for `JWT_SECRET`).
4. `docker compose up -d --build`. Traefik picks up the labels and provisions a cert for `PORTFOLIO_DOMAIN` automatically on first request, same as it already does for Vikunja.
5. Point the Next.js frontend's `NEXT_PUBLIC_API_URL` (on Vercel) at `https://<PORTFOLIO_DOMAIN>` — the API lives under `/api/*` on that same domain, uploaded files under `/media/*`.
6. Log in at the admin UI with `ADMIN_EMAIL`/`ADMIN_PASSWORD` — after that, you can blank those two out of `.env` if you want (seeding is a one-time, first-boot-only no-op after an admin exists).

## Auth model

`POST /api/auth/login` returns a JWT. The frontend stores it (e.g.
`localStorage`) and sends `Authorization: Bearer <token>` on every
`/api/admin/*` call. Tokens last 7 days; there's no refresh endpoint —
logging in again is the "refresh."

## Endpoints

Public:
- `GET /api/profile`
- `GET /api/experience`
- `GET /api/projects[?featured=true]`
- `GET /api/projects/{id}`
- `GET /api/education`
- `GET /api/skills`
- `GET /api/posts[?type=blog|learning-log]` — published only
- `GET /api/posts/{slug}` — published only
- `POST /api/contact`
- `POST /api/auth/login`

Admin (`Authorization: Bearer <token>` required):
- `PUT /api/admin/profile`
- `POST /api/admin/experience`, `PUT /api/admin/experience/{id}`, `DELETE /api/admin/experience/{id}`
- `POST /api/admin/projects`, `PUT /api/admin/projects/{id}`, `DELETE /api/admin/projects/{id}`
- `POST /api/admin/education`, `PUT /api/admin/education/{id}`, `DELETE /api/admin/education/{id}`
- `POST /api/admin/skills`, `PUT /api/admin/skills/{id}`, `DELETE /api/admin/skills/{id}`
- `GET /api/admin/posts[?type=...]` — all statuses, `POST`, `PUT /{id}`, `DELETE /{id}`
- `GET /api/admin/messages`, `PATCH /api/admin/messages/{id}/read`, `DELETE /api/admin/messages/{id}`
- `POST /api/admin/upload` — multipart `file` field, 5MB cap, returns `{"url": "..."}`

Image fields (`avatarUrl`, `resumeUrl`, `imageUrl`, `coverImageUrl`) get
their old MinIO object deleted automatically whenever you replace or clear
them, or delete the row that owned them — same behavior the old Supabase
Storage integration had.
