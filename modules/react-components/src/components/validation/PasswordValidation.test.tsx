/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

// @vitest-environment jsdom

import React, { ReactElement, act } from "react";
import { Root, createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PasswordValidation, ValidationProps, ValidationStatusInterface } from "./PasswordValidation";

/**
 * Policy used by the tests: only the special character rule is enabled, so the special character icon is the only
 * `password-validation-chars` icon rendered.
 */
const SPECIAL_CHARACTER_POLICY: Partial<ValidationProps> = {
    maxConsecutiveChr: 0,
    maxLength: 64,
    minLength: 0,
    minLowerCase: 0,
    minNumbers: 0,
    minUniqueChr: 0,
    minUpperCase: 0
};

/**
 * Renders the component and returns the class names of the special character requirement icon.
 *
 * @param password - Password to validate.
 * @param minSpecialChr - Minimum number of special characters required.
 * @returns The class names of the special character icon.
 */
const getSpecialCharacterIconClasses = (password: string, minSpecialChr: number = 1): string => {
    const element: ReactElement = (
        <PasswordValidation
            { ...SPECIAL_CHARACTER_POLICY }
            minSpecialChr={ minSpecialChr }
            password={ password }
            translations={ { specialChr: "At least 1 special character(s)" } }
            onPasswordValidate={ () => { /* no-op */ } }
        />
    );
    const container: HTMLDivElement = document.createElement("div");

    container.innerHTML = renderToStaticMarkup(element);

    return container.querySelector("#password-validation-chars")?.getAttribute("class") ?? "";
};

/**
 * Validation result reported through `onPasswordValidate`.
 */
interface ReportedStatus {
    isValid: boolean;
    status: ValidationStatusInterface;
}

/**
 * Renders the component into the DOM and returns the status reported through `onPasswordValidate`.
 *
 * @param password - Password to validate.
 * @param minSpecialChr - Minimum number of special characters required.
 * @returns The validation status reported by the component.
 */
const getReportedStatus = (
    password: string,
    minSpecialChr: number = 1
): ReportedStatus => {
    let reported: ReportedStatus = { isValid: false, status: {} };
    const root: Root = createRoot(document.createElement("div"));

    (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

    act((): void => {
        root.render(
            <PasswordValidation
                { ...SPECIAL_CHARACTER_POLICY }
                minSpecialChr={ minSpecialChr }
                password={ password }
                translations={ { specialChr: "At least 1 special character(s)" } }
                onPasswordValidate={ (isValid: boolean, status: ValidationStatusInterface): void => {
                    reported = { isValid, status };
                } }
            />
        );
    });
    act((): void => root.unmount());

    return reported;
};

const SATISFIED: string = "check circle";
const NOT_SATISFIED: string = "remove circle";

/**
 * The server counts a character as special when it does not match `[A-Za-z0-9]` (`SpecialCharacterValidator`).
 * The password indicator has to agree with it, otherwise users are blocked from using a password the server accepts.
 */
describe("PasswordValidation special character rule", (): void => {

    const ACCEPTED: [string, string][] = [
        [ "exclamation mark", "Abcdefghijklmn1!" ],
        [ "tilde", "Abcdefghijklmn1~" ],
        [ "underscore", "Abcdefghijklmn1_" ],
        [ "pound sign", "Abcdefghijklmn1£" ],
        [ "euro sign", "Abcdefghijklmn1€" ],
        [ "accented letter", "Abcdefghijklmn1é" ],
        [ "space", "Abcdefghijklmn1 " ]
    ];

    it.each(ACCEPTED)("marks the requirement as satisfied for a %s", (_name: string, password: string): void => {
        const classes: string = getSpecialCharacterIconClasses(password);

        expect(classes).toContain(SATISFIED);
        expect(classes).not.toContain(NOT_SATISFIED);
    });

    it.each(ACCEPTED)("reports a valid password for a %s", (_name: string, password: string): void => {
        const { isValid, status }: ReportedStatus = getReportedStatus(password);

        expect(status.specialChr).toBe(true);
        expect(isValid).toBe(true);
    });

    it("marks the requirement as not satisfied when the password is alphanumeric only", (): void => {
        const classes: string = getSpecialCharacterIconClasses("Abcdefghijklmn12");

        expect(classes).toContain(NOT_SATISFIED);
        expect(classes).not.toContain(SATISFIED);
    });

    it("reports an invalid password when the password is alphanumeric only", (): void => {
        const { isValid, status }: ReportedStatus = getReportedStatus("Abcdefghijklmn12");

        expect(status.specialChr).toBeUndefined();
        expect(isValid).toBeFalsy();
    });

    it("honours the minimum number of special characters", (): void => {
        expect(getSpecialCharacterIconClasses("Abcdefghijklmn1£", 2)).toContain(NOT_SATISFIED);
        expect(getSpecialCharacterIconClasses("Abcdefghijklmn£€", 2)).toContain(SATISFIED);
    });

    it("does not require a special character when the policy does not ask for one", (): void => {
        const { status }: ReportedStatus = getReportedStatus("Abcdefghijklmn12", 0);

        expect(status.specialChr).toBe(true);
    });
});
