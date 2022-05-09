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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Code,
    ConfirmationModal,
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    Text,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import get from "lodash-es/get";
import sortBy from "lodash-es/sortBy";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Header, Message, Popup, Button as SemButton } from "semantic-ui-react";
import { SAMLSelectionLanding } from "./protocols";
import { applicationConfig } from "../../../../extensions";
import { AppState, FeatureConfigInterface, store } from "../../../core";
import {
    deleteProtocol,
    getAuthProtocolMetadata,
    regenerateClientSecret,
    revokeClientSecret,
    updateApplicationDetails,
    updateAuthProtocolConfig
} from "../../api";
import { getInboundProtocolLogos } from "../../configs";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationInterface,
    ApplicationTemplateListItemInterface,
    CertificateInterface, OIDCDataInterface,
    SAML2ConfigurationInterface,
    SAMLConfigModes,
    SupportedAuthProtocolMetaTypes,
    SupportedAuthProtocolTypes
} from "../../models";
import { setAuthProtocolMeta } from "../../store";
import { ApplicationManagementUtils } from "../../utils";
import { InboundFormFactory } from "../forms";
import { ApplicationCreateWizard } from "../wizard";

/**
 * Proptypes for the applications settings component.
 */
interface AccessConfigurationPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * The application model.
     */
    application: ApplicationInterface;
    /**
     * Currently editing application id.
     */
    appId: string;
    /**
     * Currently editing application name.
     */
    appName: string;
    /**
     * Current certificate configurations.
     */
    certificate: CertificateInterface;
    /**
     * Access config to be Extended.
     */
    extendedAccessConfig: boolean;
    /**
     * Protocol configurations.
     */
    inboundProtocolConfig: any;
    /**
     *  Currently configured inbound protocols.
     */
    inboundProtocols: string[];
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    setIsLoading?: any;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;

    onProtocolUpdate: () => void;
    /**
     *  Is inbound protocol config request is still loading.
     */
    isInboundProtocolConfigRequestLoading: boolean;
    /**
     * CORS allowed origin list for the tenant.
     */
    allowedOriginList?: string[];
    /**
     * Callback to update the allowed origins.
     */
    onAllowedOriginsUpdate?: () => void;
    /**
     * Callback to be fired when an OIDC application secret is regenerated.
     */
    onApplicationSecretRegenerate?: (response: OIDCDataInterface) => void;
    /**
     * Specifies if the inbound protocol list is loading.
     */
    inboundProtocolsLoading?: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Application template.
     */
    template?: ApplicationTemplateListItemInterface;
    /**
     * Application template.
     */
    applicationTemplateId?: string;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param {AccessConfigurationPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AccessConfiguration: FunctionComponent<AccessConfigurationPropsInterface> = (
    props: AccessConfigurationPropsInterface
): ReactElement => {

    const {
        application,
        appId,
        appName,
        certificate,
        featureConfig,
        inboundProtocolConfig,
        inboundProtocols,
        isLoading,
        setIsLoading,
        onUpdate,
        allowedOriginList,
        onAllowedOriginsUpdate,
        onApplicationSecretRegenerate,
        isInboundProtocolConfigRequestLoading,
        readOnly,
        template,
        onProtocolUpdate,
        extendedAccessConfig,
        applicationTemplateId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const tenantName = store.getState().config.deployment.tenant;
    const allowMultipleProtocol: boolean = useSelector(
        (state: AppState) => state.config.deployment.allowMultipleAppProtocols);

    const [ selectedProtocol, setSelectedProtocol ] = useState<SupportedAuthProtocolTypes | string>(undefined);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>([]);
    const [ supportedProtocolList, setSupportedProtocolList ] = useState<string[]>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showProtocolSwitchModal, setShowProtocolSwitchModal ] = useState<boolean>(false);
    const [ protocolToDelete ] = useState<string>(undefined);
    const [ requestLoading, setRequestLoading ] = useState<boolean>(false);

    const [ samlCreationOption, setSAMLCreationOption ] = useState<SAMLConfigModes>(undefined);

    /**
     * Handles the inbound config delete action.
     *
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be deleted.
     */
    const handleInboundConfigDelete = (protocol: string): void => {
        deleteProtocol(appId, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".success.description", { protocol: protocol }),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.deleteProtocolConfig.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.message")
                }));
            });
    };

    /**
     * Handles the inbound config delete action.
     *
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be deleted.
     */
    const handleInboundConfigSwitch = (protocol: string): void => {
        setRequestLoading(true);
        deleteProtocol(appId, protocol)
            .then(() => {
                onUpdate(appId);
            })
            .catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.deleteProtocolConfig.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.deleteProtocolConfig" +
                        ".genericError.message")
                }));
            }).finally(() => {
                setRequestLoading(false);
                setSelectedProtocol(undefined);
            });
    };

    /**
     * Handles the inbound config form submit action.
     *
     * @param values - Form values.
     * @param {SupportedAuthProtocolTypes} protocol - The protocol to be updated.
     */
    const handleInboundConfigFormSubmit = async (values: any, protocol: string): Promise<void> => {
        let updateError: boolean = false;

        return updateAuthProtocolConfig<OIDCDataInterface | SAML2ConfigurationInterface>(appId, values, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".success.message")
                }));
                onAllowedOriginsUpdate();
            })
            .catch((error) => {
                updateError= true;
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateInboundProtocolConfig" +
                        ".genericError.message")
                }));
            }).finally(() => {
                onProtocolUpdate();
                onUpdate(appId);
                if (!updateError) {
                    createSAMLApplication();
                }
            });
    };

    const createSAMLApplication= () => {
        if (template.id === CustomApplicationTemplate.id
            && samlCreationOption && selectedProtocol === SupportedAuthProtocolTypes.SAML) {
            setSAMLCreationOption(undefined);
        }
    };

    /**
     * Handles form submit.
     *
     * @param values - Form values.
     */
    const handleSubmit = (values: any): void => {
        setIsLoading(true);
        updateApplicationDetails({ id: appId, ...values.general })
            .then(async () => {
                await handleInboundConfigFormSubmit(values.inbound, selectedProtocol);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateApplication.genericError" +
                        ".message")
                }));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     *  Regenerate application.
     */
    const handleApplicationRegenerate = (): void => {
        regenerateClientSecret(appId)
            .then((response: AxiosResponse<OIDCDataInterface>) => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.regenerateSecret.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.regenerateSecret.success.message")
                }));

                onApplicationSecretRegenerate(response.data);
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.regenerateSecret.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.regenerateSecret" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.regenerateSecret" +
                        ".genericError.message")
                }));
            });
    };

    /**
     * Revokes application.
     */
    const handleApplicationRevoke = (): void => {
        revokeClientSecret(appId)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.revokeApplication.success.message")
                }));
                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.revokeApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.revokeApplication.success.message")
                }));
            });
    };

    const getSupportedProtocols = (filterProtocol?: string): string[] => {
        let supportedProtocols: string[] = template?.authenticationProtocol
            ? [ template.authenticationProtocol ]
            : Object.values(SupportedAuthProtocolTypes);


        if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
            return [ SupportedAuthProtocolTypes.SAML ];
        }

        if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC) {
            return [ SupportedAuthProtocolTypes.OAUTH2_OIDC ];
        }

        if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS) {
            return [ SupportedAuthProtocolTypes.WS_FEDERATION ];
        }

        // Filter out legacy and unsupported auth protocols.
        supportedProtocols = supportedProtocols.filter((protocol) => {

            if (template && template.id === CustomApplicationTemplate.id
                && applicationConfig.customApplication.allowedProtocolTypes
                && applicationConfig.customApplication.allowedProtocolTypes.length > 0 ) {
                if (applicationConfig.customApplication.allowedProtocolTypes.includes(protocol)){
                    return protocol;
                } else {
                    return false;
                }
            }

            if (protocol === SupportedAuthProtocolTypes.WS_TRUST
                || protocol === SupportedAuthProtocolTypes.CUSTOM
                || (extendedAccessConfig && protocol === SupportedAuthProtocolTypes.WS_FEDERATION)
                || (filterProtocol && protocol === filterProtocol)) {

                return false;
            }

            return protocol;
        });

        return supportedProtocols;
    };

    /**
     * Use effect hook to be before switching protocol.
     */
    useEffect(() => {
        if (inboundProtocols.length > 0) {
            setInboundProtocolList(inboundProtocols);
        }
    }, [ inboundProtocols ]);


    /**
     * Load supported protocols from api.
     */
    const loadSupportedProtocols = (): void => {
        let supportedProtocols: string[] = getSupportedProtocols();

        // Sort the list of protocols.
        supportedProtocols = sortBy(supportedProtocols, (element) => {

            let customOrder: Record<string, unknown> = {
                [ SupportedAuthProtocolTypes.OIDC ] : 0,
                [ SupportedAuthProtocolTypes.SAML ] : 1
            };

            if (inboundProtocols.length > 0) {
                inboundProtocols.forEach((protocol, index) => {
                    if (Object.values(SupportedAuthProtocolTypes).includes(protocol as SupportedAuthProtocolTypes)) {
                        customOrder = {
                            ...customOrder,
                            [ protocol ]: index
                        };
                    }
                });
            }

            return customOrder[element];
        });

        if (!selectedProtocol) {
            setSelectedProtocol(supportedProtocols[0]);
        }

        if (!supportedProtocolList) {
            setSupportedProtocolList(supportedProtocols);
        }
    };

    /**
     * Resolves the corresponding protocol config form when a protocol is selected.
     * @return {React.ReactElement}
     */
    const resolveInboundProtocolSettingsForm = (): ReactElement => {

        if (!selectedProtocol) {
            return null;
        }

        /**
         * Renders the link to documentation for integrating login.
         * @remarks Currently, the logic is added only for standard based applications (custom).
         * And shown when the link is defined.
         * @return {React.ReactElement}
         */
        const renderProtocolIntegrationHelpMessage = (): ReactElement => {

            let docLink: string = undefined;
            let i18nKey: string = undefined;

            if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC) {
                docLink = getLink("develop.applications.editApplication.standardBasedApplication" +
                    ".oauth2OIDC.protocol.learnMore");
                i18nKey = "console:develop.features.applications.forms.inboundOIDC.documentation";
            }

            if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
                docLink = getLink("develop.applications.editApplication.standardBasedApplication" +
                    ".saml.protocol.learnMore");
                i18nKey = "console:develop.features.applications.forms.inboundSAML.documentation";
            }

            if (!docLink) {
                return null;
            }

            return (
                <Fragment>
                    <Message visible>
                        <Text>
                            <Trans
                                i18nKey={ i18nKey }
                                tOptions={ {
                                    protocol: ApplicationManagementUtils
                                        .resolveProtocolDisplayName(selectedProtocol as SupportedAuthProtocolTypes)
                                } }
                            >
                                Read through our
                                <DocumentationLink link={ docLink }>documentation</DocumentationLink>
                                to learn more about using
                                <Code withBackground={ false }>
                                    {
                                        ApplicationManagementUtils.resolveProtocolDisplayName(
                                                selectedProtocol as SupportedAuthProtocolTypes
                                        )
                                    }
                                </Code>
                                protocol to implement login in your applications.
                            </Trans>
                        </Text>
                    </Message>
                    <Divider hidden />
                </Fragment>
            );
        };

        return (
            <EmphasizedSegment className="protocol-settings-section form-wrapper" padded="very">
                <div className="form-container with-max-width">
                    { !isLoading? resolveProtocolBanner() : null }
                    { renderProtocolIntegrationHelpMessage() }
                    {
                        Object
                            .values(SupportedAuthProtocolTypes)
                            .includes(selectedProtocol as SupportedAuthProtocolTypes)
                            ? (
                                <InboundFormFactory
                                    onUpdate={ onUpdate }
                                    application={ application }
                                    isLoading={ isLoading }
                                    setIsLoading={ setIsLoading }
                                    certificate={ certificate }
                                    tenantDomain={ tenantName }
                                    allowedOrigins={ allowedOriginList }
                                    metadata={
                                        authProtocolMeta[
                                            // There's no separate meta for `OAuth2/OIDC` Apps.
                                            // Need to use `OIDC` for noe.
                                            selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                ? SupportedAuthProtocolTypes.OIDC
                                                : selectedProtocol
                                        ]
                                    }
                                    initialValues={
                                        get(
                                            inboundProtocolConfig,
                                            selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                ? SupportedAuthProtocolTypes.OIDC
                                                : selectedProtocol
                                        )
                                            ? inboundProtocolConfig[
                                                selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                    ? SupportedAuthProtocolTypes.OIDC
                                                    : selectedProtocol
                                            ]
                                            : undefined
                                    }
                                    onSubmit={ handleSubmit }
                                    type={ selectedProtocol as SupportedAuthProtocolTypes }
                                    onApplicationRegenerate={ handleApplicationRegenerate }
                                    onApplicationRevoke={ handleApplicationRevoke }
                                    readOnly={
                                        readOnly
                                        || !hasRequiredScopes(
                                            featureConfig?.applications,
                                            featureConfig?.applications?.scopes?.update,
                                            allowedScopes
                                        )
                                    }
                                    showSAMLCreation={ selectedProtocol === SupportedAuthProtocolTypes.SAML }
                                    SAMLCreationOption={
                                        (selectedProtocol === SupportedAuthProtocolTypes.SAML) && samlCreationOption }
                                    template={ template }
                                    data-testid={ `${ testId }-inbound-${ selectedProtocol }-form` }
                                />
                            )
                            : (
                                <InboundFormFactory
                                    onUpdate={ onUpdate }
                                    application={ application }
                                    isLoading={ isLoading }
                                    setIsLoading={ setIsLoading }
                                    certificate={ certificate }
                                    metadata={
                                        // There's no separate meta for `OAuth2/OIDC` Apps. Need to use `OIDC` for noe.
                                        authProtocolMeta[
                                            selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                ? SupportedAuthProtocolTypes.OIDC
                                                : selectedProtocol
                                        ]
                                    }
                                    initialValues={
                                        get(
                                            inboundProtocolConfig,
                                            selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                ? SupportedAuthProtocolTypes.OIDC
                                                : selectedProtocol
                                        )
                                            ? inboundProtocolConfig[
                                                selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                    ? SupportedAuthProtocolTypes.OIDC
                                                    : selectedProtocol
                                            ]
                                            : undefined
                                    }
                                    onSubmit={ handleSubmit }
                                    type={ SupportedAuthProtocolTypes.CUSTOM }
                                    readOnly={
                                        !hasRequiredScopes(
                                            featureConfig?.applications,
                                            featureConfig?.applications?.scopes?.update,
                                            allowedScopes
                                        )
                                    }
                                    template={ template }
                                    data-testid={ `${ testId }-inbound-custom-form` }
                                />
                            )
                    }
                </div>
            </EmphasizedSegment>
        );
    };

    const resolveProtocolBanner =(): ReactElement => {

        if (!supportedProtocolList) {
            return null;
        }

        if (allowMultipleProtocol) {
            return (
                <Grid.Row>
                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                        {
                            supportedProtocolList.map((protocol: string, index: number) => (
                                <Popup
                                    key={ index }
                                    trigger={ (
                                        <SemButton
                                            basic
                                            color={ selectedProtocol === protocol ? "red" : "grey" }
                                            content={ selectedProtocol === protocol ? "red" : "grey" }
                                            className={ "mr-3 protocol-button" }
                                            onClick={ () => setSelectedProtocol(protocol) }
                                        >
                                            <GenericIcon
                                                fill={ selectedProtocol === protocol ? "primary" : "accent1" }
                                                inline
                                                transparent
                                                icon={ getInboundProtocolLogos()[protocol] }
                                                size="micro"
                                                spaced="left"
                                                verticalAlign="middle"
                                                className={ "protocol-button-icon" }
                                            />
                                            <div
                                                className={ "protocol-change-title" }
                                            >
                                                {
                                                    ApplicationManagementUtils.resolveProtocolDisplayName(
                                                        protocol as SupportedAuthProtocolTypes)
                                                }
                                            </div>
                                        </SemButton>
                                    ) }
                                    content={
                                        ApplicationManagementUtils.resolveProtocolDescription(
                                            protocol as SupportedAuthProtocolTypes)
                                    }
                                    position="top center"
                                    size="mini"
                                    hideOnScroll
                                    inverted
                                />
                            ))
                        }
                        <Divider hidden/>
                        <Divider/>
                    </Grid.Column>
                </Grid.Row>
            );
        }

        return (
            <>
                <Header as="h3" className="display-flex">
                    <GenericIcon
                        transparent
                        width="auto"
                        icon={ getInboundProtocolLogos()[ selectedProtocol ] }
                        size="x30"
                        verticalAlign="middle"
                    />
                    <Header.Content
                        className={ "mt-1" }
                    >
                        <strong> {
                            ApplicationManagementUtils.resolveProtocolDisplayName(
                                selectedProtocol as SupportedAuthProtocolTypes)
                        } </strong>
                        { /*{TODO: Hide change protocol option}*/ }
                        { /*{  (supportedProtocolList.length !== 1) &&*/ }
                        { /*<Header.Subheader*/ }
                        { /*    className="protocol-banner-sub-title"*/ }
                        { /*>*/ }
                        { /*    Choose different protocol?*/ }
                        { /*    <LinkButton*/ }
                        { /*        className={ "pl-1" }*/ }
                        { /*        onClick={ () => setShowProtocolSwitchModal(true) }*/ }
                        { /*    >*/ }
                        { /*        Change Protocol*/ }
                        { /*    </LinkButton>*/ }
                        { /*</Header.Subheader>*/ }
                        { /*}*/ }
                    </Header.Content>
                </Header>
                { resolveProtocolDescription() }
                <Divider hidden/>
            </>
        );
    };

    /**
     * Resolves the corresponding protocol description and documentation link when a protocol is selected.
     * @return {React.ReactElement}
     */
    const resolveProtocolDescription =(): ReactElement => {

        // Description for OIDC Protocol tab.
        if (selectedProtocol === SupportedAuthProtocolTypes.OIDC) {
            return(
                <Header as="h6" color="grey" compact>
                    {
                        t(
                            "console:develop.features.applications.forms.inboundOIDC.description",
                            {
                                protocol: ApplicationManagementUtils
                                    .resolveProtocolDisplayName(SupportedAuthProtocolTypes.OIDC)
                            }
                        )
                    }
                    <DocumentationLink
                        link={ getLink("develop.applications.editApplication.oidcApplication.protocol.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Header>
            );
        }

        // Description for OAuth2/OIDC Protocol tab.
        if (selectedProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC) {
            return(
                <Header as="h6" color="grey" compact>
                    {
                        t(
                            "console:develop.features.applications.forms.inboundOIDC.description",
                            {
                                protocol: ApplicationManagementUtils
                                    .resolveProtocolDisplayName(SupportedAuthProtocolTypes.OAUTH2_OIDC)
                            }
                        )
                    }
                    <DocumentationLink
                        link={ getLink("develop.applications.editApplication.oidcApplication.protocol.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Header>
            );
        }

        // Description for SAML Protocol tab.
        if (selectedProtocol === SupportedAuthProtocolTypes.SAML) {
            return(
                <Header as="h6" color="grey" compact>
                    { t("console:develop.features.applications.forms.inboundSAML.description") }
                    <DocumentationLink
                        link={ getLink("develop.applications.editApplication.samlApplication.protocol.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Header>
            );
        }

        // Description for other types.
        return null;
    };

    /**
     * Use effect hook to be run when an inbound protocol is selected.
     */
    useEffect(() => {

        const protocols: string[] = Object.values(SupportedAuthProtocolMetaTypes);

        protocols.map((selected) => {

            if (selected === SupportedAuthProtocolTypes.WS_FEDERATION
                || selected === SupportedAuthProtocolTypes.WS_TRUST) {

                return;
            }

            const selectedProtocol = selected as SupportedAuthProtocolMetaTypes;

            // Check if the metadata for the selected auth protocol is available in redux store.
            // If not, fetch the metadata related to the selected auth protocol.
            if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedProtocol)) {
                getAuthProtocolMetadata(selectedProtocol)
                    .then((response) => {
                        dispatch(setAuthProtocolMeta(selectedProtocol, response));
                    })
                    .catch((error) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                    ".error.message")
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                                ".genericError.message")
                        }));
                    });
            }
        });
    }, [ inboundProtocols ]);

    const selectSAMLCreationProtocol = (samlOption: SAMLConfigModes): void =>{
        setSAMLCreationOption(samlOption);
        setSelectedProtocol(SupportedAuthProtocolTypes.SAML);
        inboundProtocolList.push(SupportedAuthProtocolTypes.SAML);
    };

    return (
        !isLoading && !requestLoading && !isInboundProtocolConfigRequestLoading
            ? (
                !selectedProtocol
                && inboundProtocols.length === 0
                && !allowMultipleProtocol
                && applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
            )
                ?
                (
                    <SAMLSelectionLanding
                        setSAMLProtocol={ selectSAMLCreationProtocol }
                    />
                )
                : (
                    <Grid>
                        { loadSupportedProtocols() }
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { resolveInboundProtocolSettingsForm() }
                            </Grid.Column>
                        </Grid.Row>
                        {
                            showWizard && (
                                <ApplicationCreateWizard
                                    title={
                                        t("console:develop.features.applications.edit.sections" +
                                            ".access.addProtocolWizard.heading")
                                    }
                                    subTitle={
                                        t("console:develop.features.applications.edit.sections" +
                                            ".access.addProtocolWizard.subHeading",
                                        { appName: appName })
                                    }
                                    closeWizard={ (): void => setShowWizard(false) }
                                    addProtocol={ true }
                                    selectedProtocols={ inboundProtocols }
                                    onUpdate={ onUpdate }
                                    appId={ appId }
                                    data-testid={ `${ testId }-protocol-add-wizard` }
                                />
                            )
                        }
                        {
                            showDeleteConfirmationModal && (
                                <ConfirmationModal
                                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                    type="warning"
                                    open={ showDeleteConfirmationModal }
                                    assertion={ protocolToDelete }
                                    assertionHint={ (
                                        <p>
                                            <Trans
                                                i18nKey={
                                                    "console:develop.features.applications.confirmations" +
                                                    ".deleteProtocol.assertionHint"
                                                }
                                                tOptions={ { name: protocolToDelete } }
                                            >
                                            Please type <strong>{ protocolToDelete }</strong> to confirm.
                                            </Trans>
                                        </p>
                                    ) }
                                    assertionType="input"
                                    primaryAction={ t("common:confirm") }
                                    secondaryAction={ t("common:cancel") }
                                    onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                                    onPrimaryActionClick={
                                        (): void => {
                                            handleInboundConfigDelete(protocolToDelete);
                                            setShowDeleteConfirmationModal(false);
                                        }
                                    }
                                    data-testid={ `${ testId }-protocol-delete-confirmation-modal` }
                                    closeOnDimmerClick={ false }
                                >
                                    <ConfirmationModal.Header
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-header` }
                                    >
                                        {
                                            t("console:develop.features.applications.confirmations" +
                                                ".deleteProtocol.header")
                                        }
                                    </ConfirmationModal.Header>
                                    <ConfirmationModal.Message
                                        attached
                                        warning
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-message` }
                                    >
                                        {
                                            t("console:develop.features.applications.confirmations" +
                                                ".deleteProtocol.message")
                                        }
                                    </ConfirmationModal.Message>
                                    <ConfirmationModal.Content
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-content` }
                                    >
                                        {
                                            t("console:develop.features.applications.confirmations" +
                                                ".deleteProtocol.content")
                                        }
                                    </ConfirmationModal.Content>
                                </ConfirmationModal>
                            )
                        }
                        {
                            showProtocolSwitchModal && (
                                <ConfirmationModal
                                    onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                    type="warning"
                                    open={ showProtocolSwitchModal }
                                    primaryAction={ t("common:confirm") }
                                    secondaryAction={ t("common:cancel") }
                                    onSecondaryActionClick={
                                        (): void => {
                                            setShowProtocolSwitchModal(false);
                                        }
                                    }
                                    onPrimaryActionClick={
                                        (): void => {
                                            handleInboundConfigSwitch(selectedProtocol);
                                            setShowProtocolSwitchModal(false);
                                        }
                                    }
                                    data-testid={ `${ testId }-protocol-delete-confirmation-modal` }
                                    closeOnDimmerClick={ false }
                                >
                                    <ConfirmationModal.Header
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-header` }
                                    >
                                        { t("console:develop.features.applications.confirmations." +
                                        "changeProtocol.header") }
                                    </ConfirmationModal.Header>
                                    <ConfirmationModal.Message
                                        attached
                                        warning
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-message` }
                                    >
                                        { t("console:develop.features.applications.confirmations" +
                                        ".changeProtocol.message",
                                        { name: selectedProtocol }) }
                                    </ConfirmationModal.Message>
                                    <ConfirmationModal.Content
                                        data-testid={ `${ testId }-protocol-delete-confirmation-modal-content` }
                                    >
                                        { t("console:develop.features.applications.confirmations." +
                                        "changeProtocol.content") }
                                    </ConfirmationModal.Content>
                                </ConfirmationModal>
                            )
                        }
                    </Grid>
                ) :
            (
                <EmphasizedSegment padded="very">
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for the application access configuration component.
 */
AccessConfiguration.defaultProps = {
    "data-testid": "application-access-configuration",
    extendedAccessConfig: false
};
