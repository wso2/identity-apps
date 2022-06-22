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
import { Dropdown, Flag, FlagNameValues } from "semantic-ui-react";
import { SupportedLanguagesInterface } from "./language-switcher";

/**
 * Proptypes for the language switcher dropdown component.
 */
export interface LanguageSwitcherDropdownProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Language chanege callback.
     * @param {React.SyntheticEvent} event - Click event.
     * @param {DropdownItemProps} data - Data.
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
 * @param {LanguageSwitcherDropdownProps} props - Props passed in to the language switcher dropdown component.
 *
 * @return {React.ReactElement}
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
