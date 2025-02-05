#! /usr/bin/env bash

set -eEou pipefail

find "$1" -name "*.trio" -exec bash -c 'prettier --plugin ~/devel/prettier-plugin-haxall/src/index.js --print-width 120 "$0" > /tmp/out.trio' "{}" \; -exec mv /tmp/out.trio {} \;

