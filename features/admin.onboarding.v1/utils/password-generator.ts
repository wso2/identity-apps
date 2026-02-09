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

/**
 * Character sets for password generation.
 * Excludes visually ambiguous characters (0, O, l, 1, I).
 */
const UPPERCASE: string = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWERCASE: string = "abcdefghjkmnpqrstuvwxyz";
const NUMBERS: string = "23456789";
const SPECIAL: string = "!@#$%";

/**
 * Generate a cryptographically secure random password.
 * Ensures the password meets complexity requirements:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 *
 * @param length - Password length (default: 12)
 * @returns Secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
    const allChars: string = UPPERCASE + LOWERCASE + NUMBERS + SPECIAL;

    // Start with one character from each required set
    const password: string[] = [
        getRandomChar(UPPERCASE),
        getRandomChar(LOWERCASE),
        getRandomChar(NUMBERS),
        getRandomChar(SPECIAL)
    ];

    // Fill the rest with random characters from all sets
    const remainingLength: number = length - password.length;
    const array: Uint8Array = new Uint8Array(remainingLength);

    crypto.getRandomValues(array);

    for (let i: number = 0; i < remainingLength; i++) {
        password.push(allChars[array[i] % allChars.length]);
    }

    // Shuffle the password array to randomize position of required characters
    return shuffleArray(password).join("");
};

/**
 * Get a random character from a string using crypto.getRandomValues.
 *
 * @param str - String to select from
 * @returns Random character
 */
const getRandomChar = (str: string): string => {
    const array: Uint8Array = new Uint8Array(1);

    crypto.getRandomValues(array);

    return str[array[0] % str.length];
};

/**
 * Fisher-Yates shuffle algorithm using crypto.getRandomValues.
 *
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
const shuffleArray = <T>(array: T[]): T[] => {
    const result: T[] = [ ...array ];
    const randomValues: Uint8Array = new Uint8Array(result.length);

    crypto.getRandomValues(randomValues);

    for (let i: number = result.length - 1; i > 0; i--) {
        const j: number = randomValues[i] % (i + 1);

        [ result[i], result[j] ] = [ result[j], result[i] ];
    }

    return result;
};
