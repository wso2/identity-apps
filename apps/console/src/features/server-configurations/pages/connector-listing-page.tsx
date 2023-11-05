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

import { 
    ArrowLoopRightUserIcon, 
    CircleUserIcon,
    GearIcon,
    HexagonTwoIcon, 
    PadlockAsteriskIcon, 
    ShieldCheckIcon,
    UserDatabaseIcon,
    UserPlusIcon,
    VerticleFilterBarsIcon
} from "@oxygen-ui/react-icons";
import Grid from "@oxygen-ui/react/Grid";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import camelCase from "lodash-es/camelCase";
import lowerCase from "lodash-es/lowerCase";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Placeholder, Ref } from "semantic-ui-react";
import UsernameValidationIcon from "../../../extensions/assets/images/icons/username-validation-icon.svg";
import { serverConfigurationConfig } from "../../../extensions/configs/server-configuration";
import { AppConstants, AppState, FeatureConfigInterface, history, store } from "../../core";
import { PrivateKeyJWTConfig } from "../../private-key-jwt/pages/private-key-jwt-config";
import { ValidationConfigPage } from "../../validation/pages/validation-config";
import { getConnectorCategories, getConnectorCategory } from "../api";
import { ServerConfigurationsConstants } from "../constants";
import {
    GovernanceConnectorCategoryInterface,
    GovernanceConnectorInterface
} from "../models";
import AdminAdvisoryBannerSection from "../settings/admin-advisory-banner-section";
import { EditConnector } from "../settings/edit-connector";
import { SettingsSection } from "../settings/settings-section";

/**
 * Props for the Server Configurations page.
 */
type ConnectorListingPageInterface = TestableComponentInterface;

/**
 * `GovernanceConnectorInterface` type with `ref` attr.
 */
type GovernanceConnectorWithRef = GovernanceConnectorInterface & ReferableComponentInterface<HTMLDivElement>;

/**
 * Governance connector listing page.
 *
 * @param props - Props injected to the component.
 * @returns Governance connector listing page component.
 */
export const ConnectorListingPage: FunctionComponent<ConnectorListingPageInterface> = (
    props: ConnectorListingPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const dispatch: Dispatch = useDispatch();
    const pageContextRef: MutableRefObject<any> = useRef(null);

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const [ connectorCategories, setConnectorCategories ] = useState<GovernanceConnectorCategoryInterface[]>([]);
    const [ connectors, setConnectors ] = useState<GovernanceConnectorWithRef[]>([]);
    const [ selectedConnector, setSelectorConnector ] = useState<GovernanceConnectorWithRef>(null);
    const [ isConnectorCategoryLoading, setConnectorCategoryLoading ] = useState<boolean>(true);

    useEffect(() => {

        // If Governance Connector read permission is not available, prevent from trying to load the connectors.
        if (!hasRequiredScopes(featureConfig?.governanceConnectors,
            featureConfig?.governanceConnectors?.scopes?.read,
            allowedScopes)) {

            return;
        }

        getConnectorCategories()
            .then((response: GovernanceConnectorInterface[]) => {

                const connectorCategoryArray: GovernanceConnectorCategoryInterface[] = [];

                // Add session management category to the connector categories.
                if (featureConfig?.sessionManagement?.enabled) {
                    connectorCategoryArray.push({
                        id: ServerConfigurationsConstants.SESSION_MANAGEMENT_CONNECTOR,
                        name: t("console:sessionManagement.title") ,
                        route: AppConstants.getPaths().get("SESSION_MANAGEMENT")
                    });
                }

                // Add SAML2 SSO category to the connector categories.
                if (featureConfig?.saml2Configuration?.enabled) {
                    connectorCategoryArray.push({
                        id: ServerConfigurationsConstants.SAML2_SSO_CONNECTOR,
                        name: t("console:saml2Config.title"),
                        route: AppConstants.getPaths().get("SAML2_CONFIGURATION")
                    });
                }

                // Add WS Federation category to the connector categories.
                if (featureConfig?.wsFedConfiguration?.enabled) {
                    connectorCategoryArray.push({
                        id: ServerConfigurationsConstants.WS_FEDERATION_CONNECTOR,
                        name: t("console:wsFederationConfig.title"),
                        route: AppConstants.getPaths().get("WSFED_CONFIGURATION")
                    });
                }

                connectorCategoryArray.push(...response?.filter((category: GovernanceConnectorCategoryInterface) => {
                    return serverConfigurationConfig.connectorCategoriesToShow.includes(category.id); 
                }));

                setConnectorCategories(connectorCategoryArray);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    store.dispatch(addAlert({
                        description: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                        "getConnectorCategories.error.description", 
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                        "getConfigurations.error.message")
                    }));
                } else {
                    // Generic error message
                    store.dispatch(addAlert({
                        description: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                        "getConfigurations.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:manage.features.governanceConnectors.notifications." +
                        "getConfigurations.genericError.message")
                    }));
                }
            });
    }, []);

    useEffect(() => {
        connectorCategories?.forEach((connectorCategory: GovernanceConnectorCategoryInterface) => {
            !serverConfigurationConfig.customConnectors.includes(connectorCategory.id)
            && loadCategoryConnectors(connectorCategory.id);
        });
    }, [ connectorCategories ]);

    const loadCategoryConnectors = (categoryId: string): void => {
        setConnectorCategoryLoading(true);

        getConnectorCategory(categoryId)
            .then((response: GovernanceConnectorCategoryInterface) => {

                response?.connectors.map((connector: GovernanceConnectorWithRef) => {
                    connector.categoryId = categoryId;
                    connector.ref = React.createRef();
                });

                setConnectors((connectors: GovernanceConnectorWithRef[]) => [
                    ...connectors, ...response?.connectors as GovernanceConnectorWithRef[]
                ]);
                !selectedConnector && setSelectorConnector(response.connectors[ 0 ] as GovernanceConnectorWithRef);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.governanceConnectors.notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setConnectorCategoryLoading(false);
            });
    };

    /**
     * This function returns loading placeholders.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        const placeholders: ReactElement[] = [];

        for (let loadedPlaceholders: number = 0; loadedPlaceholders <= 1; loadedPlaceholders++) {
            placeholders.push(
                <Grid xs={ 12 } lg={ 6 } key={ loadedPlaceholders }>
                    <div
                        className="ui card fluid settings-card"
                        data-testid={ `${testId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section placeholder">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                            </div>
                        </div>
                        <div className="content extra extra-content">
                            <div className="action-button">
                                <Placeholder>
                                    <Placeholder.Line length="very short" />
                                </Placeholder>
                            </div>
                        </div>
                    </div>
                </Grid>
            );
        }

        return (
            <Grid container rowSpacing={ 2 } columnSpacing={ { md: 3, sm: 2, xs: 1 } }>
                { placeholders }
            </Grid>
        );
    };

    const handleConnectorCategoryAction = (connectorCategory: GovernanceConnectorCategoryInterface) => {        
        if (serverConfigurationConfig.customConnectors.includes(connectorCategory?.id)) {
            history.push(connectorCategory?.route);
        } else {
            history.push(AppConstants.getPaths().get("GOVERNANCE_CONNECTORS")
                .replace(":id", connectorCategory?.id)
            );
        }
    };

    /**
     * Handle connector advance setting selection.
     */
    const handleSelection = (): void => {
        history.push(AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"));
    };
    
    const handleAlternativeLoginIdentifierSelection = (): void => {
        history.push(AppConstants.getPaths().get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"));
    };

    const resolveConnectorCategoryIcon = (id : string): ReactElement => {
        switch (id) {
            case ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID:
                return (
                    <PadlockAsteriskIcon className="icon" />
                );
            case ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID:
                return (
                    <UserPlusIcon className="icon" />
                );
            case ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID:
                return (
                    <HexagonTwoIcon className="icon" />
                );
            case ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID:
                return (
                    <VerticleFilterBarsIcon className="icon" />
                );
            case ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID:
                return (
                    <CircleUserIcon className="icon" />
                );
            case ServerConfigurationsConstants.MFA_CONNECTOR_CATEGORY_ID:
                return (
                    <ShieldCheckIcon className="icon" />
                );
            case ServerConfigurationsConstants.SESSION_MANAGEMENT_CONNECTOR:
                return (
                    <UserDatabaseIcon className="icon" />
                );
            default:
                return <GearIcon className="icon" />;
        }
    };

    const handleMultiAttributeLoginAction = () => {        
        history.push(AppConstants.getPaths().get("MULTI_ATTRIBUTE_LOGIN"));
    };

    /**
     * TODO: Remove this once the response name is fixed from the backend.
     */
    const resolveConnectorCategoryTitle = (connectorCategory : GovernanceConnectorCategoryInterface): string => {
        switch (connectorCategory.id) {
            case ServerConfigurationsConstants.MFA_CONNECTOR_CATEGORY_ID:
                return (
                    t("console:manage.features.governanceConnectors.connectorCategories.multiFactorAuthenticators." +
                    "friendlyName")
                );
            default:
                return connectorCategory.name;
        }
    };

    /**
     * Get connector categories which generate the connector forms dynamically.
     */
    const getDynamicCategoryConnectors = (): ReactElement[] => {

        // This sorting is done to move Other Settings to the end of the list. This implementation can be removed
        // once the response if sorted from the backend.
        let sortedConnectorCategories: GovernanceConnectorCategoryInterface[] = [];

        if (connectorCategories && Array.isArray(connectorCategories) && connectorCategories.length > 0) {

            sortedConnectorCategories = [ ...connectorCategories ];

            sortedConnectorCategories.push(sortedConnectorCategories.splice(sortedConnectorCategories.indexOf(
                sortedConnectorCategories.find(
                    (category: GovernanceConnectorCategoryInterface) =>
                        category.id === ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID
                )), 1)[0]);

        } else {
            sortedConnectorCategories = null;
        }

        if (sortedConnectorCategories) {
            return sortedConnectorCategories?.map(
                (connectorCategory: GovernanceConnectorCategoryInterface, index: number) => (
                    <Grid xs={ 12 } lg={ 6 } key={ index }>
                        <SettingsSection
                            data-testid={ `${testId}-${connectorCategory?.id}` }
                            description={ t(
                                `console:manage.features.governanceConnectors.connectorCategories.${camelCase(
                                    connectorCategory.name
                                )}.description`
                            ) }
                            icon={ () => resolveConnectorCategoryIcon(connectorCategory?.id) }
                            header={ resolveConnectorCategoryTitle(connectorCategory) }
                            onPrimaryActionClick={ () => handleConnectorCategoryAction(connectorCategory) }
                            primaryAction={ t("common:configure") }
                        />
                    </Grid>
                ));
        }

        return null;
    };

    /**
     * Get connectors.
     */
    const getStaticConnectors = (): ReactElement[] => {
        if (connectors && Array.isArray(connectors) && connectors.length > 0) {
            return connectors.map((connector: GovernanceConnectorWithRef, index: number) => {
                if (serverConfigurationConfig.connectorsToShow.includes(connector?.name)) {
                    return (
                        <Grid xs={ 12 } lg={ 6 } key={ index }>
                            <div ref={ connector.ref }>
                                <EditConnector
                                    connector={ connector }
                                    categoryID={ connector.categoryId }
                                    data-testid={ `${testId}-${connector?.id}` }
                                    onUpdate={ () => loadCategoryConnectors(connector.categoryId) }
                                    connectorToggleName={ 
                                        serverConfigurationConfig.connectorToggleName[connector?.name] 
                                    }
                                />
                            </div>
                        </Grid>
                    );
                }
            });
        }

        return null;
    };

    /**
     * Render Connectors conditionally.
     */
    const renderConnectors = (): ReactElement[] => {

        if (serverConfigurationConfig.dynamicConnectors) {
            return getDynamicCategoryConnectors();
        }

        return getStaticConnectors();
    };

    const multiAttributeLoginDescription: string = t("console:manage.features.governanceConnectors." +
        "connectorSubHeading", { name: lowerCase(t("console:manage.features.governanceConnectors.connectorCategories." +
        "accountManagement.connectors.multiattributeLoginHandler.friendlyName"))
    });

    return (
        <PageLayout
            pageTitle= { t("console:common.sidePanel.loginAndRegistration.label") }
            title={ t("console:common.sidePanel.loginAndRegistration.label") }
            description={ t("console:common.sidePanel.loginAndRegistration.description") }
            data-testid={ `${ testId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                {
                    isConnectorCategoryLoading
                        ? renderLoadingPlaceholder()
                        : (
                            <Grid container rowSpacing={ 2 } columnSpacing={ 3 }>
                                {
                                    serverConfigurationConfig.dynamicConnectors
                                        ? (
                                            <>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <SettingsSection
                                                        data-componentid={ "multi-attribute-login-section" }
                                                        data-testid={ "multi-attribute-login-section" }
                                                        description={ multiAttributeLoginDescription }
                                                        icon={ <GearIcon className="icon" /> }
                                                        header={
                                                            t("console:manage.features.governanceConnectors." +
                                                            "connectorCategories.accountManagement.connectors." +
                                                            "multiattributeLoginHandler.friendlyName")
                                                        }
                                                        onPrimaryActionClick={ handleMultiAttributeLoginAction }
                                                        primaryAction={ t("common:configure") }
                                                    />
                                                </Grid>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <AdminAdvisoryBannerSection />
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <SettingsSection
                                                        data-componentid={ "account-login-page-section" }
                                                        data-testid={ "account-login-page-section" }
                                                        description={ 
                                                            t("extensions:manage.accountLogin." +
                                                            "editPage.description") 
                                                        }
                                                        icon={ UsernameValidationIcon }
                                                        header={ 
                                                            t("extensions:manage.accountLogin.editPage.pageTitle") 
                                                        }
                                                        onPrimaryActionClick={ handleSelection }
                                                        primaryAction={ t("common:configure") }
                                                    />
                                                </Grid>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <SettingsSection
                                                        data-componentid={
                                                            "account-login-page-alternative-login-" +
                                                            "identifier-section"
                                                        }
                                                        data-testid={
                                                            "account-login-page-alternative-login-" +
                                                            "identifier-section"
                                                        }
                                                        description={
                                                            t("extensions:manage.accountLogin." +
                                                            "alternativeLoginIdentifierPage.description") }
                                                        icon={ <ArrowLoopRightUserIcon className="icon" /> }
                                                        header={
                                                            t("extensions:manage.accountLogin." +
                                                            "alternativeLoginIdentifierPage.pageTitle")
                                                        }
                                                        onPrimaryActionClick={
                                                            handleAlternativeLoginIdentifierSelection
                                                        }
                                                        primaryAction={ t("common:configure") }
                                                    />
                                                </Grid>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <ValidationConfigPage/>
                                                </Grid>
                                                <Grid xs={ 12 } lg={ 6 }>
                                                    <PrivateKeyJWTConfig/>
                                                </Grid>
                                            </>
                                        )
                                }
                                {
                                    renderConnectors()
                                }
                            </Grid>
                        )
                }
            </Ref>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
ConnectorListingPage.defaultProps = {
    "data-testid": "governance-connectors-listing-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectorListingPage;
