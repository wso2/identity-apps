/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Dropdown } from "semantic-ui-react";
import { i18n } from "../../configs";

/**
 * Proptypes for the edit section component.
 */
interface LanguageSwitcherProps {
    className?: string;
    direction?: "left" | "right";
    upward?: boolean;
}

/**
 * Language switcher component.
 *
 * @param {React.PropsWithChildren<any>} props
 * @return {JSX.Element}
 */
export const LanguageSwitcher: React.FunctionComponent<LanguageSwitcherProps> = (
    props: LanguageSwitcherProps
): JSX.Element => {
    const { direction, className, upward } = props;
    const currentLang = i18n.language;

    const resolveLangDisplayName = (): string => {
        switch (currentLang) {
            case "en":
                return "English";
            case "en-GB":
                return "English";
            case "en-US":
                return "English";
            case "pt":
                return "Portuguese";
            default:
                return currentLang;
        }
    };

    const handleLanguageChange = (event: SyntheticEvent, data: any) => {
        i18n.changeLanguage(data.value, () => {
            window.location.reload();
        });
    };

    return (
        <LanguageSwitcherDropdown
            className={ className }
            direction={ direction }
            upward={ upward }
            language={ resolveLangDisplayName() }
            changeLanguage={ handleLanguageChange }
        />
    );
};

const LanguageSwitcherTrigger = (language: string) => (
    <span className="dropdown-trigger link">{ language }</span>
);

/**
 * Proptypes for the edit section component.
 */
interface LanguageSwitcherDropdownProps {
    changeLanguage: (event: SyntheticEvent, data: object) => void;
    className: string;
    direction: "left" | "right";
    language: string;
    upward: boolean;
}

export const LanguageSwitcherDropdown: React.FunctionComponent<LanguageSwitcherDropdownProps> = (
    props: LanguageSwitcherDropdownProps
): JSX.Element => {
    const { direction, className, language, changeLanguage, upward } = props;
    const supportedLang = [
        {
            display: "English",
            flag: "gb",
            value: "en"
        },
        {
            display: "Portuguese",
            flag: "pt",
            value: "pt"
        }
    ];
    return (
        <Dropdown
            item
            className={ className }
            upward={ upward }
            trigger={ LanguageSwitcherTrigger(language) }
            icon={ null }
            direction={ direction }
            floating
        >
            <Dropdown.Menu>
                {
                    supportedLang.map((lang, index) => (
                        <Dropdown.Item key={ index } onClick={ changeLanguage } value={ lang.value }>
                            { lang.display }
                        </Dropdown.Item>
                    ))
                }
            </Dropdown.Menu>
        </Dropdown>
    );
};

LanguageSwitcher.defaultProps = {
    direction: "left",
    upward: true
};
