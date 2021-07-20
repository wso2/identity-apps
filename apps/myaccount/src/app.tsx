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

import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { RouteInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import {
    setDeploymentConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setUIConfigs
} from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import { I18n, I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    ChunkErrorModal,
    Code,
    ContentLoader,
    NetworkErrorModal,
    SessionManagementProvider,
    SessionTimeoutModalTypes
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { I18nextProvider, Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from "./components";
import { Config, getAppRoutes } from "./configs";
import { AppConstants } from "./constants";
import { history } from "./helpers";
import {
    ConfigReducerStateInterface,
    DeploymentConfigInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./models";
import { AppState } from "./store";
import { initializeAuthentication } from "./store/actions";
import { EventPublisher, filterRoutes } from "./utils";

/**
 * Main App component.
 *
 * @return {React.Element}
 */
export const App = (): ReactElement => {

    const dispatch = useDispatch();

    const userName: string = useSelector((state: AppState) => state.authenticationInformation.username);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const loginInit: boolean = useSelector((state: AppState) => state.authenticationInformation.loginInit);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);
    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const UUID: string = useSelector((state: AppState) => state.authenticationInformation.profileInfo.id);

    const [ appRoutes, setAppRoutes ] = useState<RouteInterface[]>(getAppRoutes());
    
    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        dispatch(initializeAuthentication());
        sessionStorageDisabled();
    }, []);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        dispatch(setDeploymentConfigs<DeploymentConfigInterface>(Config.getDeploymentConfig()));
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        dispatch(setUIConfigs<UIConfigInterface>(Config.getUIConfig()));
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Listen for base name changes and updated the routes.
     */
    useEffect(() => {
        setAppRoutes(getAppRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Checks if the portal access should be granted based on the feature config.
     */
    useEffect(() => {
        if (!config?.ui?.features || !loginInit) {
            return;
        }

        if (isPortalAccessGranted<FeatureConfigInterface>(config?.ui?.features, allowedScopes)) {
            return;
        }

        history.push(AppConstants.getPaths().get("UNAUTHORIZED"));
    }, [ loginInit, allowedScopes, config ]);

    /**
     * Set the application settings of the user to the local storage.
     */
    useEffect(() => {
        if (!userName && userName === "") {
            return;
        }

        const tenant = config?.deployment?.tenant;
        const tenantAppSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenant));
        const appSettings = {};

        appSettings[userName] = emptyIdentityAppsSettings();

        if (!tenantAppSettings) {
            LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(appSettings));
        } else {
            if (CommonHelpers.lookupKey(tenantAppSettings, userName) === null) {
                const newUserSettings = {
                    ...tenantAppSettings,
                    [ userName ]: emptyIdentityAppsSettings()
                };
                LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(newUserSettings));
            }
        }

    }, [ config?.deployment?.tenant, userName ]);
    
    /**
    * Publish page visit when the UUID is set.
    */
    useEffect(() => {
        if(!UUID) {
            return;
        }

        eventPublisher.publish("page-visit-myaccount-landing-page");
    }, [UUID]);

    /**
     * Handles session timeout abort.
     *
     * @param {URL} url - Current URL.
     */
    const handleSessionTimeoutAbort = (url: URL): void => {
        history.push({
            pathname: url.pathname,
            search: url.search
        });
    };

    /**
     * Handles session logout.
     */
    const handleSessionLogout = (): void => {
        history.push(AppConstants.getAppLogoutPath());
    };

    const sessionStorageDisabled = () => {
        try {
            const storage = sessionStorage;
            if (!storage && location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")) {
                history.push(AppConstants.getPaths().get("STORING_DATA_DISABLED"));
            }
        } catch {
            if (true && location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")) {
                history.push(AppConstants.getPaths().get("STORING_DATA_DISABLED"));
            }
        }
    };

    /**
     * Handles the `stay logged in` option of the session management modal.
     * Sets a URL search param to notify the session management iframe to
     * do the necessary actions.
     */
    const handleStayLoggedIn = (): void => {

        const urlSearchParams: URLSearchParams = new URLSearchParams();
        urlSearchParams.set("stay_logged_in", "true");

        history.push({
            pathname: window.location.pathname,
            search: urlSearchParams.toString()
        });

        dispatchEvent(new PopStateEvent("popstate", {
            state: {
                stayLoggedIn: true
            }
        }));
    };

    return (
        <>
            {
                (!isEmpty(config?.deployment) && !isEmpty(config?.endpoints))
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <I18nextProvider i18n={ I18n.instance }>
                                    <Suspense fallback={ <ContentLoader dimmer/> }>
                                        <SessionManagementProvider
                                            onSessionTimeoutAbort={ handleSessionTimeoutAbort }
                                            onSessionLogout={ handleSessionLogout }
                                            onLoginAgain={ handleStayLoggedIn }
                                            modalOptions={ {
                                                description: (
                                                    <Trans
                                                        i18nKey={
                                                            "myAccount:common.modals.sessionTimeoutModal.description"
                                                        }
                                                    >
                                                        When you click on the <Code>Go back</Code> button, we will
                                                        try to recover the session if it exists. If you don&apos;t
                                                        have an active session, you will be redirected to the login
                                                        page
                                                    </Trans>
                                                ),
                                                headingI18nKey: "myAccount:common.modals.sessionTimeoutModal.heading",
                                                loginAgainButtonText: I18n.instance.t("myAccount:common:modals" +
                                                    ".sessionTimeoutModal.loginAgainButton"),
                                                primaryButtonText: I18n.instance.t("myAccount:modals." +
                                                    "sessionTimeoutModal.primaryButton"),
                                                secondaryButtonText: I18n.instance.t("myAccount:common.modals" +
                                                    ".sessionTimeoutModal.secondaryButton"),
                                                sessionTimedOutDescription: I18n.instance.t("myAccount:common:" +
                                                    "modals.sessionTimeoutModal.sessionTimedOutDescription"),
                                                sessionTimedOutHeadingI18nKey: "myAccount:common:modals" +
                                                    ".sessionTimeoutModal.sessionTimedOutHeading"
                                            } }
                                            type={ SessionTimeoutModalTypes.DEFAULT }
                                        >
                                            <>
                                                <Helmet>
                                                    <title>{ appTitle }</title>
                                                </Helmet>
                                                <NetworkErrorModal
                                                    heading={ I18n.instance.t("common:networkErrorMessage.heading") }
                                                    description={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".description") }
                                                    primaryActionText={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".primaryActionText") }
                                                />
                                                <ChunkErrorModal
                                                    heading={ I18n.instance.t("common:networkErrorMessage.heading") }
                                                    description={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".description") }
                                                    primaryActionText={ I18n.instance.t("common:networkErrorMessage" +
                                                        ".primaryActionText") }
                                                />
                                                <Switch>
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getPaths().get("ROOT") }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getAppBasePath() }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    <Redirect
                                                        exact={ true }
                                                        path={ AppConstants.getTenantQualifiedAppBasePath() }
                                                        to={ AppConstants.getAppLoginPath() }
                                                    />
                                                    {
                                                        config
                                                            ? filterRoutes(appRoutes, config)
                                                                .map((route, index) => {
                                                                    return (
                                                                        route.protected ?
                                                                            (
                                                                                <ProtectedRoute
                                                                                    component={ route.component }
                                                                                    path={ route.path }
                                                                                    key={ index }
                                                                                    route={ route }
                                                                                    exact={ route.exact }
                                                                                />
                                                                            )
                                                                            :
                                                                            (
                                                                                <Route
                                                                                    path={ route.path }
                                                                                    render={ (props) => (
                                                                                        <route.component
                                                                                            { ...props }
                                                                                        />
                                                                                    ) }
                                                                                    key={ index }
                                                                                    exact={ route.exact }
                                                                                />
                                                                            )
                                                                    );
                                                                })
                                                            : null
                                                    }
                                                </Switch>
                                            </>
                                        </SessionManagementProvider>
                                    </Suspense>
                                </I18nextProvider>
                            </div>
                        </Router>
                    )
                    : <ContentLoader dimmer/>
            }
        </>
    );
};
