#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
#
# Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

# Inputs
GITHUB_PR_NUMBER=$1

# When unsupported file formats are passed in, ESLint throws a warning which conflicts with -max-warnings=0.
# Hence, we need to manually filter out the supported formats.
# Tracker: https://github.com/eslint/eslint/issues/15010
ESLINT_SUPPORTED_EXT=(js jsx ts tsx)

# Excluding files that adhere to the specified patterns from the list of supported files.
PATHS_TO_EXCLUDE=("identity-apps-core/apps/**/*.js")

MAX_FILE_THRESHOLD_FOR_LINTER=50

# Check relevant packages are available
command -v pnpm >/dev/null 2>&1 || { echo >&2 "Error: $0 script requires 'pnpm' for buid.  Aborting as not found."; exit 1; }
command -v gh >/dev/null 2>&1 || { echo >&2 "Error: $0 script requires 'gh' to call GitHub APIs.  Aborting as not found."; exit 1; }

raw_changed_files=$(gh pr diff "$GITHUB_PR_NUMBER" --name-only)
changed_files=()
supported_files=()
filer_pattern=""

# Convert the multiline string to a single line.
while read -r file; do
   changed_files+=("$file")
done <<< "$raw_changed_files"

# Filter out the files with the supported extensions.
for file in "${changed_files[@]}"; do
    for ext in "${ESLINT_SUPPORTED_EXT[@]}"; do
        if [[ $file == *$ext ]]; then
            pattern_match=false

            for pattern in "${PATHS_TO_EXCLUDE[@]}"; do
                if [[ $file == $pattern ]]; then
                    pattern_match=true
                    break
                fi
            done

            if [ $pattern_match == false ]; then
                supported_files+=("$file")
            fi
        fi
    done
done

echo -e "\n============ 💥 Here's what changed in PR#$GITHUB_PR_NUMBER 💥 ============\n"

for file in "${supported_files[@]}"; do
    echo -e "   - $file"
done

echo -e "\n 🔢 Total number of changed files: ${#supported_files[@]}"

echo -e "\n=============================================================\n"

echo -e "\n 🥬 Starting analyzing the changed files with ESLint.. \n"

for ((i=0; i < ${#supported_files[@]}; i+=MAX_FILE_THRESHOLD_FOR_LINTER))
do
    chunk=( "${supported_files[@]:i:MAX_FILE_THRESHOLD_FOR_LINTER}" )

    # Modify the filepattern to avoid eslint pattern mismatch errors.
    if [[ ${#chunk[@]} -gt 1 ]]; then
        filter_pattern="{""$(IFS=","; echo "${chunk[*]}")""}";
    elif [[ ${#chunk[@]} == 1 ]]; then
        filter_pattern="$(IFS=","; echo "${chunk[*]}")";
    else
        filter_pattern="{}";
    fi

    if [[ ${#supported_files[@]} -gt MAX_FILE_THRESHOLD_FOR_LINTER ]]; then
        echo -e "\n 🔥 Linting the changed files as batches..Here are the results... \n"
    fi

    pnpm eslint --ext .js,.jsx,.ts,.tsx --no-error-on-unmatched-pattern --max-warnings=0 --resolve-plugins-relative-to . -- "$filter_pattern"
done
