/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

const generateRandomNumbers = (upperLimit: number): number => {
    return Math.random() * (upperLimit);
};

const removeIgnoredCharacters = (str: string, ignoredChars: string[]) => {
    for (const char of ignoredChars) {
        str = str.replace(char, "");
    }

    return str;
};

export const generatePassword = (
    length: number = 10,
    isAlphabetsLowercaseAllowed: boolean = true,
    isAlphabetsUppercaseAllowed: boolean = true,
    isNumbersAllowed: boolean = true,
    isSpecialCharactersAllowed: boolean = true,
    minAlphabetsLowercase: number = 1,
    minAlphabetsUppercase: number = 1,
    minNumbers: number = 1,
    minSpecialCharacters: number = 1,
    ignoredCharactors: string[] = []
): string => {
    let generatedPassword: string = "";
    let minChar: string = "";

    const LOWERCASE_CHAR: string = removeIgnoredCharacters("abcdefghijklmnopqrstuvwxyz", ignoredCharactors);

    const UPPERCASE_CHAR: string = removeIgnoredCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ignoredCharactors);

    const NUMBERS: string = removeIgnoredCharacters("0123456789", ignoredCharactors);

    const SPECIAL_CHAR: string = removeIgnoredCharacters("!#$%&'()*+,-./:;<=>?@[]^_{|}~", ignoredCharactors);

    for (let i: number = 0; i < minAlphabetsLowercase; i++) {
        minChar = minChar + LOWERCASE_CHAR.charAt(generateRandomNumbers(LOWERCASE_CHAR.length));
    }

    for (let i: number = 0; i < minAlphabetsUppercase; i++) {
        minChar = minChar + UPPERCASE_CHAR.charAt(generateRandomNumbers(UPPERCASE_CHAR.length));
    }

    for (let i: number = 0; i < minNumbers; i++) {
        minChar = minChar + NUMBERS.charAt(generateRandomNumbers(NUMBERS.length));
    }

    for (let i: number = 0; i < minSpecialCharacters; i++) {
        minChar = minChar + SPECIAL_CHAR.charAt(generateRandomNumbers(SPECIAL_CHAR.length));
    }

    generatedPassword = minChar;
    let characterString: string = "";

    characterString = isAlphabetsLowercaseAllowed
        ? characterString + LOWERCASE_CHAR
        : characterString;

    characterString = isAlphabetsUppercaseAllowed
        ? characterString + UPPERCASE_CHAR
        : characterString;

    characterString = isNumbersAllowed ? characterString + NUMBERS : characterString;

    characterString = isSpecialCharactersAllowed
        ? characterString + SPECIAL_CHAR
        : characterString;

    const remainingChar: number = length - generatedPassword.length;

    for (let i: number = 0; i < remainingChar; i++) {
        generatedPassword = generatedPassword + characterString.charAt(generateRandomNumbers(characterString.length));
    }

    return generatedPassword;
};
