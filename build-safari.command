#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
if ! command -v xcrun >/dev/null 2>&1; then echo 'Install and open full Xcode first.'; exit 1; fi
if xcrun --find safari-web-extension-packager >/dev/null 2>&1; then
 tool=safari-web-extension-packager
elif xcrun --find safari-web-extension-converter >/dev/null 2>&1; then
 tool=safari-web-extension-converter
else
 echo 'Safari extension tooling was not found. Install full Xcode and select it under Xcode > Settings > Locations > Command Line Tools.'; exit 1
fi
xcrun "$tool" "$PWD/extension" --project-location "$PWD/build" --app-name 'Clean Copy' --bundle-identifier com.rodrigo.cleancopy --macos-only
