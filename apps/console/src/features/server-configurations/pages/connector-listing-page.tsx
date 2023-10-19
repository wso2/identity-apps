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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ReferableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { GridLayout, PageLayout } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Placeholder, Ref } from "semantic-ui-react";
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
                if (featureConfig?.wsFedconfiguration?.enabled) {
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

    const loadCategoryConnectors = (categoryId: string) => {
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
     * This function returns loading placeholder.
     */
    const renderLoadingPlaceholder = (): ReactElement => {
        return (
            <Grid.Row columns={ 1 }>
                <div>
                    <div 
                        className="ui card fluid settings-card"
                        data-testid={ `${testId}-loading-card` }
                    >
                        <div className="content no-padding">
                            <div className="header-section">
                                <Placeholder>
                                    <Placeholder.Header>
                                        <Placeholder.Line length="medium" />
                                        <Placeholder.Line length="full" />
                                    </Placeholder.Header>
                                </Placeholder>
                                <Divider hidden />
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
                    <Divider hidden/>
                </div>
            </Grid.Row>
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
    const handleSelection = () => {
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

    return (
        <PageLayout
            pageTitle= { t("console:common.sidePanel.loginAndRegistration.label") }
            title={ t("console:common.sidePanel.loginAndRegistration.label") }
            description={ t("console:common.sidePanel.loginAndRegistration.description") }
            data-testid={ `${ testId }-page-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <GridLayout
                    showTopActionPanel={ false }
                >
                    {
                        isConnectorCategoryLoading 
                            ? renderLoadingPlaceholder() 
                            : (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column width={ 12 }>
                                        {
                                            !serverConfigurationConfig.dynamicConnectors &&
                                                ( 
                                                    <>
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
                                                            primaryAction={ "Configure" }
                                                        >
                                                            <Divider hidden />
                                                        </SettingsSection>
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
                                                            primaryAction={ "Configure" }
                                                        >
                                                            <Divider hidden />
                                                        </SettingsSection>
                                                    </>
                                                )
                                        }
                                        {
                                            serverConfigurationConfig.dynamicConnectors ?
                                                (
                                                    connectorCategories 
                                                && Array.isArray(connectorCategories) 
                                                && connectorCategories.length > 0)
                                                    ? connectorCategories.map(
                                                        (connectorCategory: GovernanceConnectorWithRef, 
                                                            index: number) => {
                                                            return (
                                                                <SettingsSection
                                                                    key={ index }
                                                                    data-testid={ `${testId}-` + connectorCategory?.id }
                                                                    description={ connectorCategory?.description }
                                                                    icon={ () => 
                                                                        resolveConnectorCategoryIcon(
                                                                            connectorCategory?.id
                                                                        ) 
                                                                    }
                                                                    header={ connectorCategory.name }
                                                                    onPrimaryActionClick={ 
                                                                        () => handleConnectorCategoryAction(
                                                                            connectorCategory
                                                                        ) 
                                                                    }
                                                                    primaryAction={ "Configure" }
                                                                >
                                                                    <Divider hidden />
                                                                </SettingsSection>     
                                                            );
                                                        }) : null
                                                :
                                                (connectors && Array.isArray(connectors) && connectors.length > 0)
                                                    ? connectors.map(
                                                        (connector: GovernanceConnectorWithRef, index: number) => {
                                                            if (serverConfigurationConfig.connectorsToShow
                                                                .includes(connector?.name)) {
                                                                return (
                                                                    <div ref={ connector.ref } key={ index }>
                                                                        <EditConnector
                                                                            connector={ connector }
                                                                            categoryID={ connector.categoryId }
                                                                            data-testid={ `${testId}-` + connector?.id }
                                                                            onUpdate={ 
                                                                                () => loadCategoryConnectors(
                                                                                    connector.categoryId
                                                                                ) 
                                                                            }
                                                                            connectorToggleName={
                                                                                serverConfigurationConfig.
                                                                                    connectorToggleName[
                                                                                        connector?.name
                                                                                    ]
                                                                            }
                                                                        />
                                                                        <Divider hidden/>
                                                                    </div>
                                                                );
                                                            }
                                                        })
                                                    : null
                                        }
                                        { (!serverConfigurationConfig.dynamicConnectors) && (
                                            <div>
                                                <ValidationConfigPage/>
                                                <Divider hidden/>
                                                <PrivateKeyJWTConfig/>
                                                <Divider hidden/>
                                            </div>
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                            )
                    }
                </GridLayout>
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
