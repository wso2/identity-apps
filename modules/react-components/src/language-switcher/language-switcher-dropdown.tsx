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

import React, { SyntheticEvent } from "react";
import { Dropdown, Flag, FlagNameValues } from "semantic-ui-react";

/**
 * Proptypes for the language switcher dropdown component.
 */
export interface LanguageSwitcherDropdownProps {
    changeLanguage: (event: SyntheticEvent, data: object) => void;
    className: string;
    direction: "left" | "right";
    language: string;
    upward: boolean;
    supportedLanguages: object;
}

/**
 * Language switcher dropdown component.
 *
 * @param {LanguageSwitcherDropdownProps} props - Props passed in to the language switcher dropdown component.
 * @return {JSX.Element}
 * @constructor
 */
export const LanguageSwitcherDropdown: React.FunctionComponent<LanguageSwitcherDropdownProps> = (
    props: LanguageSwitcherDropdownProps
): JSX.Element => {
    const { direction, className, language, changeLanguage, upward, supportedLanguages } = props;

    const LanguageSwitcherTrigger = () => (
        <span className="dropdown-trigger link">{ supportedLanguages[language]?.name }</span>
    );

    return (
        <Dropdown
            item
            className={ className }
            upward={ upward }
            trigger={ LanguageSwitcherTrigger() }
            direction={ direction }
            floating
        >
            <Dropdown.Menu>
                {
                    Object.values(supportedLanguages).map((lang, index) => (
                        <Dropdown.Item key={ index } onClick={ changeLanguage } value={ lang?.code }>
                            <Flag name={ lang?.flag as FlagNameValues } />
                             { lang?.name }
                        </Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
};
