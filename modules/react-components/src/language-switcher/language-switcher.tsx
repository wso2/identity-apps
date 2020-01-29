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
import { LanguageSwitcherDropdown } from "./language-switcher-dropdown";

/**
 * Proptypes for the language switcher component.
 */
export interface LanguageSwitcherProps {
    className?: string;
    currentLanguage: string;
    direction?: "left" | "right";
    onLanguageChange: (language: string) => void;
    supportedLanguages: object;
    upward?: boolean;
}

/**
 * Language switcher component.
 *
 * @param {React.PropsWithChildren<any>} props - Props passed in to the language switcher component.
 * @return {JSX.Element}
 */
export const LanguageSwitcher: React.FunctionComponent<LanguageSwitcherProps> = (
    props: LanguageSwitcherProps
): JSX.Element => {

    const {
        className,
        currentLanguage,
        direction,
        onLanguageChange,
        supportedLanguages,
        upward
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
            supportedLanguages={ supportedLanguages }
        />
    );
};

/**
 * Default proptypes for the language switcher component.
 */
LanguageSwitcher.defaultProps = {
    direction: "left",
    upward: true
};
