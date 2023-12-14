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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    LabelWithPopup,
    Popup,
    TabPageLayout
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import get from "lodash-es/get";
import orderBy from "lodash-es/orderBy";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { Label } from "semantic-ui-react";
import {
    AuthenticatorExtensionsConfigInterface,
    identityProviderConfig
} from "../../../extensions/configs";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    history
} from "../../core";
import {
    EditMultiFactorAuthenticator
} from "../../identity-providers/components/edit-multi-factor-authenticator";
import {
    getLocalAuthenticator,
    getMultiFactorAuthenticatorDetails
} from "../api/authenticators";
import {
    getConnectionDetails,
    getConnectionMetaData,
    getConnectionTemplates
} from "../api/connections";
import { EditConnection } from "../components/edit/connection-edit";
import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { ConnectionManagementConstants } from "../constants/connection-constants";
import { useSetConnectionTemplates } from "../hooks/use-connection-templates";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import {
    AuthenticatorInterface,
    MultiFactorAuthenticatorInterface
} from "../models/authenticators";
import {
    ConnectionInterface,
    ConnectionTemplateCategoryInterface,
    ConnectionTemplateInterface,
    SupportedQuickStartTemplateTypes
} from "../models/connection";
import { ConnectionTemplateManagementUtils } from "../utils/connection-template-utils";
import { ConnectionsManagementUtils, handleGetConnectionsMetaDataError } from "../utils/connection-utils";

/**
 * Proptypes for the IDP edit page component.
 */
type ConnectionEditPagePropsInterface = TestableComponentInterface;

/**
 * Connection Edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
const ConnectionEditPage: FunctionComponent<ConnectionEditPagePropsInterface> = (
    props: ConnectionEditPagePropsInterface & RouteComponentProps
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const setConnectionTemplates: ((templates: Record<string, any>[]) => void) = useSetConnectionTemplates();

    const idpDescElement: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const [
        identityProviderTemplate,
        setIdentityProviderTemplate
    ] = useState<ConnectionTemplateInterface>(undefined);
    const [
        unfilteredConnectionTemplate,
        setUnfilteredConnectionTemplate
    ] = useState<ConnectionTemplateInterface[]>(undefined);
    const [
        groupedTemplates,
        setGroupedTemplates
    ] = useState<ConnectionTemplateInterface[]>([]);
    const [
        connector,
        setConnector
    ] = useState<ConnectionInterface | MultiFactorAuthenticatorInterface | AuthenticatorInterface>(undefined);
    const [
        isConnectorDetailsFetchRequestLoading,
        setConnectorDetailFetchRequestLoading
    ] = useState<boolean>(undefined);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);
    const [ tabIdentifier, setTabIdentifier ] = useState<string>();
    const [ isAutomaticTabRedirectionEnabled, setIsAutomaticTabRedirectionEnabled ] = useState<boolean>(false);
    const [ connectionSettings, setConnectionSettings ] = useState(undefined);
    const [
        isConnectorMetaDataFetchRequestLoading,
        setConnectorMetaDataFetchRequestLoading
    ] = useState<boolean>(undefined);

    const isReadOnly: boolean = useMemo(() => (
        !hasRequiredScopes(
            featureConfig?.identityProviders, featureConfig?.identityProviders?.scopes?.update, allowedScopes)
    ), [ featureConfig, allowedScopes ]);

    /**
     *  Group the connection templates.
     */
    useEffect(() => {

        if (!unfilteredConnectionTemplate || !Array.isArray(unfilteredConnectionTemplate)
            || !(unfilteredConnectionTemplate.length > 0)) {

            return;
        }

        const connectionTemplatesClone: ConnectionTemplateInterface[] = unfilteredConnectionTemplate.map(
            (template: ConnectionTemplateInterface) => {

                if (template.id === "enterprise-oidc-idp" || template.id === "enterprise-saml-idp") {
                    return {
                        ...template,
                        templateGroup: "enterprise-protocols"
                    };
                }

                return template;
            }
        );

        ConnectionTemplateManagementUtils
            .reorderConnectionTemplates(connectionTemplatesClone)
            .then((response: ConnectionTemplateInterface[]) => {
                setGroupedTemplates(response);
            });
    }, [ unfilteredConnectionTemplate ]);

    /**
     * Categorize the connection templates.
     */
    useEffect(() => {

        if (!groupedTemplates || !Array.isArray(groupedTemplates)
            || !(groupedTemplates.length > 0)) {
            return;
        }

        ConnectionTemplateManagementUtils.categorizeTemplates(groupedTemplates)
            .then((response: ConnectionTemplateCategoryInterface[]) => {
                response.filter((category: ConnectionTemplateCategoryInterface) => {
                    // Order the templates by pushing coming soon items to the end.
                    category.templates = orderBy(category.templates, [ "comingSoon" ], [ "desc" ]);
                });

                setConnectionTemplates(response[ 0 ]?.templates);
            })
            .catch(() => {
                setConnectionTemplates([]);
            });
    }, [ groupedTemplates ]);

    useEffect(() => {
        /**
         * What's the goal of this effect?
         * To figure out the application's description is truncated or not.
         *
         * A comprehensive explanation is added in {@link ApplicationEditPage}
         * in a similar {@link useEffect}.
         */
        if (idpDescElement || isConnectorDetailsFetchRequestLoading) {
            const nativeElement: HTMLDivElement = idpDescElement.current;

            if (nativeElement && (nativeElement.offsetWidth < nativeElement.scrollWidth)) {
                setIsDescTruncated(true);
            }
        }
    }, [ idpDescElement, isConnectorDetailsFetchRequestLoading ]);

    /**
     * Use effect for the initial component load.
     */
    useEffect(() => {

        if (!identityProviderConfig) {
            return;
        }

        const path: string[] = location.pathname.split("/");
        const id: string = path[ path.length - 1 ];

        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig
            .authenticators, id);

        if (authenticatorConfig?.isEnabled) {
            getMultiFactorAuthenticator(id, authenticatorConfig?.useAuthenticatorsAPI);

            return;
        }

        getIdentityProvider(id);
    }, [ identityProviderConfig ]);

    /**
     * Checks if the user needs to go to a specific tab index.
     */
    useEffect(() => {
        redirectToSpecificTab();
    }, []);

    /**
     * Function to redirect the user to a specific tab.
     *
     * @param useLocationStateData - Whether the `tabName` should be extracted from the location data.
     * @param tabName - The tab name to which the user needs to be redirected. However, this will
     * be overridden if there is a tab name in the location data.
     */
    const redirectToSpecificTab = (useLocationStateData: boolean = true, tabName?: string): void => {
        if (useLocationStateData) {
            tabName =  location?.state as string;
        }

        if (tabName !== undefined) {
            setIsAutomaticTabRedirectionEnabled(true);
            setTabIdentifier(tabName);
        }
    };

    /**
     * Load the template that the IDP is built on.
     */
    useEffect(() => {

        // Return if connector is not defined.
        if (!connector) {
            return;
        }

        // Return if connector is not an IdP.
        if (!ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {
            return;
        }

        if (!(UIConfig?.connectionTemplates
            && UIConfig?.connectionTemplates instanceof Array
            && UIConfig?.connectionTemplates.length > 0)) {

            resolveConnectionTemplates();

            return;
        }

        if (!connector.templateId) {
            connector.templateId = ConnectionManagementConstants.EXPERT_MODE_TEMPLATE_ID;
        }

        let template: ConnectionTemplateInterface = {};
        let templateId: string = connector.templateId;

        if (!templateId) {
            const authenticatorId: string = (connector as ConnectionInterface)
                ?.federatedAuthenticators?.defaultAuthenticatorId;

            if (authenticatorId === ConnectionManagementConstants.FACEBOOK_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.FACEBOOK;
            } else if (authenticatorId === ConnectionManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.GOOGLE;
            } else if (authenticatorId === ConnectionManagementConstants.OIDC_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.OIDC;
            } else if (authenticatorId === ConnectionManagementConstants.SAML_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.SAML;
            } else if (authenticatorId === ConnectionManagementConstants.GITHUB_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.GITHUB;
            } else if (authenticatorId === ConnectionManagementConstants.APPLE_AUTHENTICATOR_ID) {
                templateId = ConnectionManagementConstants.IDP_TEMPLATE_IDS.APPLE;
            }
        }

        if (templateId === ConnectionManagementConstants.IDP_TEMPLATE_IDS.OIDC ||
            templateId === ConnectionManagementConstants.IDP_TEMPLATE_IDS.SAML) {

            const groupedTemplates: ConnectionTemplateInterface = UIConfig?.connectionTemplates
                .find((template: ConnectionTemplateInterface) => {
                    return template.id === "enterprise-protocols";
                });

            template = groupedTemplates?.subTemplates?.find((template: ConnectionTemplateInterface) => {
                return template.id === templateId;
            });
        } else {
            template = UIConfig?.connectionTemplates
                .find((template: ConnectionTemplateInterface) => {
                    return template.id === templateId;
                });
        }

        setIdentityProviderTemplate(template);
    }, [ UIConfig?.connectionTemplates, connector ]);

    useEffect(() => {
        if (!identityProviderTemplate) {

            return;
        }

        if (identityProviderTemplate?.id === ConnectionManagementConstants.TRUSTED_TOKEN_TEMPLATE_ID ||
            identityProviderTemplate?.id === ConnectionManagementConstants.EXPERT_MODE_TEMPLATE_ID ||
            identityProviderTemplate?.id === ConnectionManagementConstants.IDP_TEMPLATE_IDS.OIDC ||
            identityProviderTemplate?.id === ConnectionManagementConstants.IDP_TEMPLATE_IDS.SAML) {

            return;
        }

        getConnectionMetaDetails(identityProviderTemplate.id);
    }, [ identityProviderTemplate ]);

    const resolveConnectionTemplates = (): void => {
        getConnectionTemplates()
            .then((response: ConnectionTemplateInterface[]) => {
                setUnfilteredConnectionTemplate(response);
            });
    };

    /**
     * Retrieves connection meta details from the API.
     *
     * @param id - IDP id.
     */
    const getConnectionMetaDetails = (id: string): void => {
        setConnectorMetaDataFetchRequestLoading(true);

        getConnectionMetaData(id)
            .then((response: any) => {
                setConnectionSettings(response);
            }).catch ((error: AxiosError) => {
                handleGetConnectionsMetaDataError(error);
            })
            .finally(() => {
                setConnectorMetaDataFetchRequestLoading(false);
            });
    };

    /**
     * Retrieves idp details from the API.
     *
     * @param id - IDP id.
     */
    const getIdentityProvider = (id: string): void => {
        setConnectorDetailFetchRequestLoading(true);

        getConnectionDetails(id)
            .then((response: ConnectionInterface | MultiFactorAuthenticatorInterface | AuthenticatorInterface) =>
            {
                setConnector(response);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider." +
                            "notifications.getIDP.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider." +
                            "notifications.getIDP.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.getIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider." +
                        "notifications.getIDP.genericError.message")
                }));
            })
            .finally(() => {
                setConnectorDetailFetchRequestLoading(false);
            });
    };

    /**
     * Retrieves the local authenticator details from the API.
     *
     * @param id - Authenticator id.
     * @param useAuthenticatorsAPI - Use the
     */
    const getMultiFactorAuthenticator = (id: string, useAuthenticatorsAPI: boolean = true): void => {

        setConnectorDetailFetchRequestLoading(true);

        /**
         * Get authenticator details from either governance API or `authenticators` API.
         * @param cb - Callback.
         * @returns Promise containing authenticator details.
         */
        const getAuthenticatorDetails = <T extends unknown>(cb: (id: string) => Promise<T>) => {

            cb(id)
                .then((response: T) => {
                    setConnector(response);
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: t("console:develop.features.authenticationProvider." +
                                "notifications.getConnectionDetails.error.description",
                            { description: error.response.data.description }),
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.authenticationProvider." +
                                "notifications.getConnectionDetails.error.message")
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t("console:develop.features.authenticationProvider." +
                            "notifications.getConnectionDetails.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider." +
                            "notifications.getConnectionDetails.genericError.message")
                    }));
                })
                .finally(() => {
                    setConnectorDetailFetchRequestLoading(false);
                });
        };

        if (useAuthenticatorsAPI) {
            getAuthenticatorDetails<AuthenticatorInterface>(getLocalAuthenticator);

            return;
        }

        getAuthenticatorDetails<MultiFactorAuthenticatorInterface>(getMultiFactorAuthenticatorDetails);
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Called when an idp is deleted.
     */
    const handleIdentityProviderDelete = (): void => {

        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Called when an idp updates.
     *
     * @param id - IDP id.
     */
    const handleIdentityProviderUpdate = (id: string, tabName?: string): void => {

        getIdentityProvider(id);
        redirectToSpecificTab(false, tabName);
    };

    /**
     * Called when an Multi-factor authenticator updates.
     *
     * @param id - Authenticator id.
     */
    const handleMultiFactorAuthenticatorUpdate = (id: string): void => {

        if (!identityProviderConfig) {
            return;
        }

        const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(identityProviderConfig
            .authenticators, id);

        getMultiFactorAuthenticator(id, authenticatorConfig?.useAuthenticatorsAPI);
    };

    /**
     * Resolves the connector status label.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveStatusLabel = (connector: ConnectionInterface
        | MultiFactorAuthenticatorInterface): ReactElement => {

        // Return `null` if connector is not defined.
        if (!connector) {
            return null;
        }

        // Return `null` if connector is not an IdP.
        if (!ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {
            return null;
        }

        if (connector?.isEnabled) {
            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.authenticationProvider.popups.appStatus.enabled.header") }
                    popupSubHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "enabled.content") }
                    labelColor="green"
                />
            );
        } else {
            return (
                <LabelWithPopup
                    popupHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "disabled.header") }
                    popupSubHeader={ t("console:develop.features.authenticationProvider.popups.appStatus." +
                        "disabled.content") }
                    labelColor="grey"
                />
            );
        }
    };

    /**
     * Resolves the connector image.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveConnectorImage = (connector: ConnectionInterface
        | MultiFactorAuthenticatorInterface): ReactElement => {

        const isOrganizationSSOIDP: boolean = ConnectionsManagementUtils
            .isOrganizationSSOConnection(
                (connector as ConnectionInterface)?.federatedAuthenticators?.defaultAuthenticatorId);

        if (!connector) {
            return (
                <AppAvatar
                    hoverable={ false }
                    isLoading={ true }
                    size="tiny"
                />
            );
        }

        if (ConnectionsManagementUtils.isConnectorIdentityProvider(connector) && !isOrganizationSSOIDP) {

            if (connector.image) {
                return (
                    <AppAvatar
                        hoverable={ false }
                        name={ connector.name }
                        image={
                            ConnectionsManagementUtils
                                .resolveConnectionResourcePath(connectionResourcesUrl, connector?.image)
                        }
                        size="tiny"
                    />
                );
            }

            return (
                <AnimatedAvatar
                    hoverable={ false }
                    name={ connector.name }
                    size="tiny"
                    floated="left"
                />
            );
        }

        return (
            <AppAvatar
                hoverable={ false }
                name={ connector.name }
                image={ !isOrganizationSSOIDP
                    ? AuthenticatorMeta.getAuthenticatorIcon(connector?.id)
                    : AuthenticatorMeta.getAuthenticatorIcon((connector as ConnectionInterface)
                        .federatedAuthenticators?.defaultAuthenticatorId)
                }
                size="tiny"
            />
        );
    };

    /**
     * Resolves the connector name.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveConnectorName = (connector: ConnectionInterface
        | MultiFactorAuthenticatorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {

            return (
                <Fragment>
                    { connector.name }
                    {
                        (isConnectorDetailsFetchRequestLoading === false
                            && connector.name) && resolveStatusLabel(connector)
                    }
                </Fragment>
            );
        }

        if (connector.id === AuthenticatorManagementConstants.FIDO_AUTHENTICATOR_ID) {
            connector.displayName = identityProviderConfig.getOverriddenAuthenticatorDisplayName(
                connector.id, connector.displayName);
        }

        return connector.friendlyName || connector.displayName || connector.name;
    };

    /**
     * Resolves the connector description.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveConnectorDescription = (connector: ConnectionInterface
        | MultiFactorAuthenticatorInterface): ReactNode => {

        if (!connector) {
            return null;
        }

        if (ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {

            return (
                <div className="with-label ellipsis" ref={ idpDescElement }>
                    {
                        identityProviderTemplate?.name
                        && (
                            <Label size="small">
                                {
                                    identityProviderTemplate.name === "Expert Mode"
                                        ? "Custom Connector"
                                        : identityProviderTemplate?.name
                                }
                            </Label>
                        )
                    }
                    <Popup
                        disabled={ !isDescTruncated }
                        content={ connector?.description }
                        trigger={ (
                            <span>{ connector?.description }</span>
                        ) }
                    />
                </div>
            );
        }

        return (
            <div className="with-label ellipsis" ref={ idpDescElement }>
                {
                    connector?.description
                        ? (
                            <Popup
                                disabled={ !isDescTruncated }
                                content={ connector?.description }
                                trigger={ (
                                    <span>{ connector?.description }</span>
                                ) }
                            />
                        )
                        : AuthenticatorMeta.getAuthenticatorDescription(
                            connector.id
                        )
                }
            </div>
        );
    };

    return (
        <TabPageLayout
            pageTitle="Edit Connection"
            isLoading={ isConnectorDetailsFetchRequestLoading }
            loadingStateOptions={ {
                count: 5,
                imageType: "square"
            } }
            title={ resolveConnectorName(connector) }
            contentTopMargin={ true }
            description={ resolveConnectorDescription(connector) }
            image={ resolveConnectorImage(connector) }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.authenticationProviderTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
        >
            {
                ConnectionsManagementUtils.isConnectorIdentityProvider(connector)
                    ? (
                        <EditConnection
                            connectionSettingsMetaData={ connectionSettings }
                            identityProvider={ connector }
                            isLoading={
                                isConnectorDetailsFetchRequestLoading ||
                                isConnectorMetaDataFetchRequestLoading
                            }
                            onDelete={ handleIdentityProviderDelete }
                            onUpdate={ handleIdentityProviderUpdate }
                            isGoogle={
                                (identityProviderTemplate?.name === undefined)
                                    ? undefined
                                    : identityProviderTemplate.name === SupportedQuickStartTemplateTypes.GOOGLE
                            }
                            isSaml={
                                (connector?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                                    ? undefined
                                    : (connector?.federatedAuthenticators?.defaultAuthenticatorId
                                        === AuthenticatorManagementConstants.SAML_AUTHENTICATOR_ID)
                            }
                            isOidc={
                                (connector?.federatedAuthenticators?.defaultAuthenticatorId === undefined)
                                    ? undefined
                                    : (connector.federatedAuthenticators.defaultAuthenticatorId
                                        === AuthenticatorManagementConstants.OIDC_AUTHENTICATOR_ID)
                            }
                            data-testid={ testId }
                            template={ identityProviderTemplate }
                            type={ identityProviderTemplate?.id }
                            isReadOnly={ isReadOnly }
                            isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
                            setIsAutomaticTabRedirectionEnabled={ setIsAutomaticTabRedirectionEnabled }
                            tabIdentifier={ tabIdentifier }
                        />
                    )
                    : (
                        <EditMultiFactorAuthenticator
                            authenticator={ connector }
                            isLoading={ isConnectorDetailsFetchRequestLoading }
                            onDelete={ handleIdentityProviderDelete }
                            onUpdate={ handleMultiFactorAuthenticatorUpdate }
                            type={ connector?.id }
                            isReadOnly={ isReadOnly }
                        />
                    )
            }
        </TabPageLayout>
    );
};

/**
 * Default proptypes for the Connection edit page component.
 */
ConnectionEditPage.defaultProps = {
    "data-testid": "idp-edit-page"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ConnectionEditPage;
