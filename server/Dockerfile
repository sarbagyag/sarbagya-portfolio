FROM golang:1.25-alpine AS build
WORKDIR /src

RUN apk add --no-cache ca-certificates

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /out/api ./cmd/api

FROM debian:bookworm-slim
# ffmpeg + yt-dlp + deno back the favorite-track pipeline (internal/media):
# yt-dlp downloads+extracts a YouTube video's audio, ffmpeg trims it to the
# requested window. This is why the runtime image can no longer be
# `scratch` (which had no shell/binaries at all) — everything else about
# the image stays as minimal as this affords.
#
# Debian, not Alpine: Deno's binary is glibc-linked. Even Deno's own
# official "alpine" image only runs it by bundling a full copy of glibc +
# a patchelf'd loader alongside the binary (see
# denoland/deno_docker/alpine.dockerfile) — copying just that binary out
# (what an earlier version of this Dockerfile did) fails with
# `exec: no such file or directory`, the classic "kernel can't find the
# ELF interpreter" symptom, not a missing-file problem. That's a fragile
# thing to depend on (arch-specific loader paths, an exact bundled-lib
# set) versus just using a base image where every one of these tools has
# its normal, well-tested, glibc-native install path.
#
# yt-dlp is pip-installed with -U, not from a distro package — distro
# packages lag upstream releases enough to routinely break YouTube
# extraction ("Signature extraction failed" as YouTube tweaks its player's
# obfuscation; yt-dlp ships near-continuous patches for exactly that, and
# PyPI tracks those releases far more closely).
#
# `yt-dlp[default]`, not bare `yt-dlp`: YouTube's current anti-bot "n
# challenge" needs actual JS execution to solve, not just yt-dlp's old
# pure-Python signature interpreter. That needs two things together (see
# https://github.com/yt-dlp/yt-dlp/wiki/EJS): a JS runtime (Deno) to run a
# solver in, and the solver scripts themselves — the `[default]` extra is
# what pulls in the latter (the `yt-dlp-ejs` package); without it there's
# a runtime but nothing for it to run.
#
# `--break-system-packages`: this is a throwaway container image, not a
# host Python install, so PEP 668's externally-managed-environment guard
# doesn't apply here the way it would on a real machine.
RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates ffmpeg curl unzip python3-pip \
    && curl -fsSL https://deno.land/install.sh | DENO_INSTALL=/usr/local sh \
    && pip install --break-system-packages --no-cache-dir -U "yt-dlp[default]" \
    && apt-get purge -y curl unzip && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /out/api /api

EXPOSE 8080
ENTRYPOINT ["/api"]
