/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement, SyntheticEvent } from "react";
import { FlagNameValues } from "semantic-ui-react";
import { LanguageSwitcherDropdown } from "./language-switcher-dropdown";

/**
 * Proptypes for the language switcher component.
 */
export interface LanguageSwitcherProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Current language.
     */
    currentLanguage: string;
    /**
     * Direction to be placed.
     */
    direction?: "left" | "right";
    /**
     * Language change callback.
     * @param {string} language - Changed language.
     */
    onLanguageChange: (language: string) => void;
    /**
     * Show/Hide dropdown caret icon.
     */
    showDropdownCaret?: boolean;
    /**
     * Set of supported languages.
     */
    supportedLanguages: SupportedLanguagesInterface;
    /**
     * Should dropdown open upwards.
     */
    upward?: boolean;
}

/**
 * Interface for the Supported Languages.
 */
export interface SupportedLanguagesInterface {

    [ key: string ]: {
        /**
         * Country Code.
         */
        code: string
        /**
         * Country Flag.
         */
        flag?: FlagNameValues;
        /**
         * Country Name.
         */
        name: string;
        /**
         * Dynamic values.
         */
        [ key: string ]: any;
    }
}

/**
 * Language switcher component.
 *
 * @param {React.PropsWithChildren<any>} props - Props passed in to the language switcher component.
 *
 * @return {React.ReactElement}
 */
export const LanguageSwitcher: React.FunctionComponent<LanguageSwitcherProps> = (
    props: LanguageSwitcherProps
): ReactElement => {

    const {
        className,
        currentLanguage,
        direction,
        onLanguageChange,
        showDropdownCaret,
        supportedLanguages,
        upward,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    /**
     * Handles the language change.
     *
     * @param {React.SyntheticEvent} event - Click event.
     * @param data - data object returned from the dropdown item.
     */
    const handleLanguageChange = (event: SyntheticEvent, data: any) => {
        onLanguageChange(data.value);
    };

    return (
        <LanguageSwitcherDropdown
            className={ className }
            direction={ direction }
            upward={ upward }
            language={ currentLanguage }
            changeLanguage={ handleLanguageChange }
            showCaret={ showDropdownCaret }
            supportedLanguages={ supportedLanguages }
            data-componentid={ componentId }
            data-testid={ testId }
        />
    );
};

/**
 * Default proptypes for the language switcher component.
 */
LanguageSwitcher.defaultProps = {
    "data-componentid": "language-switcher",
    "data-testid": "language-switcher",
    direction: "left",
    showDropdownCaret: false,
    upward: true
};
