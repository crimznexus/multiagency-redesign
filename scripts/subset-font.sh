#!/usr/bin/env sh
# Rebuilds the self-hosted fonts in src/assets/fonts from the Fontsource files:
# only the weight range and characters the page uses. Needs uv
# (https://docs.astral.sh/uv/). Add characters to UNICODES if the copy gains new ones.
set -e
UNICODES="U+0020-007E,U+00A0,U+00A9,U+00B7,U+00D7,U+2019,U+201C,U+201D,U+2013,U+2014,U+2026,U+2192,U+2197,U+2193,U+2715,U+2713"
FT='fonttools[woff]'
TMP=$(mktemp -d)
subset() { # src out weight-range
  uvx --from "$FT" fonttools varLib.instancer "$1" "wght=$3" -o "$TMP/inst.woff2"
  uvx --from "$FT" pyftsubset "$TMP/inst.woff2" --unicodes="$UNICODES" \
    --layout-features="kern,liga,calt,tnum,case,ss01" --flavor=woff2 --output-file="$2"
  ls -l "$2"
}
subset node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2 src/assets/fonts/geist-subset.woff2 400:700
subset node_modules/@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2 src/assets/fonts/geist-mono-subset.woff2 400:600
rm -rf "$TMP"
