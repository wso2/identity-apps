#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
#
# Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com) All Rights Reserved.
#
# WSO2 LLC. licenses this file to you under the Apache License,
# Version 2.0 (the "License"); you may not use this file except
# in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
#
# --------------------------------------------------------------------------------------

# ======================================================================================
# GITHUB CI - Linter Script to analyze the changed files of a PR.
# ======================================================================================

GITHUB_PR_NUMBER=$1

# Check relevant packages are available
command -v pnpm >/dev/null 2>&1 || { echo >&2 "Error: $0 script requires 'pnpm' for buid.  Aborting as not found."; exit 1; }
command -v gh >/dev/null 2>&1 || { echo >&2 "Error: $0 script requires 'gh' to call GitHub APIs.  Aborting as not found."; exit 1; }

raw_changed_files=$(gh pr diff $GITHUB_PR_NUMBER --name-only)
changed_files_arr=($raw_changed_files)

echo -e "\n============ ☸️ Here's what changed in PR#$GITHUB_PR_NUMBER ☸️ ============\n"

for i in "${!changed_files_arr[@]}"
do
echo -e "$i: ${changed_files_arr[$i]}"
done

echo -e "\n========================================\n"

printf -v formatted '%s ' "${changed_files_arr[@]}"

echo -e "🥬 Starting analyzing the changed files with ESLint.."

pnpm eslint --ext .js,.jsx,.ts,.tsx --no-error-on-unmatched-pattern --max-warnings=0 --resolve-plugins-relative-to . -- ${formatted%}
