FROM golang:1.25-alpine AS build
WORKDIR /src

RUN apk add --no-cache ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/api ./cmd/api

FROM alpine:3.20
# ffmpeg + yt-dlp + deno back the favorite-track pipeline (internal/media):
# yt-dlp downloads+extracts a YouTube video's audio, ffmpeg trims it to the
# requested window. This is why the runtime image can no longer be
# `scratch` (which had no shell/binaries at all) — everything else about
# the image stays as minimal as this affords.
#
# yt-dlp is pip-installed with -U, not `apk add yt-dlp` — Alpine's package
# lags upstream releases enough to routinely break YouTube extraction
# ("Signature extraction failed" as YouTube tweaks its player's
# obfuscation; yt-dlp ships near-continuous patches for exactly that, and
# PyPI tracks those releases far more closely than Alpine's repo snapshot).
#
# `yt-dlp[default]`, not bare `yt-dlp`: YouTube's current anti-bot "n
# challenge" needs actual JS execution to solve, not just yt-dlp's old
# pure-Python signature interpreter. That needs two things together (see
# https://github.com/yt-dlp/yt-dlp/wiki/EJS): a JS runtime (Deno below) to
# run a solver in, and the solver scripts themselves — the `[default]`
# extra is what pulls in the latter (the `yt-dlp-ejs` package); without it
# there's a runtime but nothing for it to run.
#
# Deno is copied in from Deno's own official `alpine` image rather than
# installed via their generic curl|sh installer, which produces a glibc
# binary — Deno has no official musl/Alpine build there, only via this
# dedicated image.
#
# `--break-system-packages`: this is a throwaway container image, not a
# host Python install, so PEP 668's externally-managed-environment guard
# doesn't apply here the way it would on a real machine.
COPY --from=denoland/deno:alpine /bin/deno /usr/local/bin/deno
RUN apk add --no-cache ca-certificates ffmpeg python3 py3-pip \
    && pip install --break-system-packages --no-cache-dir -U "yt-dlp[default]"
COPY --from=build /out/api /api

EXPOSE 8080
ENTRYPOINT ["/api"]
