/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import React, { ReactElement, useEffect, useState } from "react";
import { Icon, SemanticCOLORS } from "semantic-ui-react";

/**
 * Prop types for the password validation icons.
 */
export interface IconProps {

    cssClassName : string;
    color : SemanticCOLORS;
}

export interface ValidationContentI18nInterface {
    length?: string;
    numbers?: string;
    case?: string;
    specialChr?: string;
    uniqueChr?: string;
    consecutiveChr?: string;
}

export interface ValidationStatusInterface {

    length?: boolean;
    numbers?: boolean;
    case?: boolean;
    specialChr?: boolean;
    uniqueChr?: boolean;
    consecutiveChr?: boolean;
    empty?: boolean;
}

export interface ValidationProps {

    minLength?: number;
    maxLength?: number;
    minNumbers?: number;
    minUpperCase?: number;
    minLowerCase?: number;
    minSpecialChr?: number;
    minUniqueChr?: number;
    maxConsecutiveChr?: number;
    className?: string;
    password: string;
    translations?: ValidationContentI18nInterface;
    onPasswordValidate?: (isValid: boolean, validationStatus: ValidationStatusInterface) => void;
}

export const PasswordValidation: React.FunctionComponent<ValidationProps> = (
    props: ValidationProps
): ReactElement => {
    const {
        minLength,
        maxLength,
        minUpperCase,
        minLowerCase,
        minNumbers,
        minSpecialChr,
        minUniqueChr,
        maxConsecutiveChr,
        password,
        translations,
        onPasswordValidate
    } = props;

    const [ validationStatus ] = useState<ValidationStatusInterface>(undefined);
    const lowerCaseLetters = /[a-z]/g;
    const upperCaseLetters = /[A-Z]/g;
    const numbers = /[0-9]/g;
    const chars = /[!#$%&'()*+,\-./:;<=>?@[\]^_{|}~]/g;
    const consecutive = /([^])\1+/g;
    const EMPTY_STRING = "";

    useEffect(() => {

        validate(password);
    }, [ password ]);

    /**
     * Validate the password.
     *
     * @param password - password.
     */
    const validate = (password) => {
        let _validationStatus = { ...validationStatus };

        if (password === EMPTY_STRING) {
            _validationStatus = {
                ..._validationStatus,
                empty: true
            };
            onPasswordValidate(false, _validationStatus);

            return;
        }

        if (password.length >= minLength && password.length <= maxLength) {
            _validationStatus = {
                ..._validationStatus,
                length: true
            };
        }
        if ((minUpperCase <= 0 || (password.match(upperCaseLetters)
                && password.match(upperCaseLetters).length >= minUpperCase))
            && (minLowerCase <= 0 || (password.match(lowerCaseLetters)
                && password.match(lowerCaseLetters).length >= minLowerCase))) {
            _validationStatus = {
                ..._validationStatus,
                case: true
            };
        }
        if (minNumbers <= 0 ||(password.match(numbers) && password.match(numbers).length >= minNumbers)) {
            _validationStatus = {
                ..._validationStatus,
                numbers: true
            };
        }
        if (minSpecialChr <= 0 || (password.match(chars) && password.match(chars).length >= minSpecialChr)) {
            _validationStatus = {
                ..._validationStatus,
                specialChr: true
            };
        }

        const unique : string[] = password.split("");
        const set : Set<string> = new Set(unique);

        if (minUniqueChr <=0 || set.size >= minUniqueChr) {
            _validationStatus = {
                ..._validationStatus,
                uniqueChr: true
            };
        }
        let _consValid: boolean = true;

        if (password.match(consecutive) && password.match(consecutive).length > 0) {
            const largest: string = password.match(consecutive).sort(
                function (a, b) {
                    return b.length - a.length;
                }
            ) [0];

            if (maxConsecutiveChr >= 1 &&
                largest.length > maxConsecutiveChr) {
                _consValid = false;
            }
        }
        if (_consValid) {
            _validationStatus = {
                ..._validationStatus,
                consecutiveChr: true
            };
        }

        // isValid if all the attr in the object are true and not empty.
        const isValid: boolean = !_validationStatus.empty && _validationStatus.length && _validationStatus.numbers &&
            _validationStatus.case && _validationStatus.specialChr && _validationStatus.uniqueChr &&
            _validationStatus.consecutiveChr;

        // _validationStatus pass the original for more finegrained control from outside
        onPasswordValidate(isValid, _validationStatus);

        return;
    };

    /**
     * Returns Icon Props which are needed to set state of Password Validation Icons.
     */
    const getIconProps = (id : string) : IconProps =>{

        const DEFAULT: IconProps = {
            color : "grey" as SemanticCOLORS,
            cssClassName : "circle thin"
        };

        const POSITIVE: IconProps = {
            color : "green" as SemanticCOLORS,
            cssClassName : "check circle"
        };

        const NEGATIVE: IconProps = {
            color : "red" as SemanticCOLORS,
            cssClassName : "remove circle"
        };

        if (id === "password-validation-length") {
            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if (password.length >= minLength && password.length <= maxLength) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        } else if (id === "password-validation-case") {
            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if ((minUpperCase <= 0 || (password.match(upperCaseLetters)
                    && password.match(upperCaseLetters).length >= minUpperCase))
                && (minLowerCase <= 0 || (password.match(lowerCaseLetters)
                    && password.match(lowerCaseLetters).length >= minLowerCase))) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        } else if (id === "password-validation-number") {
            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if (password.match(numbers) && password.match(numbers).length >= minNumbers) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        } else if (id === "password-validation-chars") {
            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if (password.match(chars) && password.match(chars).length >= minSpecialChr) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        } else if (id === "password-validation-unique-chars") {
            const unique : string[] = password.split("");
            const set : Set<string> = new Set(unique);

            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if (set.size >= minUniqueChr) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        } else if (id === "password-validation-cons-chars") {
            let valid: boolean = true;

            if (password.match(consecutive) && password.match(consecutive).length > 0) {
                const largest: string = password.match(consecutive).sort(
                    function (a, b) {
                        return b.length - a.length;
                    }
                ) [0];

                if (maxConsecutiveChr >= 1 &&
                    largest.length > maxConsecutiveChr) {
                    valid = false;
                }
            }

            if (password === EMPTY_STRING) {
                return DEFAULT;
            } else if (valid) {
                return POSITIVE;
            } else {
                return NEGATIVE;
            }
        }
    };

    return(
        <div>
            { (minLength > 0 || maxLength > 0) && (
                <div className="password-policy-description">

                    <Icon
                        id="password-validation-length"
                        className={ getIconProps("password-validation-length").cssClassName }
                        color={ getIconProps("password-validation-length").color }
                        inverted
                    />
                    <p>{ translations.length }</p>
                </div>
            ) }
            { (minUpperCase > 0 || minLowerCase > 0) && (
                <div className="password-policy-description">
                    <Icon
                        id="password-validation-case"
                        className={ getIconProps("password-validation-case").cssClassName }
                        color={ getIconProps("password-validation-case").color }
                        inverted
                    />
                    <p>{ translations.case }</p>
                </div>
            ) }
            { minNumbers > 0 && (
                <div className="password-policy-description">
                    <Icon
                        id="password-validation-number"
                        className={ getIconProps("password-validation-number").cssClassName }
                        color={ getIconProps("password-validation-number").color }
                        inverted
                    />
                    <p>{ translations.numbers }</p>
                </div>
            ) }
            { minSpecialChr > 0 && (
                <div className="password-policy-description">
                    <Icon
                        id="password-validation-chars"
                        className={ getIconProps("password-validation-chars").cssClassName }
                        color={ getIconProps("password-validation-chars").color }
                        inverted
                    />
                    <p>{ translations.specialChr }</p>
                </div>
            ) }
            { minUniqueChr > 0 && (
                <div className="password-policy-description">
                    <Icon
                        id="password-validation-chars"
                        className={ getIconProps("password-validation-unique-chars").cssClassName }
                        color={ getIconProps("password-validation-unique-chars").color }
                        inverted
                    />
                    <p>{ translations.uniqueChr }</p>
                </div>
            ) }
            { maxConsecutiveChr > 0 && (
                <div className="password-policy-description">
                    <Icon
                        id="password-validation-chars"
                        className={ getIconProps("password-validation-cons-chars").cssClassName }
                        color={ getIconProps("password-validation-cons-chars").color }
                        inverted
                    />
                    <p>{ translations.consecutiveChr }</p>
                </div>
            ) }
        </div>
    );
};

/**
 * Default proptypes for the page header component.
 */
PasswordValidation.defaultProps = {
    maxConsecutiveChr: 0,
    maxLength: 30,
    minLength: 8,
    minLowerCase: 0,
    minNumbers: 0,
    minSpecialChr: 0,
    minUniqueChr: 0,
    minUpperCase: 0,
    translations: {
        case: "At least one uppercase and one lowercase letters",
        consecutiveChr: "No more than one repeated character",
        length: "Must be between 8 and 30 characters",
        numbers: "At least one number",
        specialChr: "At least {minSpecialChr} of the symbols !@#$%^&*",
        uniqueChr: "At least one unique character"
    }
};
