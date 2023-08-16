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
import { Dropdown, Flag, FlagNameValues } from "semantic-ui-react";
import { SupportedLanguagesInterface } from "./language-switcher";

/**
 * Proptypes for the language switcher dropdown component.
 */
export interface LanguageSwitcherDropdownProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Language chanege callback.
     * @param event - Click event.
     * @param data - Data.
     */
    changeLanguage: (event: SyntheticEvent, data: Record<string, unknown>) => void;
    /**
     * Additional CSS classes.
     */
    className: string;
    /**
     * Direction to be placed.
     */
    direction: "left" | "right";
    /**
     * Current language.
     */
    language: string;
    /**
     * Show/Hide caret icon.
     */
    showCaret?: boolean;
    /**
     * Should dropdown open upwards.
     */
    upward: boolean;
    /**
     * Set of supported languages.
     */
    supportedLanguages: SupportedLanguagesInterface;
}

/**
 * Language switcher dropdown component.
 *
 * @param props - Props passed in to the language switcher dropdown component.
 *
 * @returns the language switcher dropdown component
 */
export const LanguageSwitcherDropdown: React.FunctionComponent<LanguageSwitcherDropdownProps> = (
    props: LanguageSwitcherDropdownProps
): ReactElement => {

    const {
        direction,
        className,
        language,
        changeLanguage,
        upward,
        supportedLanguages,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const LanguageSwitcherTrigger = () => (
        <span
            className="dropdown-trigger link"
            data-componentid={ `${ componentId }-trigger` }
            data-testid={ `${ testId }-trigger` }
        >
            {
                // False alarm. `name` is declared in `SupportedLanguagesInterface`.
                /* eslint-disable-next-line react/prop-types */
                supportedLanguages[language]?.name
            }
        </span>
    );

    return (
        <Dropdown
            item
            className={ className }
            upward={ upward }
            trigger={ LanguageSwitcherTrigger() }
            direction={ direction }
            data-componentid={ componentId }
            data-testid={ testId }
            floating
        >
            <Dropdown.Menu>
                {
                    Object.values(supportedLanguages).map((lang, index) => (
                        <Dropdown.Item
                            key={ index }
                            onClick={ changeLanguage }
                            value={ lang?.code }
                            data-componentid={ `${ componentId }-language` }
                            data-testid={ `${ testId }-language` }
                        >
                            <Flag name={ lang?.flag as FlagNameValues } />
                            { lang?.name }
                        </Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
};

/**
 * Default proptypes for the language switcher dropdown component.
 */
LanguageSwitcherDropdown.defaultProps = {
    "data-componentid": "language-switcher-dropdown",
    "data-testid": "language-switcher-dropdown",
    showCaret: false
};
