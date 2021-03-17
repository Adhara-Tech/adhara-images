#!/bin/bash

BRANCH=$(git rev-parse --abbrev-ref HEAD)
revision=''
if [[ "$BRANCH" == "master" ]]; then
  revision='~1'
fi
ignorechanges='scripts\|\.circleci\|Makefile\|\.gitignore\|README.md\|CODEOWNERS'
git diff origin/master${revision}...HEAD --name-only | sort -u | grep -v -e ${ignorechanges} | uniq
