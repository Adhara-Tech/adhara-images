#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
revision=''
if [[ "$BRANCH" == "master" ]]; then
  revision='~1'
fi
ignorechanges='scripts\|\.circleci\|\.github\|Makefile\|\.gitignore\|README.md\|CODEOWNERS'
git diff origin/master${revision}...HEAD --name-only --diff-filter=d | sort -u | grep -v -e ${ignorechanges} | uniq
