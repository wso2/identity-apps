/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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
import { CookieStorageUtils } from "@wso2is/core/utils";
import { useThemeProvider } from "@wso2is/common.branding.v1/hooks/use-theme-provider";
import { I18n, LanguageChangeException, SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    FooterLinkInterface,
    Footer as ReusableFooter,
    FooterPropsInterface as ReusableFooterPropsInterface
} from "@wso2is/react-components";
import * as moment from "moment";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
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

    const { organizationDetails } = useThemeProvider();

    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    useEffect(() => {
        const localeCookie: string = CookieStorageUtils.getItem("ui_lang");

        if (localeCookie) {
            handleLanguageSwitch(localeCookie.replace("_", "-"));
        }
    }, []);

    /**
     * Handles language switch action.
     * @param language - Selected language.
     */
    const handleLanguageSwitch = (language: string): void => {
        moment.locale(language ?? "en");
        I18n.instance.changeLanguage(language)
            .catch((error: string | Record<string, unknown>) => {
                throw new LanguageChangeException(language, error);
            });

        const cookieSupportedLanguage: string = language.replace("-", "_");
        const domain: string = ";domain=" + extractDomainFromHost();
        const cookieExpiryTime: number = 30;
        const expires: string = "; expires=" + new Date().setTime(cookieExpiryTime * 24 * 60 * 60 * 1000);
        const cookieString: string = "ui_lang=" + (cookieSupportedLanguage || "")  + expires + domain + "; path=/";

        CookieStorageUtils.setItem(cookieString);
    };

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     *
     * @returns current domain
     */
    const extractDomainFromHost = (): string => {

        let domain: string = undefined;

        /**
         * Extract the domain from the hostname.
         * Ex: If console.wso2-is.com is parsed, `wso2-is.com` will be set as the domain.
         */
        try {
            const hostnameTokens: string[] = window.location.hostname.split(".");

            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length - 2), hostnameTokens.length).join(".");
            }
        } catch (e) {
            // Couldn't parse the hostname. Log the error in debug mode.
            // Tracked here https://github.com/wso2/product-is/issues/11650.
        }

        return domain;
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
            copyright={ organizationDetails?.copyrightText ?? config.ui.copyrightText }
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
