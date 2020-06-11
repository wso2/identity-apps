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

import { resolveAppLogoFilePath } from "@wso2is/core/helpers";
import { AlertInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { initializeAlertSystem } from "@wso2is/core/store";
import { I18n, LanguageChangeException, SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    Alert,
    DefaultLayout as DefaultLayoutSkeleton,
    Footer,
    Header,
    Logo,
    ProductBrand,
    ThemeContext,
    TopLoadingBar
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { System } from "react-notification-system";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Button, Image, Responsive } from "semantic-ui-react";
import { ProtectedRoute } from "../components";
import { defaultLayoutRoutes } from "../configs";
import { UIConstants } from "../constants";
import { ComponentPlaceholder } from "../extensions";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";

/**
 * Default page layout component Prop types.
 */
export interface DefaultLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Default page layout.
 *
 * @param {DefaultLayoutPropsInterface} props - Props injected to the default page layout component.
 *
 * @return {React.ReactElement}
 */
export const DefaultLayout: FunctionComponent<DefaultLayoutPropsInterface> = (
    props: DefaultLayoutPropsInterface
): ReactElement => {

    const { fluid } = props;

    const dispatch = useDispatch();

    const { t } = useTranslation();

    const { state } = useContext(ThemeContext);

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const isProfileInfoLoading: boolean = useSelector(
        (state: AppState) => state.loaders.isProfileInfoRequestLoading);
    const supportedI18nLanguages: SupportedLanguagesMeta = useSelector(
        (state: AppState) => state.global.supportedI18nLanguages);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const alert: AlertInterface = useSelector((state: AppState) => state.global.alert);
    const alertSystem: System = useSelector((state: AppState) => state.global.alertSystem);
    const isAJAXTopLoaderVisible: boolean = useSelector((state: AppState) => state.global.isAJAXTopLoaderVisible);

    const [ headerHeight, setHeaderHeight ] = useState<number>(UIConstants.DEFAULT_HEADER_HEIGHT);
    const [ footerHeight, setFooterHeight ] = useState<number>(UIConstants.DEFAULT_FOOTER_HEIGHT);
    const [ isMobileViewport, setIsMobileViewport ] = useState<boolean>(false);

    useEffect(() => {
        if (headerHeight === document.getElementById("app-header").offsetHeight) {
            return;
        }
        setHeaderHeight(document.getElementById("app-header").offsetHeight - UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT);
    }, []);

    useEffect(() => {
        if (footerHeight === document.getElementById("app-footer").offsetHeight) {
            return;
        }
        setFooterHeight(document.getElementById("app-footer").offsetHeight);
    }, []);

    /**
     * Handles the layout on change event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - On change event.
     * @param {any} width - Width of the browser window.
     */
    const handleLayoutOnUpdate = (event: SyntheticEvent<HTMLElement>, { width }): void => {
        if (width < Responsive.onlyTablet.minWidth) {
            setIsMobileViewport(true);
            return;
        }

        if (!isMobileViewport) {
            return;
        }

        setIsMobileViewport(false);
    };

    /**
     * Handles language switch action.
     *
     * @param {string} language - Selected language.
     */
    const handleLanguageSwitch = (language: string): void => {
        I18n.instance.changeLanguage(language)
            .catch((error) => {
                throw new LanguageChangeException(language, error)
            })
    };

    const handleAlertSystemInitialize = (system) => {
        dispatch(initializeAlertSystem(system));
    };

    return (
        <DefaultLayoutSkeleton
            fluid={ fluid }
            alert={ (
                <Alert
                    dismissInterval={ UIConstants.ALERT_DISMISS_INTERVAL }
                    alertsPosition="br"
                    alertSystem={ alertSystem }
                    alert={ alert }
                    onAlertSystemInitialize={ handleAlertSystemInitialize }
                    withIcon={ true }
                />
            ) }
            topLoadingBar={ (
                <TopLoadingBar
                    height={ UIConstants.AJAX_TOP_LOADING_BAR_HEIGHT }
                    visibility={ isAJAXTopLoaderVisible }
                />
            ) }
            footerHeight={ footerHeight }
            headerHeight={ headerHeight }
            desktopContentTopSpacing={ UIConstants.DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING }
            onLayoutOnUpdate={ handleLayoutOnUpdate }
            header={ (
                <Header
                    brand={ (
                        <ProductBrand
                            style={ { marginTop: 0 } }
                            logo={
                                (state.logo && state.logo !== "")
                                    ? <Image src={ state.logo } style={ { maxHeight: 25 } }/>
                                    : (
                                        <Logo
                                            className="portal-logo"
                                            image={
                                                resolveAppLogoFilePath(window[ "AppUtils" ].getConfig().ui.appLogoPath,
                                                    `${ window[ "AppUtils" ].getConfig().clientOrigin }/` +
                                                    `${ window[ "AppUtils" ].getConfig().appBase }/libs/themes/` +
                                                    state.theme)
                                            }
                                        />
                                    )
                            }
                            name={ state.productName && state.productName !== "" ?
                                state.productName
                                :
                                config.deployment.applicationName
                            }
                            version={ {
                                milestoneNumber: config.deployment.productVersion?.milestoneNumber,
                                releaseType: config.deployment.productVersion?.releaseType,
                                versionNumber: config.deployment.productVersion?.versionNumber
                            } }
                        />
                    ) }
                    brandLink={ config.deployment.appHomePath }
                    basicProfileInfo={ profileInfo }
                    fluid={ !isMobileViewport ? fluid : false }
                    isProfileInfoLoading={ isProfileInfoLoading }
                    userDropdownInfoAction={ (
                        <Button
                            size="tiny"
                            primary
                            onClick={
                                (): void => {
                                    window.open(window[ "AppUtils" ].getConfig().accountAppURL);
                                }
                            }
                        >
                            { t("common:myAccount") }
                        </Button>
                    ) }
                    userDropdownLinks={ [
                        {
                            name: t("common:logout"),
                            to: window[ "AppUtils" ].getConfig().routes.logout
                        }
                    ] }
                    profileInfo={ profileInfo }
                    showUserDropdown={ true }
                    showSidePanelToggle={ false }
                >
                    <ComponentPlaceholder section="feedback-button" type="component"/>
                </Header>
            ) }
            footer={ (
                <Footer
                    showLanguageSwitcher
                    currentLanguage={ I18n.instance?.language }
                    supportedLanguages={ supportedI18nLanguages }
                    onLanguageChange={ handleLanguageSwitch }
                    copyright={ state.copyrightText && state.copyrightText !== "" ?
                        state.copyrightText
                        :
                        config.ui.appCopyright
                            ? config.ui.appCopyright
                            : null
                    }
                    fixed="bottom"
                    fluid={ !isMobileViewport ? fluid : false }
                    links={ [
                        {
                            name: t("common:privacy"),
                            to: "/privacy"
                        }
                    ] }
                />
            ) }
        >
            <Switch>
                {
                    defaultLayoutRoutes.map((route, index) => (
                        route.redirectTo
                            ? <Redirect to={ route.redirectTo }/>
                            : route.protected
                            ? (
                                <ProtectedRoute
                                    component={ route.component ? route.component : null }
                                    path={ route.path }
                                    key={ index }
                                    exact={ route.exact }
                                />
                            )
                            : (
                                <Route
                                    path={ route.path }
                                    render={ (renderProps) =>
                                        route.component
                                            ? <route.component { ...renderProps } />
                                            : null
                                    }
                                    key={ index }
                                    exact={ route.exact }
                                />
                            )
                    ))
                }
            </Switch>
        </DefaultLayoutSkeleton>
    );
};

/**
 * Default props for the default layout.
 */
DefaultLayout.defaultProps = {
    fluid: true
};
