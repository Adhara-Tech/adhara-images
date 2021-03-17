#!/bin/bash

set -e

rootFolder=$(git rev-parse --show-toplevel)
subprojects=$(${rootFolder}/scripts/getModifiedFolders.sh)

for project in $subprojects; do
  make check_version_bump PROJECT=$project
done
