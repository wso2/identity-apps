/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "../../admin.validation.v1/models";

/**
 * The following function is for generating random numbers in range of [0 - upperlimit).
 *
 * @param upperLimit - upperlimit (exclusive) for random numbers range.
 * @returns the generated random number.
 */
const generateRandomNumbers = (upperLimit: number): number => {
    return Math.random() * (upperLimit);
};

/**
 * The following function is to remove an array of strings from a string.
 *
 * @param str - original string.
 * @param ignoredChars - array of strings to be removed.
 * @returns the modified original string by removing ignoredChars.
 */
const removeIgnoredCharacters = (str: string, ignoredChars: string[]): string => {
    for (const char of ignoredChars) {
        str = str.replace(char, "");
    }

    return str;
};

/**
 * The following function is to generate a random password according to the provided options.
 *
 * @param length - length of password.
 * @param isAlphabetsLowercaseAllowed - whether to include lowercase alphabets.
 * @param isAlphabetsUppercaseAllowed - whether to include uppercase alphabets.
 * @param isNumbersAllowed - whether to include numbers.
 * @param isSpecialCharactersAllowed - whether to include special characters.
 * @param minAlphabetsLowercase - required minimum number of lowercase alphabets.
 * @param minAlphabetsUppercase - required minimum number of uppercase alphabets.
 * @param minNumbers - required minimum number of numbers.
 * @param minSpecialCharacters - required minimum number of special characters.
 * @param uniqueCharacter - required unique characters.
 * @param ignoredCharactors - array of characters to be excluded.
 * @returns the generated password.
 */
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
    uniqueCharacter: number = 0,
    ignoredCharactors: string[] = []
): string => {
    let generatedPassword: string = "";
    let minChar: string = "";

    const LOWERCASE_CHAR: string = removeIgnoredCharacters("abcdefghijklmnopqrstuvwxyz", ignoredCharactors);

    const UPPERCASE_CHAR: string = removeIgnoredCharacters("ABCDEFGHIJKLMNOPQRSTUVWXYZ", ignoredCharactors);

    const NUMBERS: string = removeIgnoredCharacters("0123456789", ignoredCharactors);

    const SPECIAL_CHAR: string = removeIgnoredCharacters("!#$%&'()*+,-./:;<=>?@[]^_{|}~", ignoredCharactors);

    for (let i: number = 0; i < minAlphabetsLowercase; i++) {
        minChar = minChar + getCharacter(minChar, LOWERCASE_CHAR);
    }

    for (let i: number = 0; i < minAlphabetsUppercase; i++) {
        minChar = minChar + getCharacter(minChar, UPPERCASE_CHAR);
    }

    for (let i: number = 0; i < minNumbers; i++) {
        minChar = minChar + getCharacter(minChar, NUMBERS);
    }

    for (let i: number = 0; i < minSpecialCharacters; i++) {
        minChar = minChar + getCharacter(minChar, SPECIAL_CHAR);
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

    const set : Set<string> = new Set(generatedPassword.split(""));
    let isUnique: boolean = false;

    if (uniqueCharacter > 0 && set.size < uniqueCharacter) {
        generatedPassword = Array.from(set).join("");
        isUnique = true;
    }

    const remainingChar: number = length - generatedPassword.length;

    for (let i: number = 0; i < remainingChar; i++) {
        generatedPassword = generatedPassword + (isUnique ?
            getUniqueCharacter(generatedPassword, characterString) : getCharacter(generatedPassword, characterString));
    }

    return generatedPassword;
};

/**
 * Generate random string.
 *
 * @param generatedPassword - Generated password.
 * @param characterSet - Character set.
 * @returns char - Random string.
 */
export const getCharacter = (generatedPassword: string, characterSet: string): string => {

    let char: string = characterSet.charAt(generateRandomNumbers(characterSet.length));

    while (char === generatedPassword.charAt(generatedPassword.length - 1)) {
        char = characterSet.charAt(generateRandomNumbers(characterSet.length));
    }

    return char;
};

/**
 * Generate unique string.
 *
 * @param generatedPassword - Generated password.
 * @param characterSet - Character set.
 * @returns char - Random string.
 */
export const getUniqueCharacter = (generatedPassword: string, characterSet: string): string => {

    let char: string = characterSet.charAt(generateRandomNumbers(characterSet.length));

    while (generatedPassword.includes(char)) {
        char = characterSet.charAt(generateRandomNumbers(characterSet.length));
    }

    return char;
};

/**
 * The following function is to get the password validation configurations in the required format.
 *
 * @param configs - validation configurations for an organization.
 * @returns the password validation configuration.
 */
export const getConfiguration = (configs: ValidationDataInterface[]): ValidationFormInterface => {

    const passwordConf: ValidationDataInterface[] =
        configs?.filter((data: ValidationDataInterface) => data.field === "password");

    if (passwordConf === undefined || passwordConf.length < 1) {

        return;
    }
    const config: ValidationDataInterface = passwordConf[0];

    const rules: ValidationConfInterface[] = config?.rules;

    if (rules?.length < 1) {

        return;
    }

    return {
        consecutiveCharacterValidatorEnabled:
            getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") !== null,
        field: "password",
        maxConsecutiveCharacters: getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") ?
            getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") : "0",
        maxLength: getConfig(rules, "LengthValidator", "max.length") ?
            getConfig(rules, "LengthValidator", "max.length") : "30",
        minLength: getConfig(rules, "LengthValidator", "min.length") ?
            getConfig(rules, "LengthValidator", "min.length") : "8",
        minLowerCaseCharacters: getConfig(rules, "LowerCaseValidator", "min.length") ?
            getConfig(rules, "LowerCaseValidator", "min.length") : "0",
        minNumbers: getConfig(rules, "NumeralValidator", "min.length") ?
            getConfig(rules, "NumeralValidator", "min.length") : "0",
        minSpecialCharacters: getConfig(rules, "SpecialCharacterValidator", "min.length") ?
            getConfig(rules, "SpecialCharacterValidator", "min.length") : "0",
        minUniqueCharacters: getConfig(rules, "UniqueCharacterValidator", "min.unique.character") ?
            getConfig(rules, "UniqueCharacterValidator", "min.unique.character") : "0",
        minUpperCaseCharacters: getConfig(rules, "UpperCaseValidator", "min.length") ?
            getConfig(rules, "UpperCaseValidator", "min.length") : "0",
        type: "rules",
        uniqueCharacterValidatorEnabled:
            getConfig(rules, "UniqueCharacterValidator", "min.unique.character") !== null
    };
};

/**
 * The following function is to get the value of a specific validator configuration..
 *
 * @param ruleSet - list of rules configured.
 * @param validator - validator name.
 * @param attribute - attribute name.
 * @returns the value of the validator configuration.
 */
export const getConfig = (ruleSet: ValidationConfInterface[], validator: string, attribute: string): string => {

    const config: ValidationConfInterface[] = ruleSet?.filter((data: ValidationConfInterface) => {
        return data.validator === validator;
    });

    if (config?.length > 0) {
        let properties: ValidationPropertyInterface[] = config[0].properties;

        properties = properties.filter((data: ValidationPropertyInterface) => data.key === attribute);

        if (properties.length > 0) {
            return properties[0].value;
        }
    }

    return null;
};
