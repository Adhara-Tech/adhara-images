#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
revision=''
if [[ "$BRANCH" == "master" ]]; then
  revision='~1'
fi
ignorechanges='scripts\|\.circleci\|Makefile\|\.gitignore\|README.md\|CODEOWNERS'
git diff origin/master${revision}...HEAD --name-only --diff-filter=A | sort -u | grep -v -e ${ignorechanges} | awk 'BEGIN {FS="/"} {print $1}' | uniq
