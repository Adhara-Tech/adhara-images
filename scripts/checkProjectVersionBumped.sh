#!/bin/bash

set -e

PROJECT=$1

rootFolder=$(git rev-parse --show-toplevel)
versionBumped=$(${rootFolder}/scripts/getModifiedFiles.sh | grep $PROJECT/FULL_IMAGE_NAME)

# returns 0 is previous grep is empty
exit $([ ! -z "$versionBumped" ])
