#! /usr/bin/env bash

# Usage: format-dir.sh <path to root directory containing trio files>

set -eEou pipefail

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
prettier_cmd="prettier --plugin \"${SCRIPT_DIR}/src/index.js\" --print-width 120 "
prettier_cmd+='"$0" > /tmp/out.trio'
find "$1" -name "*.trio" -exec bash -c "$prettier_cmd" "{}" \; -exec mv /tmp/out.trio {} \;

