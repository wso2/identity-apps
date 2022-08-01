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

import { DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { AccessControlProvider } from "@wso2is/access-control";
import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { AlertLevels, RouteInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import {
    addAlert,
    setDeploymentConfigs,
    setI18nConfigs,
    setServiceResourceEndpoints,
    setUIConfigs
} from "@wso2is/core/store";
import { LocalStorageUtils } from "@wso2is/core/utils";
import {
    I18nModuleOptionsInterface
} from "@wso2is/i18n";
import {
    ChunkErrorModal,
    Code,
    DocumentationProvider,
    NetworkErrorModal,
    SessionManagementProvider,
    SessionTimeoutModalTypes
} from "@wso2is/react-components";
import has from "lodash-es/has";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { commonConfig } from "./extensions";
import { EventPublisher, PreLoader } from "./features/core";
import { ProtectedRoute } from "./features/core/components";
import { Config, DocumentationLinks, getBaseRoutes } from "./features/core/configs";
import { AppConstants } from "./features/core/constants";
import { history } from "./features/core/helpers";
import {
    ConfigReducerStateInterface,
    DeploymentConfigInterface,
    DocumentationLinksInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface,
    UIConfigInterface
} from "./features/core/models";
import { AppState, setGetOrganizationLoading, setOrganization } from "./features/core/store";
import { getOrganizations } from "./features/organizations/api";
import { OrganizationListInterface } from "./features/organizations/models";

/**
 * Main App component.
 *
 * @return {React.ReactElement}
 */
export const App: FunctionComponent<Record<string, never>> = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const userName: string = useSelector((state: AppState) => state.auth.username);
    const loginInit: boolean = useSelector((state: AppState) => state.auth.loginInit);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const theme: string = useSelector((state: AppState) => state?.config?.ui?.theme?.name);

    const [ baseRoutes, setBaseRoutes ] = useState<RouteInterface[]>(getBaseRoutes());

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const { trySignInSilently, getDecodedIDToken, signOut } = useAuthContext();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);
    const [ sessionTimedOut, setSessionTimedOut ] = useState<boolean>(false);

    /**
     * Set the value of Session Timed Out.
     */
    const handleSessionTimeOut = (timedOut: boolean): void => {
        setSessionTimedOut(timedOut);
    };

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
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
        setBaseRoutes(getBaseRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Set the application settings of the user to the local storage.
     */
    useEffect(() => {
        if (!userName || !config?.deployment?.tenant) {
            return;
        }

        const tenant = config.deployment.tenant;
        const tenantAppSettings = JSON.parse(LocalStorageUtils.getValueFromLocalStorage(tenant));
        const appSettings = {};

        appSettings[ userName ] = emptyIdentityAppsSettings();

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
     * Checks if the portal access should be granted based on the feature config.
     */
    useEffect(() => {
        if (!config?.ui?.features || !loginInit) {
            return;
        }

        if (isPortalAccessGranted<FeatureConfigInterface>(config?.ui?.features, allowedScopes)) {
            return;
        }

        if (commonConfig?.enableOrganizationAssociations) {
            /**
             * Checks if the portal access is denied due to no association.
             */
            getDecodedIDToken()
                .then((idToken: DecodedIDTokenPayload) => {

                    if(has(idToken, "associated_tenants") || isPrivilegedUser) {
                        // If there is an assocation, the user is likely unauthorized by other criteria.
                        history.push({
                            pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                            search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
                        });
                    } else {
                        // If there is no assocation, the user should be redirected to creation flow.
                        history.push({
                            pathname: AppConstants.getPaths().get("CREATE_TENANT")
                        });
                    }
                })
                .catch(() => {
                    // No need to show UI errors here.
                    // Add debug logs here one a logger is added.
                    // Tracked here https://github.com/wso2/product-is/issues/11650.
                });
        } else {
            history.push({
                pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
            });
        }
    }, [ config, loginInit ]);

    /**
     * Publish page visit when the UUID is set.
     */
    useEffect(() => {
        if (!uuid) {
            return;
        }
        eventPublisher.publish("page-visit-console-landing-page");
    }, [ uuid ]);

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
        trySignInSilently()
            .then((response) => {
                if (response === false) {
                    history.push(AppConstants.getAppLogoutPath());
                } else {
                    window.history.replaceState(null, null, window.location.pathname);
                }
            })
            .catch(() => {
                history.push(AppConstants.getAppLogoutPath());
            });
    };

    return (
        <>
            {
                (!isEmpty(config?.deployment) && !isEmpty(config?.endpoints))
                    ? (
                        <Router history={ history }>
                            <div className="container-fluid">
                                <DocumentationProvider<DocumentationLinksInterface> links={ DocumentationLinks }>
                                    <Suspense fallback={ <PreLoader /> }>
                                        <AccessControlProvider
                                            allowedScopes={ allowedScopes }
                                            featureConfig={ featureConfig }
                                        >
                                            <SessionManagementProvider
                                                onSessionTimeoutAbort={ handleSessionTimeoutAbort }
                                                onSessionLogout={ handleSessionLogout }
                                                onLoginAgain={ handleStayLoggedIn }
                                                setSessionTimedOut={ handleSessionTimeOut }
                                                sessionTimedOut={ sessionTimedOut }
                                                modalOptions={ {
                                                    description: (
                                                        <Trans
                                                            i18nKey={
                                                                "console:common.modals.sessionTimeoutModal." +
                                                                "description"
                                                            }
                                                        >
                                                            When you click on the <Code>Go back</Code> button, we
                                                            will try to recover the session if it exists. If you
                                                            don&apos;t have an active session, you will be
                                                            redirected to the login page
                                                        </Trans>
                                                    ),
                                                    headingI18nKey: "console:common.modals.sessionTimeoutModal" +
                                                        ".heading",
                                                    loginAgainButtonText: (
                                                        <Trans
                                                            i18nKey={
                                                                "console:common.modals" +
                                                                ".sessionTimeoutModal.loginAgainButton"
                                                            }>
                                                            Login again
                                                        </Trans>
                                                    ),
                                                    primaryButtonText: (
                                                        <Trans
                                                            i18nKey={
                                                                "console:common.modals" +
                                                                ".sessionTimeoutModal.primaryButton"
                                                            }>
                                                            Go back
                                                        </Trans>
                                                    ),
                                                    secondaryButtonText: (
                                                        <Trans
                                                            i18nKey={
                                                                "console:common.modals" +
                                                                ".sessionTimeoutModal.secondaryButton"
                                                            }>
                                                            Logout
                                                        </Trans>
                                                    ),
                                                    sessionTimedOutDescription: (
                                                        <Trans
                                                            i18nKey={
                                                                "console:common.modals" +
                                                                ".sessionTimeoutModal.sessionTimedOutDescription"
                                                            }>
                                                            Please log in again to continue from where you left off.
                                                        </Trans>
                                                    ),
                                                    sessionTimedOutHeadingI18nKey: "console:common.modals" +
                                                        ".sessionTimeoutModal.sessionTimedOutHeading"
                                                } }
                                                type={ SessionTimeoutModalTypes.DEFAULT }
                                            >
                                                <>
                                                    <Helmet>
                                                        <title>{ appTitle }</title>
                                                        {
                                                            (window?.themeHash && window?.publicPath && theme)
                                                                ? (
                                                                    <link
                                                                        href={
                                                                            `${
                                                                                window?.origin
                                                                            }${
                                                                                window?.publicPath
                                                                            }/libs/themes/${
                                                                                theme
                                                                            }/theme.${ window?.themeHash }.min.css`
                                                                        }
                                                                        rel="stylesheet"
                                                                        type="text/css"
                                                                    />
                                                                )
                                                                : null
                                                        }
                                                    </Helmet>
                                                    <NetworkErrorModal
                                                        heading={
                                                            (<Trans
                                                                i18nKey={ "common:networkErrorMessage.heading" }
                                                            >
                                                                Your session has expired
                                                            </Trans>)
                                                        }
                                                        description={
                                                            (<Trans
                                                                i18nKey={ "common:networkErrorMessage.description" }
                                                            >
                                                                Please try signing in again.
                                                            </Trans>)
                                                        }
                                                        primaryActionText={
                                                            (<Trans
                                                                i18nKey={
                                                                    "common:networkErrorMessage.primaryActionText"
                                                                }
                                                            >
                                                                Sign In
                                                            </Trans>)
                                                        }
                                                        primaryAction={
                                                            signOut
                                                        }
                                                    />
                                                    <ChunkErrorModal
                                                        heading={
                                                            (<Trans
                                                                i18nKey={
                                                                    "common:chunkLoadErrorMessage.heading"
                                                                }
                                                            >
                                                                Something went wrong
                                                            </Trans>)
                                                        }
                                                        description={
                                                            (<Trans
                                                                i18nKey={
                                                                    "common:chunkLoadErrorMessage.description"
                                                                }
                                                            >
                                                                An error occurred when serving the requested
                                                                application. Please try reloading the app.
                                                            </Trans>)
                                                        }
                                                        primaryActionText={
                                                            (<Trans
                                                                i18nKey={
                                                                    "common:chunkLoadErrorMessage.primaryActionText"
                                                                }
                                                            >
                                                                Reload the App
                                                            </Trans>)
                                                        }
                                                    />
                                                    <Switch>
                                                        <Redirect
                                                            exact
                                                            from="/"
                                                            to={ AppConstants.getAppHomePath() }
                                                        />
                                                        {
                                                            baseRoutes.map((route, index) => {
                                                                return (
                                                                    route.protected ?
                                                                        (
                                                                            <ProtectedRoute
                                                                                component={ route.component }
                                                                                path={ route.path }
                                                                                key={ index }
                                                                                exact={ route.exact }
                                                                            />
                                                                        )
                                                                        :
                                                                        (
                                                                            <Route
                                                                                path={ route.path }
                                                                                render={ (props) =>
                                                                                    (<route.component
                                                                                        { ...props }
                                                                                    />)
                                                                                }
                                                                                key={ index }
                                                                                exact={ route.exact }
                                                                            />
                                                                        )
                                                                );
                                                            })
                                                        }
                                                    </Switch>
                                                </>
                                            </SessionManagementProvider>
                                        </AccessControlProvider>
                                    </Suspense>
                                </DocumentationProvider>
                            </div>
                        </Router>
                    )
                    : <PreLoader />
            }
        </>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default App;
