/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { AppConstants as CommonAppConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { CommonHelpers, isPortalAccessGranted } from "@wso2is/core/helpers";
import { RouteInterface, StorageIdentityAppsSettingsInterface, emptyIdentityAppsSettings } from "@wso2is/core/models";
import { setI18nConfigs, setServiceResourceEndpoints } from "@wso2is/core/store";
import { AuthenticateUtils, LocalStorageUtils } from "@wso2is/core/utils";
import useAuthorization from "@wso2is/features/admin.authorization.v1/hooks/use-authorization";
import { EventPublisher, PreLoader } from "@wso2is/features/admin.core.v1";
import { ProtectedRoute } from "@wso2is/features/admin.core.v1/components";
import { Config, DocumentationLinks, getBaseRoutes } from "@wso2is/features/admin.core.v1/configs";
import { AppConstants } from "@wso2is/features/admin.core.v1/constants";
import { history } from "@wso2is/features/admin.core.v1/helpers";
import useResourceEndpoints from "@wso2is/features/admin.core.v1/hooks/use-resource-endpoints";
import {
    ConfigReducerStateInterface,
    DocumentationLinksInterface,
    FeatureConfigInterface,
    ServiceResourceEndpointsInterface
} from "@wso2is/features/admin.core.v1/models";
import { AppState, store } from "@wso2is/features/admin.core.v1/store";
import { commonConfig } from "@wso2is/features/admin.extensions.v1";
import { useGetAllFeatures } from "@wso2is/features/admin.extensions.v1/components/feature-gate/api/feature-gate";
import { featureGateConfig } from "@wso2is/features/admin.extensions.v1/configs/feature-gate";
import { OrganizationUtils } from "@wso2is/features/admin.organizations.v1/utils";
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
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Trans } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Router, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import "moment/locale/si";
import "moment/locale/fr";

/**
 * Main App component.
 *
 * @returns App Root component.
 */
export const App: FunctionComponent<Record<string, never>> = (): ReactElement => {
    const featureGateConfigUpdated : FeatureGateInterface = { ...featureGateConfig };

    const dispatch: Dispatch<any> = useDispatch();

    const userName: string = useSelector((state: AppState) => state.auth.username);
    const loginInit: boolean = useSelector((state: AppState) => state.auth.loginInit);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const theme: string = useSelector((state: AppState) => state?.config?.ui?.theme?.name);
    const organizationType: string = useSelector((state: AppState) => state?.organization?.organizationType);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const { trySignInSilently, getDecodedIDToken, signOut, state } = useAuthContext();
    const { setResourceEndpoints } = useResourceEndpoints();
    const { legacyAuthzRuntime }  = useAuthorization();

    const [ baseRoutes, setBaseRoutes ] = useState<RouteInterface[]>(getBaseRoutes());
    const [ sessionTimedOut, setSessionTimedOut ] = useState<boolean>(false);
    const [ orgId, setOrgId ] = useState<string>();
    const [ featureGateConfigData, setFeatureGateConfigData ] =
        useState<FeatureGateInterface | null>(featureGateConfigUpdated);

    const {
        data: allFeatures,
        error: featureGateAPIException
    } = useGetAllFeatures(orgId, state.isAuthenticated);

    useEffect(() => {
        if(state.isAuthenticated) {
            if (OrganizationUtils.isSuperOrganization(store.getState().organization.organization)
            || store.getState().organization.isFirstLevelOrganization) {
                getDecodedIDToken().then((response: DecodedIDTokenPayload)=>{
                    const orgName: string = response.org_name;
                    // Set org_name instead of org_uuid as the API expects org_name
                    // as it resolves tenant uuid from it.

                    setOrgId(orgName);
                });
            } else {
                // Set the sub org id to the current organization id.
                setOrgId(store.getState().organization.organization.id);
            }
        }
    }, [ state ]);

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
                    window.history.replaceState(null, null, window.location.pathname);
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
            <div className="container-fluid">
                <DocumentationProvider<DocumentationLinksInterface> links={ DocumentationLinks }>
                    <Suspense fallback={ <PreLoader /> }>
                        <MediaContextProvider>
                            <AccessControlProvider
                                allowedScopes={ allowedScopes }
                                features={ featureGateConfigData }
                                isLegacyRuntimeEnabled={ legacyAuthzRuntime }
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
                                    </>
                                </SessionManagementProvider>
                            </AccessControlProvider>
                        </MediaContextProvider>
                    </Suspense>
                </DocumentationProvider>
            </div>
        </Router>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default App;
