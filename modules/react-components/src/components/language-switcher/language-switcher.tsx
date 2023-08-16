/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
     * @param language - Changed language.
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
 * @param props - Props passed in to the language switcher component.
 *
 * @returns the language switcher component.
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
     * @param event - Click event.
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
