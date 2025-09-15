/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { BasicUserInfo, DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { AccessControlProvider, AllFeatureInterface, FeatureGateInterface } from "@wso2is/access-control";
import { PreLoader } from "@wso2is/admin.core.v1/components/pre-loader";
import { ProtectedRoute } from "@wso2is/admin.core.v1/components/protected-route";
import { Config } from "@wso2is/admin.core.v1/configs/app";
import { DocumentationLinks } from "@wso2is/admin.core.v1/configs/documentation";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import { AppComponentProps } from "@wso2is/admin.core.v1/models/common";
import {
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface
} from "@wso2is/admin.core.v1/models/config";

import {
    DocumentationLinksInterface
}  from "@wso2is/admin.core.v1/models/documentation";
import {
    ConfigReducerStateInterface
} from "@wso2is/admin.core.v1/models/reducer-state";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { commonConfig } from "@wso2is/admin.extensions.v1";
import { featureGateConfig } from "@wso2is/admin.extensions.v1/configs/feature-gate";
import useGetAllFeatures from "@wso2is/admin.feature-gate.v1/api/use-get-all-features";
import { AGENT_USERSTORE_ID } from "@wso2is/admin.userstores.v1/constants/user-store-constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import UserStoresProvider from "@wso2is/admin.userstores.v1/providers/user-stores-provider";
import { AppConstants as CommonAppConstants, CommonConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { RouteInterface, StorageIdentityAppsSettingsInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import { setI18nConfigs, setServiceResourceEndpoints } from "@wso2is/core/store";
import { AuthenticateUtils, LocalStorageUtils } from "@wso2is/core/utils";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";
import {
    ChunkErrorModal,
    Code,
    DocumentationProvider,
    MediaContextProvider,
    NetworkErrorModal,
    SessionManagementProvider,
    SessionTimeoutModalTypes
} from "@wso2is/react-components";
import has from "lodash-es/has";
import isEmpty from "lodash-es/isEmpty";
import set from "lodash-es/set";
import * as moment from "moment";
import React, { ReactElement, Suspense, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Router, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import "moment/locale/si";
import "moment/locale/fr";
import { getBaseRoutes } from "./configs/routes";
import DecoratedApp from "./decorated-app";
import "./app.scss";

const Base = ({
    onAgentManagementEnableStatusChange
}: AppComponentProps) => {
    /**
     * Listen for base name changes and updated the routes.
     */
    const baseRoutes: RouteInterface[] = useMemo(() => {
        return getBaseRoutes();
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    const {
        isLoading: isUserStoresListFetchRequestLoading,
        userStoresList
    } = useUserStores();

    useEffect(() => {
        const isAgentManagementEnabledForOrg: boolean =
            userStoresList?.some((userStore: UserStoreListItem) => userStore.id === AGENT_USERSTORE_ID);

        onAgentManagementEnableStatusChange(isAgentManagementEnabledForOrg);

    }, [ userStoresList, isUserStoresListFetchRequestLoading ]);

    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to={ AppConstants.getAppHomePath() }
            />
            {
                baseRoutes.map((route: RouteInterface, index: number) => {
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
                                    render={
                                        (props:  RouteComponentProps<
                                                                                { [p: string]: string },
                                                                                StaticContext, unknown
                                                                            >) => {
                                            return (<route.component
                                                { ...props }
                                            />);
                                        }
                                    }
                                    key={ index }
                                    exact={ route.exact }
                                />
                            )
                    );
                })
            }
        </Switch>
    );
};

/**
 * Main App component.
 *
 * @returns App Root component.
 */
export const App = ({
    onAgentManagementEnableStatusChange
}: AppComponentProps): ReactElement => {
    const featureGateConfigUpdated : FeatureGateInterface = { ...featureGateConfig };

    const dispatch: Dispatch<any> = useDispatch();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const { trySignInSilently, getDecodedIDToken, signOut } = useAuthContext();

    const { setResourceEndpoints } = useResourceEndpoints();

    const userName: string = useSelector((state: AppState) => state.auth.username);
    const loginInit: boolean = useSelector((state: AppState) => state.auth.loginInit);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const theme: string = useSelector((state: AppState) => state?.config?.ui?.theme?.name);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const organizationType: string = useSelector((state: AppState) => state?.organization?.organizationType);

    const [ sessionTimedOut, setSessionTimedOut ] = useState<boolean>(false);
    const [ featureGateConfigData, setFeatureGateConfigData ] =
        useState<FeatureGateInterface | null>(featureGateConfigUpdated);

    const {
        data: allFeatures,
        error: featureGateAPIException
    } = useGetAllFeatures();

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        sessionStorageDisabled();
    }, []);

    /**
     * Set the initial locale in moment
     */
    useEffect(() => {
        moment.locale("en");
    }, []);

    /**
     * Set the deployment configs in redux state.
     */
    useEffect(() => {
        dispatch(setServiceResourceEndpoints<ServiceResourceEndpointsInterface>(Config.getServiceResourceEndpoints()));
        dispatch(setI18nConfigs<I18nModuleOptionsInterface>(Config.getI18nConfig()));
        setResourceEndpoints(Config.getServiceResourceEndpoints() as any);
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    /**
     * Set the application settings of the user to the local storage.
     */
    useEffect(() => {
        if (!userName || !config?.deployment?.tenant) {
            return;
        }

        const tenant: string = config.deployment.tenant;
        const tenantAppSettings: Record<string, unknown> = JSON.parse(
            LocalStorageUtils.getValueFromLocalStorage(tenant)
        );
        const appSettings: Record<string, StorageIdentityAppsSettingsInterface> = {};

        appSettings[ userName ] = emptyIdentityAppsSettings();

        if (!tenantAppSettings) {
            LocalStorageUtils.setValueInLocalStorage(tenant, JSON.stringify(appSettings));
        } else {
            if (CommonHelpers.lookupKey(tenantAppSettings, userName) === null) {
                const newUserSettings: Record<string, unknown> = {
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
                        // If there is an association, the user is likely unauthorized by other criteria.
                        history.push({
                            pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                            search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
                        });
                    } else {
                        // If there is no association, the user should be redirected to creation flow.
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

    useEffect(() => {
        if (allFeatures instanceof IdentityAppsApiException || featureGateAPIException) {
            return;
        }

        if (!allFeatures) {
            return;
        }

        if (allFeatures?.length > 0) {
            allFeatures.forEach((feature: AllFeatureInterface )=> {
                // converting the identifier to path.
                const path: string = feature.featureIdentifier.replace(/-/g, ".");
                // Obtain the status and set it to the feature gate config.
                const featureStatusPath: string = `${ path }.status`;

                set(featureGateConfigUpdated,featureStatusPath, feature.featureStatus);

                const featureTagPath: string = `${ path }.tags`;

                set(featureGateConfigUpdated,featureTagPath, feature.featureTags);

                setFeatureGateConfigData(featureGateConfigUpdated);
            });
        }
    }, [ allFeatures ]);

    /**
     * Set the value of Session Timed Out.
     */
    const handleSessionTimeOut = (timedOut: boolean): void => {
        setSessionTimedOut(timedOut);
    };

    /**
     * Handles session timeout abort.
     *
     * @param url - Current URL.
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
        AuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP);
        history.push(AppConstants.getAppLogoutPath());
    };

    const sessionStorageDisabled = () => {
        try {
            const storage: Storage = sessionStorage;

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
            .then((response: boolean | BasicUserInfo) => {
                if (response === false) {
                    AuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP);

                    history.push(AppConstants.getAppLogoutPath());
                } else {
                    // List of query parameters and hash fragments to remove from the URL when the silent
                    // sign-in is successful. e.g. session timeout related query params.
                    const paramsToRemove: string[] = [ CommonConstants.SESSION_TIMEOUT_WARNING_URL_SEARCH_PARAM_KEY ];
                    const hashesToRemove: string[] = [];

                    const url: URL = new URL(window.location.href);

                    paramsToRemove.forEach((param: string) => {
                        url.searchParams.delete(param);
                    });

                    let hash: string = url.hash;

                    if (hash && hash.startsWith("#")) {
                        const hashParams: URLSearchParams = new URLSearchParams(hash.substring(1));

                        hashesToRemove.forEach((param: string) => {
                            hashParams.delete(param);
                        });

                        hash = hashParams.toString() ? `#${hashParams.toString()}` : "";
                    }

                    const moderatedUrl: string = `${url.pathname}${url.search}${hash}`;

                    window.history.replaceState(window.history.state, null, moderatedUrl);
                }
            })
            .catch(() => {
                AuthenticateUtils.removeAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP);

                history.push(AppConstants.getAppLogoutPath());
            });
    };

    if (isEmpty(config?.deployment) || isEmpty(config?.endpoints)) {
        return <PreLoader/>;
    }

    return (
        <Router history={ history }>
            <DecoratedApp>
                <div className="container-fluid">
                    <DocumentationProvider<DocumentationLinksInterface> links={ DocumentationLinks }>
                        <Suspense fallback={ <PreLoader /> }>
                            <MediaContextProvider>
                                <AccessControlProvider
                                    allowedScopes={ allowedScopes }
                                    features={ featureGateConfigData }
                                    organizationType={ organizationType }
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
                                            <UserStoresProvider>
                                                <Base
                                                    onAgentManagementEnableStatusChange={
                                                        onAgentManagementEnableStatusChange
                                                    }
                                                />
                                            </UserStoresProvider>
                                        </>
                                    </SessionManagementProvider>
                                </AccessControlProvider>
                            </MediaContextProvider>
                        </Suspense>
                    </DocumentationProvider>
                </div>
            </DecoratedApp>
        </Router>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default App;
