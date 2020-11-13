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

import { I18n, LanguageChangeException, SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    Footer as ReusableFooter,
    FooterPropsInterface as ReusableFooterPropsInterface,
    ThemeContext
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants } from "../constants";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";

/**
 * Footer layout Prop types.
 */
type FooterPropsInterface = ReusableFooterPropsInterface;

/**
 * Implementation of the Reusable Footer component.
 *
 * @param {FooterPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const Footer: FunctionComponent<FooterPropsInterface> = (
    props: FooterPropsInterface
): ReactElement => {

    const {
        currentLanguage,
        ...rest
    } = props;

    const { state } = useContext(ThemeContext);

    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages);

    /**
     * Handles language switch action.
     *
     * @param {string} language - Selected language.
     */
    const handleLanguageSwitch = (language: string): void => {
        I18n.instance.changeLanguage(language)
            .catch((error) => {
                throw new LanguageChangeException(language, error);
            });
    };

    return (
        <ReusableFooter
            currentLanguage={ currentLanguage ?? I18n.instance?.language }
            supportedLanguages={ supportedI18nLanguages }
            onLanguageChange={ handleLanguageSwitch }
            copyright={
                (state.copyrightText && state.copyrightText !== "")
                    ? state.copyrightText
                    : config.ui.appCopyright
                        ? config.ui.appCopyright
                        : null
            }
            links={ [
                {
                    name: t("common:privacy"),
                    to: AppConstants.getPaths().get("PRIVACY")
                }
            ] }
            { ...rest }
        />
    );
};

/**
 * Default props for the component.
 */
Footer.defaultProps = {
    fixed: "bottom",
    fluid: true,
    showLanguageSwitcher: true
};
