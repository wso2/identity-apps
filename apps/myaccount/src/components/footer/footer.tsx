/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { I18n, LanguageChangeException, SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    FooterLinkInterface,
    Footer as ReusableFooter,
    FooterPropsInterface as ReusableFooterPropsInterface
} from "@wso2is/react-components";
import * as moment from "moment";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppConstants } from "../../constants";
import { ConfigReducerStateInterface } from "../../models";
import { AppState } from "../../store";

/**
 * Footer component prop types.
 * Also see {@link Footer.defaultProps}
 */
interface FooterProps extends ReusableFooterPropsInterface, TestableComponentInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Footer component.
 *
 * @param props - Props supplied to the footer component.
 * @returns App Footer.
 */
export const Footer: FunctionComponent<FooterProps> = (props: FooterProps): ReactElement => {

    const {
        ["data-testid"]: testId,
        ...rest
    } = props;

    const { t } = useTranslation();

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Handles language switch action.
     * @param language - Selected language.
     */
    const handleLanguageSwitch = (language: string): void => {
        moment.locale(language ?? "en");
        I18n.instance.changeLanguage(language)
            .catch((error) => {
                throw new LanguageChangeException(language, error);
            });
    };

    /**
     * Generates the links to be displayed on the footer.
     *
     * @returns Footer links.
     */
    const generateFooterLinks = (): FooterLinkInterface[] => {

        const links: FooterLinkInterface[] = [];

        if (config.ui?.privacyPolicyConfigs?.visibleOnFooter) {
            links.push({
                name: t("common:privacy"),
                to: AppConstants.getPaths().get("PRIVACY")
            });
        }

        return links;
    };

    return (
        <ReusableFooter
            data-testid={ testId }
            showLanguageSwitcher={ config.ui.i18nConfigs?.showLanguageSwitcher ?? true }
            currentLanguage={ I18n.instance?.language }
            supportedLanguages={ supportedI18nLanguages }
            onLanguageChange={ handleLanguageSwitch }
            copyright={
                config.ui.copyrightText
                    ? config.ui.copyrightText
                    : null
            }
            fixed="bottom"
            links={ generateFooterLinks() }
            { ...rest }
        />
    );
};

/**
 * Default prop-types for the {@link Footer} component.
 * See type definitions in {@link FooterProps}
 */
Footer.defaultProps = {
    "data-testid": "app-footer",
    fluid: true
};
