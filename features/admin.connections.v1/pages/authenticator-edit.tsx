/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { ApplicationTemplateConstants } from "@wso2is/admin.application-templates.v1/constants/templates";
import { AppConstants, AppState, FeatureConfigInterface, history } from "@wso2is/admin.core.v1";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { AuthenticatorExtensionsConfigInterface, identityProviderConfig } from "@wso2is/admin.extensions.v1/configs";
import { ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import ExtensionTemplatesProvider from "@wso2is/admin.template-core.v1/provider/extension-templates-provider";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    DocumentationLink,
    LabelWithPopup,
    Popup,
    TabPageLayout,
    useDocumentation
} from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Dispatch } from "redux";
import { getLocalAuthenticator } from "../api/authenticators";
import { useGetConnectionTemplate } from "../api/connections";
import { EditConnection } from "../components/edit/connection-edit";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { useSetConnectionTemplates } from "../hooks/use-connection-templates";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { AuthenticatorLabels } from "../models/authenticators";
import {
    ConnectionInterface,
    ConnectionTemplateInterface,
    CustomAuthConnectionInterface
} from "../models/connection";

/**
 * Proptypes for the Custom Local Authenticator edit page component.
 */
type AuthenticatorEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Custom Local Authenticator Edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React element.
 */
export const AuthenticatorEditPage: FunctionComponent<AuthenticatorEditPagePropsInterface> = ({
    location,
    "data-componentid": _componentId = "authenticator-edit-page"
}: AuthenticatorEditPagePropsInterface): ReactElement => {
    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const { UIConfig } = useUIConfig();
    const setConnectionTemplates: (templates: Record<string, any>[]) => void = useSetConnectionTemplates();

    const idpDescElement: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const { CONNECTION_TEMPLATE_IDS: ConnectionTemplateIds } = CommonAuthenticatorConstants;

    // const [ identityProviderTemplate, setIdentityProviderTemplate ] = useState<ConnectionTemplateInterface>(undefined);
    // const [ authenticatorTemplate, setAuthenticatorTemplate ] = useState<ConnectionTemplateInterface>(undefined);

    const [ customLocalAuthenticatorTemplate, setCustomLocalAuthenticatorTemplate ] = useState<
        ConnectionTemplateInterface
    >(undefined);
    const [ unfilteredConnectionTemplate, setUnfilteredConnectionTemplate ] = useState<ConnectionTemplateInterface[]>(
        undefined
    );
    const [ groupedTemplates, setGroupedTemplates ] = useState<ConnectionTemplateInterface[]>([]);
    const [ connector, setConnector ] = useState<CustomAuthConnectionInterface>(undefined);
    const [ isConnectorDetailsFetchRequestLoading, setConnectorDetailFetchRequestLoading ] = useState<boolean>(undefined);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
    const [ isDescTruncated, setIsDescTruncated ] = useState<boolean>(false);
    const [ tabIdentifier, setTabIdentifier ] = useState<string>();
    const [ isAutomaticTabRedirectionEnabled, setIsAutomaticTabRedirectionEnabled ] = useState<boolean>(false);
    const [ connectionSettings, setConnectionSettings ] = useState(undefined);
    const [ isConnectorMetaDataFetchRequestLoading, setConnectorMetaDataFetchRequestLoading ] = useState<boolean>(
        undefined
    );

    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.identityProviders?.scopes?.update);
    const { getLink } = useDocumentation();

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.applications
    );

    const hasApplicationTemplateViewPermissions: boolean = useRequiredScopes(applicationsFeatureConfig?.scopes?.read);

    const {
        data: template
    } = useGetConnectionTemplate("internal-user-custom-authentication");

    /**
     * Checks if the user needs to go to a specific tab index.
     */
    useEffect(() => {
        redirectToSpecificTab();
    }, []);

    useEffect(() => {

        if (!identityProviderConfig) {
            return;
        }

        const path: string[] = location.pathname.split("/");
        const id: string = path[ path.length - 1 ];


        getCustomLocalAuthenticator(id);
    }, [ identityProviderConfig ]);

    useEffect(() => {
        if (!connector) {
            return;
        }

        const resolvedTemplatedId: string = resolveCustomLocalAuthTemplateId(connector as CustomAuthConnectionInterface)
            .templateId;

        template.templateId = resolvedTemplatedId; // Update the templateId property
        const updatedTemplate: ConnectionTemplateInterface = template; // Assign the whole template object

        setCustomLocalAuthenticatorTemplate(updatedTemplate);

    }, [ connector ]);

    /**
     * Function to redirect the user to a specific tab.
     *
     * @param useLocationStateData - Whether the `tabName` should be extracted from the location data.
     * @param tabName - The tab name to which the user needs to be redirected. However, this will
     * be overridden if there is a tab name in the location data.
     */
    const redirectToSpecificTab = (useLocationStateData: boolean = true, tabName?: string): void => {
        if (useLocationStateData) {
            tabName = location?.state as string;
        }

        if (tabName !== undefined) {
            setIsAutomaticTabRedirectionEnabled(true);
            setTabIdentifier(tabName);
        }
    };

    /**
     * Resolves the template ID of the custom local authenticator.
     *
     * @param connector - Custom local authenticator without template ID.
     * @returns - Custom local authenticator with resolved template ID.
     */
    const resolveCustomLocalAuthTemplateId = (
        connector: CustomAuthConnectionInterface
    ): CustomAuthConnectionInterface => {

        const tags: string[] = (connector as CustomAuthConnectionInterface)?.tags || [];

        const has2FA: boolean = tags.some((tag: string) => tag.toUpperCase() === AuthenticatorLabels.SECOND_FACTOR);

        has2FA
            ? (connector.templateId = ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATION)
            : (connector.templateId = ConnectionTemplateIds.INTERNAL_CUSTOM_AUTHENTICATION);

        return connector;
    };

    /**
     * Retrieves custom local authenticator details from the API.
     *
     * @param id - authenticator id.
     */
    const getCustomLocalAuthenticator = (id: string): void => {
        setConnectorDetailFetchRequestLoading(true);

        getLocalAuthenticator(id)
            .then((response: CustomAuthConnectionInterface) => {
                setConnector(response as CustomAuthConnectionInterface);
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: t("authenticationProvider:notifications.getIDP.error.description", {
                                description: error.response.data.description
                            }),
                            level: AlertLevels.ERROR,
                            message: t("authenticationProvider:" + "notifications.getIDP.error.message")
                        })
                    );

                    return;
                }

                dispatch(
                    addAlert({
                        description: t("authenticationProvider:" + "notifications.getIDP.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("authenticationProvider:" + "notifications.getIDP.genericError.message")
                    })
                );
            })
            .finally(() => {
                setConnectorDetailFetchRequestLoading(false);
            });
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
     * Called when an authenticator updates.
     *
     * @param id - IDP id.
     */
    const handleAuthenticatorUpdate = (id: string, tabName?: string): void => {
        redirectToSpecificTab(false, tabName);
    };

    /**
     * Resolves the connector status label.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    const resolveStatusLabel = (connector: CustomAuthConnectionInterface): ReactElement => {
        // Return `null` if connector is not defined.
        if (!connector) {
            return null;
        }

        // Return `null` if connector is not an IdP.
        // if (!ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {
        //     return null;
        // }

        if (connector?.isEnabled) {
            return (
                <LabelWithPopup
                    popupHeader={ t("authenticationProvider:popups.appStatus.enabled.header") }
                    popupSubHeader={ t("authenticationProvider:popups.appStatus." + "enabled.content") }
                    labelColor="green"
                />
            );
        } else {
            return (
                <LabelWithPopup
                    popupHeader={ t("authenticationProvider:popups.appStatus." + "disabled.header") }
                    popupSubHeader={ t("authenticationProvider:popups.appStatus." + "disabled.content") }
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
    const resolveConnectorImage = (connector: ConnectionInterface): ReactElement => {
        // const isOrganizationSSOIDP: boolean = ConnectionsManagementUtils.isOrganizationSSOConnection(
        //     (connector as ConnectionInterface)?.federatedAuthenticators?.defaultAuthenticatorId
        // );

        if (!connector) {
            return;
        }

        // if (ConnectionsManagementUtils.isConnectorIdentityProvider(connector) && !isOrganizationSSOIDP) {
        //     if (connector.image) {
        //         return (
        //             <AppAvatar
        //                 hoverable={ false }
        //                 name={ connector.name }
        //                 image={ ConnectionsManagementUtils.resolveConnectionResourcePath(
        //                     connectionResourcesUrl,
        //                     connector?.image
        //                 ) }
        //                 size="tiny"
        //             />
        //         );
        //     }

        //     return <AnimatedAvatar hoverable={ false } name={ connector.name } size="tiny" floated="left" />;
        // }

        // TODO: check image path
        return (
            <AppAvatar
                hoverable={ false }
                name={ customLocalAuthenticatorTemplate?.customLocalAuthenticator?.displayName }
                image={ AuthenticatorMeta.getAuthenticatorIcon(
                    customLocalAuthenticatorTemplate?.image
                ) }
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
    const resolveConnectorName = (connector: CustomAuthConnectionInterface): ReactNode => {
        if (!connector) {
            return null;
        }

        return (
            <Fragment>
                { connector.displayName }
                { isConnectorDetailsFetchRequestLoading === false && connector.name && resolveStatusLabel(connector) }
            </Fragment>
        );

        // Original
        // if (ConnectionsManagementUtils.isConnectorIdentityProvider(connector)) {
        //     return (
        //         <Fragment>
        //             { connector.name }
        //             { isConnectorDetailsFetchRequestLoading === false && connector.name && resolveStatusLabel(connector) }
        //         </Fragment>
        //     );
        // }

        // Original
        // return connector.friendlyName || connector.displayName || connector.name;
    };

    /**
     * Resolves the authenticator description.
     *
     * @param connector - Evaluating connector.
     *
     * @returns React element.
     */
    // TODO: make id not optionsl - line 554
    const resolveAuthenticatorDescription = (connector: ConnectionInterface): ReactNode => {
        if (!connector) {
            return null;
        }

        return (
            <div className="with-label ellipsis" ref={ idpDescElement }>
                { customLocalAuthenticatorTemplate?.description ? (
                    <Popup
                        disabled={ !isDescTruncated }
                        content={ customLocalAuthenticatorTemplate?.description?.replaceAll(
                            "{{productName}}",
                            productName
                        ) }
                        trigger={
                            (<span>
                                { customLocalAuthenticatorTemplate?.description?.replaceAll(
                                    "{{productName}}",
                                    productName
                                ) }
                            </span>)
                        }
                    />
                ) : (
                    AuthenticatorMeta.getAuthenticatorDescription(customLocalAuthenticatorTemplate?.id)
                ) }
                <DocumentationLink
                    link={ getLink(`develop.connections.newConnection.
                    ${customLocalAuthenticatorTemplate?.name}.learnMore`) }
                >
                    { t("common:learnMore") }
                </DocumentationLink>
            </div>
        );
    };

    return (
        <ExtensionTemplatesProvider
            shouldFetch={ hasApplicationTemplateViewPermissions }
            resourceType={ ResourceTypes.APPLICATIONS }
            categories={ ApplicationTemplateConstants.SUPPORTED_CATEGORIES_INFO }
        >
            <TabPageLayout
                pageTitle="Edit Connection"
                isLoading={ isConnectorDetailsFetchRequestLoading }
                loadingStateOptions={ {
                    count: 5,
                    imageType: "square"
                } }
                title={ resolveConnectorName(connector) }
                contentTopMargin={ true }
                description={ resolveAuthenticatorDescription(connector) }
                image={ resolveConnectorImage(connector) }
                backButton={ {
                    "data-componentid": `${_componentId}-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.authenticationProviderTemplate.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-componentid={ `${_componentId}-page-layout` }
            >
                <EditConnection
                    connectionSettingsMetaData={ connectionSettings }
                    identityProvider={ connector }
                    isLoading={ isConnectorDetailsFetchRequestLoading || isConnectorMetaDataFetchRequestLoading }
                    onDelete={ handleIdentityProviderDelete }
                    onUpdate={ handleAuthenticatorUpdate }
                    data-componentid={ _componentId }
                    template={ customLocalAuthenticatorTemplate }
                    type={ customLocalAuthenticatorTemplate?.id }
                    isReadOnly={ isReadOnly }
                    isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
                    setIsAutomaticTabRedirectionEnabled={ setIsAutomaticTabRedirectionEnabled }
                    tabIdentifier={ tabIdentifier }
                />
            </TabPageLayout>
        </ExtensionTemplatesProvider>
    );
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AuthenticatorEditPage;
