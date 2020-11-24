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

import { TestableComponentInterface } from "@wso2is/core/models";
import { I18n, SupportedLanguagesMeta } from "@wso2is/i18n";
import React, { SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import { LanguageSwitcherDropdown } from "./language-switcher-dropdown";
import { setMomentJSLocale } from "../../../configs";
import { AppState } from "../../../store";

/**
 * Proptypes for the language switcher component.
 * Also see {@link LanguageSwitcher.defaultProps}
 */
interface LanguageSwitcherProps extends TestableComponentInterface {
    className?: string;
    direction?: "left" | "right";
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
        direction,
        className,
        upward,
        ["data-testid"]: testId
    } = props;

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages
    );
    const currentLang = I18n.instance.languages[0];

    /**
     * Handles the language change.
     *
     * @param {React.SyntheticEvent} event - Click event.
     * @param data - data object returned from the dropdown item.
     */
    const handleLanguageChange = (event: SyntheticEvent, data: any) => {
        setMomentJSLocale(data.value);
        I18n.instance.changeLanguage(data.value);
    };

    return (
        <LanguageSwitcherDropdown
            data-testid={ `${testId}-dropdown` }
            className={ className }
            direction={ direction }
            upward={ upward }
            language={ currentLang }
            changeLanguage={ handleLanguageChange }
            supportedLanguages={ supportedI18nLanguages }
        />
    );

};

/**
 * Default proptypes for the language switcher component.
 * See type definitions in {@link LanguageSwitcherProps}
 */
LanguageSwitcher.defaultProps = {
    "data-testid": "language-switcher",
    direction: "left",
    upward: true
};
