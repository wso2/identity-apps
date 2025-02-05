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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1/configs";
import { ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import ExtensionTemplatesProvider from "@wso2is/admin.template-core.v1/provider/extension-templates-provider";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
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
import { Label } from "semantic-ui-react";
import { getLocalAuthenticator } from "../api/authenticators";
import { useGetConnectionTemplate } from "../api/connections";
import { EditConnection } from "../components/edit/connection-edit";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { AuthenticatorLabels } from "../models/authenticators";
import { CustomAuthConnectionInterface } from "../models/connection";

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

    const idpDescElement: React.MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const { CONNECTION_TEMPLATE_IDS: ConnectionTemplateIds } = CommonAuthenticatorConstants;

    const [ connector, setConnector ] = useState<CustomAuthConnectionInterface>(undefined);
    const [ isConnectorDetailsFetchRequestLoading, setConnectorDetailFetchRequestLoading ] =
        useState<boolean>(undefined);
    const [ tabIdentifier, setTabIdentifier ] = useState<string>();
    const [ isAutomaticTabRedirectionEnabled, setIsAutomaticTabRedirectionEnabled ] = useState<boolean>(false);
    const [ shouldFetchConnectionTemplate, setShouldFetchConnectionTemplate ] = useState<boolean>(false);
    const [ templateId, setTemplateId ] = useState<string>(undefined);

    const { getLink } = useDocumentation();
    const { t } = useTranslation();

    const applicationsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.applications
    );
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);

    const isReadOnly: boolean = !useRequiredScopes(featureConfig?.identityProviders?.scopes?.update);
    const hasApplicationTemplateViewPermissions: boolean = useRequiredScopes(applicationsFeatureConfig?.scopes?.read);

    const { data: template } = useGetConnectionTemplate(templateId, shouldFetchConnectionTemplate);

    useEffect(() => {
        if (!connector) {
            return;
        }
        setTemplateId(getCustomLocalAuthTemplateId(connector as CustomAuthConnectionInterface));
    }, [ connector ]);

    useEffect(() => {
        if (templateId) {
            setShouldFetchConnectionTemplate(true);
        }
    }, [ templateId ]);

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
        const id: string = path[path.length - 1];

        getCustomLocalAuthenticator(id);
    }, [ identityProviderConfig ]);

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
    const getCustomLocalAuthTemplateId = (connector: CustomAuthConnectionInterface): string => {
        const tags: string[] = (connector as CustomAuthConnectionInterface)?.tags || [];

        const has2FA: boolean = tags.some((tag: string) => tag.toUpperCase() === AuthenticatorLabels.SECOND_FACTOR);

        return has2FA
            ? ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATION
            : ConnectionTemplateIds.INTERNAL_CUSTOM_AUTHENTICATION;
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

    const resolveConnectorImage = (connector: CustomAuthConnectionInterface): ReactElement => {
        if (!connector) {
            return;
        }

        return (
            <AppAvatar
                hoverable={ false }
                name={ connector?.displayName }
                image={ AuthenticatorMeta.getCustomAuthenticatorIcon() }
                size="tiny"
            />
        );
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
        getCustomLocalAuthenticator(id);
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
        if (!connector) {
            return null;
        }

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
    };

    /**
     * Resolve local custom authenticator label to be displayed in the edit page.
     *
     * @param connector - Connector.
     * @returns React element.
     */
    const resolveCustomLocalAuthenticatorLabel = (connector: CustomAuthConnectionInterface): ReactNode => {
        return (
            <Label size="small">
                { getCustomLocalAuthTemplateId(connector)
                    === ConnectionTemplateIds.TWO_FACTOR_CUSTOM_AUTHENTICATION ?
                    t(
                        "customAuthentication:fields.createWizard.authenticationTypeStep." +
                    "twoFactorAuthenticationCard.header"
                    ) : t(
                        "customAuthentication:fields.createWizard.authenticationTypeStep." +
                    "internalUserAuthenticationCard.header"
                    ) }
            </Label>
        );
    };

    /**
     * Resolves the authenticator description.
     *
     * @param connector - Evaluating connector.
     * @returns React element.
     */
    const resolveAuthenticatorDescription = (connector: CustomAuthConnectionInterface): ReactNode => {
        if (!connector) {
            return null;
        }

        return (
            <div className="with-label ellipsis" ref={ idpDescElement }>
                { resolveCustomLocalAuthenticatorLabel(connector) }
                { connector?.description ? (
                    <Popup
                        content={ connector?.description?.replaceAll("{{productName}}", productName) }
                        trigger={ <span>{ connector?.description?.replaceAll("{{productName}}", productName) }</span> }
                    />
                ) : (
                    AuthenticatorMeta.getAuthenticatorDescription(connector?.id)
                ) }
                <DocumentationLink
                    link={ getLink(`develop.connections.newConnection.
                    ${connector?.name}.learnMore`) }
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
                    identityProvider={ connector }
                    isLoading={ isConnectorDetailsFetchRequestLoading }
                    onDelete={ handleIdentityProviderDelete }
                    onUpdate={ handleAuthenticatorUpdate }
                    data-componentid={ _componentId }
                    template={ template }
                    type={ templateId }
                    isReadOnly={ isReadOnly }
                    isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
                    setIsAutomaticTabRedirectionEnabled={ setIsAutomaticTabRedirectionEnabled }
                    tabIdentifier={ tabIdentifier }
                />
            </TabPageLayout>
        </ExtensionTemplatesProvider>
    );
};

export default AuthenticatorEditPage;
