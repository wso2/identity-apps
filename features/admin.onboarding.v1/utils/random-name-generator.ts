/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { humanId } from "human-id";

/**
 * Generates a random human-readable application name using adjective + noun format.
 *
 * @returns A random application name in Title Case format (e.g., "Swift Falcon").
 */
export const generateRandomName = (): string => {
    const fullId: string = humanId({
        capitalize: true,
        separator: " "
    });

    // human-id generates "adjective noun verb" - we only want "adjective noun"
    const words: string[] = fullId.split(" ");

    return words.slice(0, 2).join(" ");
};

/**
 * Generates multiple unique random application names.
 *
 * @param count - Number of names to generate.
 * @returns Array of unique random application names.
 */
export const generateRandomNames = (count: number): string[] => {
    const names: Set<string> = new Set();

    // Add safety limit to prevent infinite loop
    const maxAttempts: number = count * 10;
    let attempts: number = 0;

    while (names.size < count && attempts < maxAttempts) {
        names.add(generateRandomName());
        attempts++;
    }

    return Array.from(names);
};
