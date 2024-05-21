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
import useAuthorization from "@wso2is/admin.authorization.v1/hooks/use-authorization";
import {
    AppState,
    AuthenticatorAccordion,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    store
} from "@wso2is/admin.core.v1";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue } from "@wso2is/forms";
import {
    Code,
    ConfirmationModal,
    ContentLoader,
    DocumentationLink,
    EmphasizedSegment,
    EmptyPlaceholder,
    GenericIcon,
    Message,
    Popup,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import get from "lodash-es/get";
import sortBy from "lodash-es/sortBy";
import React, {
    Fragment,
    FunctionComponent,
    MouseEvent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AccordionTitleProps, Divider, Grid, Header, Button as SemButton } from "semantic-ui-react";
import { SAMLSelectionLanding } from "./protocols";
import {
    deleteProtocol,
    getAuthProtocolMetadata,
    regenerateClientSecret,
    revokeClientSecret,
    updateApplicationDetails,
    updateAuthProtocolConfig
} from "../../api";
import { useGetApplication } from "../../api/use-get-application";
import { getInboundProtocolLogos } from "../../configs/ui";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import CustomProtocolApplicationTemplate from
    "../../data/application-templates/templates/custom-protocol-application/custom-protocol-application.json";
import {
    ApplicationInterface,
    ApplicationTemplateIdTypes,
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaInterface,
    CertificateInterface,
    OIDCDataInterface,
    OIDCMetadataInterface,
    SAML2ConfigurationInterface,
    SAMLConfigModes,
    SupportedAuthProtocolMetaTypes,
    SupportedAuthProtocolTypes,
    SupportedCustomAuthProtocolTypes
} from "../../models";
import { setAuthProtocolMeta } from "../../store";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { InboundFormFactory } from "../forms";
import { ApplicationCreateWizard } from "../wizard";

/**
 * Prop-types for the applications settings component.
 */
interface AccessConfigurationPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
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

    onProtocolUpdate?: () => void;
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
    /**
     * Flag to determine if the updated application a default application.
     * ex: My Account
     */
    isDefaultApplication?: boolean;
    /**
     * Flag to determine if the updated application a system application.
     * ex: Console
     */
    isSystemApplication?: boolean;
}

/**
 * Interface for the form values when updating an application.
 */
interface ApplicationUpdateFormValuesInterface {
    /**
     * Inbound protocol configuration values.
    * */
    inbound: Record<string, FormValue>;
    /**
     * General application configuration values.
    */
    general: ApplicationInterface;
}

/**
 *  Inbound protocols and advance settings component.
 *
 * @param props - Props injected to the component.
 * @returns Access Configuration component.
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
        extendedAccessConfig,
        applicationTemplateId,
        isDefaultApplication,
        isSystemApplication,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch: Dispatch = useDispatch();

    const {
        mutate: mutateApplicationGetRequest
    } = useGetApplication(application.id);

    const authProtocolMeta: AuthProtocolMetaInterface = useSelector(
        (state: AppState) => state.application.meta.protocolMeta);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const tenantName: string = store.getState().config.deployment.tenant;
    const allowMultipleProtocol: boolean = useSelector(
        (state: AppState) => state.config.deployment.allowMultipleAppProtocols);
    const organizationType: string = useSelector((state: AppState) => state?.organization?.organizationType);
    const { legacyAuthzRuntime } = useAuthorization();

    const [ selectedProtocol, setSelectedProtocol ] = useState<SupportedAuthProtocolTypes | string>(undefined);
    const [ inboundProtocolList, setInboundProtocolList ] = useState<string[]>([]);
    const [ supportedProtocolList, setSupportedProtocolList ] = useState<string[]>(undefined);
    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ showProtocolSwitchModal, setShowProtocolSwitchModal ] = useState<boolean>(false);
    const [ protocolToDelete, setProtocolToDelete ] = useState<string>(undefined);
    const [ requestLoading, setRequestLoading ] = useState<boolean>(false);

    const [ samlCreationOption, setSAMLCreationOption ] = useState<SAMLConfigModes>(undefined);

    const emphasizedSegmentRef: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const [ accordionActiveIndexes, setAccordionActiveIndexes ] = useState<number[]>([]);

    /**
     * Handles the inbound config delete action.
     *
     * @param protocol - The protocol to be deleted.
     */
    const handleInboundConfigDelete = (protocol: string): void => {
        deleteProtocol(appId, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.deleteProtocolConfig" +
                        ".success.description", { protocol: protocol }),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.deleteProtocolConfig" +
                        ".success.message")
                }));

                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.deleteProtocolConfig.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.deleteProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.deleteProtocolConfig" +
                        ".genericError.message")
                }));
            });
    };

    /**
     * Handles the inbound config delete action.
     *
     * @param protocol - The protocol to be deleted.
     */
    const handleInboundConfigSwitch = (protocol: string): void => {
        setRequestLoading(true);
        deleteProtocol(appId, protocol)
            .then(() => {
                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.deleteProtocolConfig.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.deleteProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.deleteProtocolConfig" +
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
     * @param protocol - The protocol to be updated.
     */
    const handleInboundConfigFormSubmit = async (values: any, protocol: string): Promise<void> => {
        let updateError: boolean = false;

        return updateAuthProtocolConfig<OIDCDataInterface | SAML2ConfigurationInterface>(appId, values, protocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("applications:notifications.updateInboundProtocolConfig" +
                        ".success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.updateInboundProtocolConfig" +
                        ".success.message")
                }));
                onAllowedOriginsUpdate();
            })
            .catch((error: AxiosError) => {
                updateError= true;
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateInboundProtocolConfig" +
                            ".error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateInboundProtocolConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateInboundProtocolConfig" +
                        ".genericError.message")
                }));
            }).finally(() => {
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
     * @param protocol - The protocol to be updated.
     */
    const handleSubmit = (
        values: ApplicationUpdateFormValuesInterface,
        protocol: string
    ): void => {
        setIsLoading(true);

        updateApplicationDetails({ id: appId, ...values.general }, true)
            .then(async () => {
                await handleInboundConfigFormSubmit(values.inbound, protocol);

                mutateApplicationGetRequest();
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.updateApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.updateApplication" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.updateApplication.genericError" +
                        ".message")
                }));
            }).finally(() => {
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
                    description: t("applications:notifications.regenerateSecret.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.regenerateSecret.success.message")
                }));

                onApplicationSecretRegenerate(response.data);
                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.regenerateSecret.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.regenerateSecret" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.regenerateSecret" +
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
                    description: t("applications:notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("applications:notifications.revokeApplication.success.message")
                }));
                onUpdate(appId);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.revokeApplication.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("applications:notifications.revokeApplication.success" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications.revokeApplication.success.message")
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

        if (applicationTemplateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID) {
            return [ SupportedAuthProtocolTypes.OAUTH2_OIDC ];
        }

        if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS) {
            return [ SupportedAuthProtocolTypes.WS_FEDERATION ];
        }

        // Filter out legacy and unsupported auth protocols.
        supportedProtocols = supportedProtocols.filter((protocol: string) => {

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
        setSelectedProtocol(null);
        loadSupportedProtocols();
    }, [ inboundProtocols ]);


    /**
     * Load supported protocols from api.
     */
    const loadSupportedProtocols = (): void => {
        let supportedProtocols: string[] = getSupportedProtocols();

        // Sort the list of protocols.
        supportedProtocols = sortBy(supportedProtocols, (element: string) => {

            let customOrder: Record<string, unknown> = {
                [ SupportedAuthProtocolTypes.OIDC ] : 0,
                [ SupportedAuthProtocolTypes.SAML ] : 1
            };

            if (inboundProtocols.length > 0) {
                inboundProtocols.forEach((protocol: string, index: number) => {
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
            if (template?.templateId === CustomProtocolApplicationTemplate.id && inboundProtocols.length > 0) {
                setSelectedProtocol(inboundProtocols[0]);
            } else {
                setSelectedProtocol(supportedProtocols[0]);
            }
        }

        if (!supportedProtocolList) {
            setSupportedProtocolList(supportedProtocols);
        }
    };

    /**
     * Handles Authenticator delete button on click action.
     *
     * @param e - Click event.
     * @param name - Protocol name.
     */
    const handleProtocolDeleteOnClick = (e: MouseEvent<HTMLDivElement>, name: string): void => {
        if (!name) {
            return;
        }

        const deletingProtocol: string = inboundProtocols.find((protocol: string) => protocol === name);

        if (!deletingProtocol) {
            return;
        }

        setProtocolToDelete(deletingProtocol);
        setShowDeleteConfirmationModal(true);
    };

    /**
     * Handles accordion title click.
     *
     * @param e - Click event.
     * @param SegmentedAuthenticatedAccordion - Clicked title.
     */
    const handleAccordionOnClick = (e: MouseEvent<HTMLDivElement>,
        SegmentedAuthenticatedAccordion: AccordionTitleProps): void => {
        if (!SegmentedAuthenticatedAccordion) {
            return;
        }
        const newIndexes: number[] = [ ...accordionActiveIndexes ];

        if (newIndexes?.includes(SegmentedAuthenticatedAccordion.accordionIndex)) {
            const removingIndex: number = newIndexes?.indexOf(SegmentedAuthenticatedAccordion.accordionIndex);

            newIndexes.splice(removingIndex, 1);
        } else {
            newIndexes.push(SegmentedAuthenticatedAccordion.accordionIndex);
        }

        setAccordionActiveIndexes(newIndexes);
    };

    /**
     * Resolves the corresponding protocol config form when a protocol is selected.
     * @returns Protocol settings form.
     */
    const resolveInboundProtocolSettingsForm = (): ReactElement => {

        if (!selectedProtocol || inboundProtocolList.length < 1) {
            return null;
        }

        /**
         * Renders the link to documentation for integrating login.
         * @remarks Currently, the logic is added only for standard based applications (custom).
         * And shown when the link is defined.
         * @returns Protocol integration help message.
         */
        const renderProtocolIntegrationHelpMessage = (): ReactElement => {

            let docLink: string = undefined;
            let i18nKey: string = undefined;

            if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC) {
                docLink = getLink("develop.applications.editApplication.standardBasedApplication" +
                    ".oauth2OIDC.protocol.learnMore");
                i18nKey = "applications:forms.inboundOIDC.documentation";
            }

            if (applicationTemplateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML) {
                docLink = getLink("develop.applications.editApplication.standardBasedApplication" +
                    ".saml.protocol.learnMore");
                i18nKey = "applications:forms.inboundSAML.documentation";
            }

            if (!docLink) {
                return null;
            }

            return (
                <Fragment>
                    <Message
                        visible
                        type="info"
                        content={
                            (<Trans
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
                            </Trans>)
                        }
                    />
                    <Divider hidden />
                </Fragment>
            );
        };

        return (
            <EmphasizedSegment
                className="protocol-settings-section form-wrapper"
                padded="very"
                ref={ emphasizedSegmentRef }
            >
                { inboundProtocolList.length > 1
                    ? ( inboundProtocolList.map(
                        (protocol: string, index: number) => {
                            return (
                                Object.values(SupportedAuthProtocolTypes)
                                    .includes(protocol as SupportedAuthProtocolTypes)
                                    ? (
                                        <AuthenticatorAccordion
                                            key={ index }
                                            globalActions={
                                                !readOnly && [
                                                    {
                                                        icon: "trash alternate",
                                                        onClick: handleProtocolDeleteOnClick,
                                                        type: "icon"
                                                    }
                                                ]
                                            }
                                            authenticators={
                                                [ {
                                                    actions: [],
                                                    content: protocol && (
                                                        <InboundFormFactory
                                                            onUpdate={ onUpdate }
                                                            application={ application }
                                                            isLoading={ isLoading }
                                                            setIsLoading={ setIsLoading }
                                                            certificate={ certificate }
                                                            tenantDomain={ tenantName }
                                                            allowedOrigins={ allowedOriginList }
                                                            metadata={
                                                                // There's no separate meta for `OAuth2/OIDC`
                                                                // Apps. Need to use `OIDC` for now.
                                                                authProtocolMeta[
                                                                    protocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                                        ? SupportedAuthProtocolTypes.OIDC
                                                                        : protocol
                                                                ]
                                                            }
                                                            initialValues={
                                                                get(
                                                                    inboundProtocolConfig,
                                                                    protocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                                        ? SupportedAuthProtocolTypes.OIDC
                                                                        : protocol
                                                                )
                                                                    ? inboundProtocolConfig[
                                                                        protocol === SupportedAuthProtocolTypes
                                                                            .OAUTH2_OIDC
                                                                            ? SupportedAuthProtocolTypes.OIDC
                                                                            : protocol
                                                                    ]
                                                                    : undefined
                                                            }
                                                            onSubmit={
                                                                (values: ApplicationUpdateFormValuesInterface) =>
                                                                    handleSubmit(values, protocol)
                                                            }
                                                            type={ protocol as SupportedAuthProtocolTypes }
                                                            onApplicationRegenerate={
                                                                handleApplicationRegenerate
                                                            }
                                                            onApplicationRevoke={ handleApplicationRevoke }
                                                            readOnly={
                                                                readOnly || !hasRequiredScopes(
                                                                    featureConfig?.applications,
                                                                    featureConfig?.applications?.scopes?.update,
                                                                    allowedScopes,
                                                                    organizationType,
                                                                    legacyAuthzRuntime
                                                                )
                                                            }
                                                            showSAMLCreation={
                                                                protocol === SupportedAuthProtocolTypes.SAML
                                                            }
                                                            SAMLCreationOption={
                                                                (protocol === SupportedAuthProtocolTypes.SAML)
                                                                        && samlCreationOption
                                                            }
                                                            template={ template }
                                                            data-testid={
                                                                `${ componentId }-inbound-${ protocol }-form`
                                                            }
                                                            data-componentid={
                                                                `${ componentId }-inbound-${ protocol }-form`
                                                            }
                                                            containerRef={ emphasizedSegmentRef }
                                                            isDefaultApplication={ isDefaultApplication }
                                                            isSystemApplication={ isSystemApplication }
                                                        />
                                                    ),
                                                    icon: {
                                                        icon: getInboundProtocolLogos()[protocol], size: "micro"
                                                    },
                                                    id: protocol,
                                                    title: resolveProtocolDisplayName(protocol)
                                                } ]
                                            }
                                            accordionActiveIndexes={ accordionActiveIndexes }
                                            accordionIndex={ index }
                                            handleAccordionOnClick={ handleAccordionOnClick }
                                            data-testid={ `${ componentId }-accordion` }
                                            data-componentid={ `${ componentId }-accordion` }
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
                                                // There's no separate meta for `OAuth2/OIDC` Apps.
                                                // Need to use `OIDC` for now.
                                                authProtocolMeta[
                                                    protocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : protocol
                                                ]
                                            }
                                            initialValues={
                                                get(
                                                    inboundProtocolConfig,
                                                    protocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : protocol
                                                )
                                                    ? inboundProtocolConfig[
                                                        protocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                            ? SupportedAuthProtocolTypes.OIDC
                                                            : protocol
                                                    ]
                                                    : undefined
                                            }
                                            onSubmit={ (values: ApplicationUpdateFormValuesInterface) =>
                                                handleSubmit(values, protocol) }
                                            type={ SupportedAuthProtocolTypes.CUSTOM }
                                            readOnly={
                                                !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes,
                                                    organizationType,
                                                    legacyAuthzRuntime
                                                )
                                            }
                                            template={ template }
                                            data-testid={ `${ componentId }-inbound-custom-form` }
                                            data-componentid={ `${ componentId }-inbound-custom-form` }
                                            containerRef={ emphasizedSegmentRef }
                                        />
                                    )
                            );
                        }
                    )
                    )
                    : ( inboundProtocolList.length === 1
                        ? (
                            <div className="form-container with-max-width">
                                { !isLoading? resolveProtocolBanner() : null }
                                { renderProtocolIntegrationHelpMessage() }
                                { Object.values(SupportedAuthProtocolTypes)
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
                                                // There's no separate meta for `OAuth2/OIDC` Apps.
                                                // Need to use `OIDC` for now.
                                                authProtocolMeta[ selectedProtocol ===
                                                        SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                    ? SupportedAuthProtocolTypes.OIDC
                                                    : selectedProtocol
                                                ]
                                            }
                                            initialValues={
                                                get(
                                                    inboundProtocolConfig, selectedProtocol ===
                                                            SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : selectedProtocol
                                                )
                                                    ? inboundProtocolConfig[ selectedProtocol ===
                                                            SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : selectedProtocol
                                                    ]
                                                    : undefined
                                            }
                                            onSubmit={
                                                (values: ApplicationUpdateFormValuesInterface) =>
                                                    handleSubmit(values, selectedProtocol)
                                            }
                                            type={ selectedProtocol as SupportedAuthProtocolTypes }
                                            onApplicationRegenerate={ handleApplicationRegenerate }
                                            onApplicationRevoke={ handleApplicationRevoke }
                                            readOnly={
                                                readOnly || !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes,
                                                    organizationType,
                                                    legacyAuthzRuntime
                                                )
                                            }
                                            showSAMLCreation={
                                                selectedProtocol === SupportedAuthProtocolTypes.SAML
                                            }
                                            SAMLCreationOption={
                                                (selectedProtocol === SupportedAuthProtocolTypes.SAML)
                                                && samlCreationOption
                                            }
                                            template={ template }
                                            data-testid={
                                                `${ componentId }-inbound-${ selectedProtocol }-form`
                                            }
                                            data-componentid={
                                                `${ componentId }-inbound-${ selectedProtocol }-form`
                                            }
                                            containerRef={ emphasizedSegmentRef }
                                            isDefaultApplication={ isDefaultApplication }
                                            isSystemApplication={ isSystemApplication }
                                        />
                                    ):
                                    (
                                        <InboundFormFactory
                                            onUpdate={ onUpdate }
                                            application={ application }
                                            isLoading={ isLoading }
                                            setIsLoading={ setIsLoading }
                                            certificate={ certificate }
                                            metadata={
                                                // There's no separate meta for `OAuth2/OIDC` Apps.
                                                // Need to use `OIDC` for now.
                                                authProtocolMeta[ selectedProtocol ===
                                                        SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                    ? SupportedAuthProtocolTypes.OIDC
                                                    : selectedProtocol
                                                ]
                                            }
                                            initialValues={
                                                get(
                                                    inboundProtocolConfig, selectedProtocol ===
                                                            SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : selectedProtocol
                                                )
                                                    ? inboundProtocolConfig[ selectedProtocol ===
                                                            SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                        ? SupportedAuthProtocolTypes.OIDC
                                                        : selectedProtocol
                                                    ]
                                                    : undefined
                                            }
                                            onSubmit={
                                                (values: ApplicationUpdateFormValuesInterface) =>
                                                    handleSubmit(values, selectedProtocol)
                                            }
                                            type={ SupportedAuthProtocolTypes.CUSTOM }
                                            readOnly={
                                                !hasRequiredScopes(
                                                    featureConfig?.applications,
                                                    featureConfig?.applications?.scopes?.update,
                                                    allowedScopes,
                                                    organizationType,
                                                    legacyAuthzRuntime
                                                )
                                            }
                                            template={ template }
                                            data-testid={ `${ componentId }-inbound-custom-form` }
                                            data-componentid={ `${ componentId }-inbound-custom-form` }
                                            containerRef={ emphasizedSegmentRef }
                                        />
                                    )
                                }
                            </div>
                        )
                        : undefined
                    )
                }
            </EmphasizedSegment>
        );
    };

    /**
     * Resolve protocol display name when there are multiple protocols.
     *
     * @param protocol - Protocol name.
     */
    const resolveProtocolDisplayName = ((protocol: string): string => {
        let protocolName: SupportedAuthProtocolTypes = protocol as SupportedAuthProtocolTypes;

        if (protocolName === "oidc") {
            protocolName = SupportedAuthProtocolTypes.OAUTH2_OIDC;
        }

        return ApplicationManagementUtils.resolveProtocolDisplayName(protocolName);
    });

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

        if (applicationTemplateId === ApplicationTemplateIdTypes.M2M_APPLICATION) {
            return (
                <>
                    <Header as="h3" className="display-flex">
                        <GenericIcon
                            transparent
                            width="auto"
                            icon={ getInboundProtocolLogos()[ SupportedAuthProtocolTypes.OAUTH2 ] }
                            size="x30"
                            verticalAlign="middle"
                        />
                        <Header.Content
                            className={ "mt-1" }
                        >
                            <strong>
                                {
                                    ApplicationManagementUtils
                                        .resolveProtocolDisplayName(SupportedAuthProtocolTypes.OAUTH2)
                                }
                            </strong>
                        </Header.Content>
                    </Header>
                    { resolveProtocolDescription() }
                    <Divider hidden/>
                </>
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
     * @returns Protocol description.
     */
    const resolveProtocolDescription =(): ReactElement => {
        // Description for OIDC Protocol tab.
        if (selectedProtocol === SupportedAuthProtocolTypes.OIDC) {
            return(
                <Header as="h6" color="grey" compact>
                    {
                        t(
                            "applications:forms.inboundOIDC.description",
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
                            "applications:forms.inboundOIDC.description",
                            {
                                protocol: ApplicationManagementUtils
                                    .resolveProtocolDisplayName(
                                        applicationTemplateId === ApplicationTemplateIdTypes.M2M_APPLICATION
                                            ? SupportedAuthProtocolTypes.OAUTH2
                                            : SupportedAuthProtocolTypes.OAUTH2_OIDC
                                    )
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
                    { t("applications:forms.inboundSAML.description") }
                    <DocumentationLink
                        link={ getLink("develop.applications.editApplication.samlApplication.protocol.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </Header>
            );
        }

        // Description for CAS Protocol tab.
        if (selectedProtocol === SupportedCustomAuthProtocolTypes.CAS) {
            return(
                <Header as="h6" color="grey" compact>
                    {
                        t(
                            "applications:forms.inboundOIDC.description",
                            {
                                protocol: ApplicationManagementUtils
                                    .resolveProtocolDisplayName(SupportedCustomAuthProtocolTypes.CAS)
                            }
                        )
                    }
                </Header>
            );
        }

        // Description for CAS Protocol tab.
        if (selectedProtocol === SupportedCustomAuthProtocolTypes.JWT_SSO) {
            return(
                <Header as="h6" color="grey" compact>
                    {
                        t(
                            "applications:forms.inboundOIDC.description",
                            {
                                protocol: ApplicationManagementUtils
                                    .resolveProtocolDisplayName(SupportedCustomAuthProtocolTypes.JWT_SSO)
                            }
                        )
                    }
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

        let protocols: string[] = Object.values(SupportedAuthProtocolMetaTypes);

        if (template?.templateId === CustomProtocolApplicationTemplate.id) {
            protocols = inboundProtocols;
        }

        protocols.map((selected: string) => {

            if (selected === SupportedAuthProtocolTypes.WS_FEDERATION
                || selected === SupportedAuthProtocolTypes.WS_TRUST) {

                return;
            }

            const selectedProtocol: SupportedAuthProtocolMetaTypes = selected as SupportedAuthProtocolMetaTypes;

            // Check if the metadata for the selected auth protocol is available in redux store.
            // If not, fetch the metadata related to the selected auth protocol.
            if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedProtocol)) {
                getAuthProtocolMetadata(selectedProtocol)
                    .then((response: OIDCMetadataInterface) => {
                        dispatch(setAuthProtocolMeta(selectedProtocol, response));
                    })
                    .catch((error: AxiosError) => {
                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t("applications:notifications.fetchProtocolMeta" +
                                    ".error.message")
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: t("applications:notifications.fetchProtocolMeta" +
                                ".genericError.description"),
                            level: AlertLevels.ERROR,
                            message: t("applications:notifications.fetchProtocolMeta" +
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
                        <>
                            { loadSupportedProtocols() }
                            {
                                template && (
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            { resolveInboundProtocolSettingsForm() }
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                            {
                                (inboundProtocols?.length < 1) && (
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <EmphasizedSegment
                                                className="protocol-settings-section form-wrapper"
                                                padded="very"
                                                ref={ emphasizedSegmentRef }
                                            >
                                                <EmptyPlaceholder
                                                    title={ t("applications:edit" +
                                                        ".sections.protocol.title") }
                                                    subtitle={ [
                                                        t("applications:edit" +
                                                            ".sections.protocol.subtitle")
                                                    ] }
                                                    action={ (
                                                        <PrimaryButton onClick={ () => setShowWizard(true) }>
                                                            { t("applications:edit" +
                                                                ".sections.protocol.button") }
                                                        </PrimaryButton>
                                                    ) }
                                                    image={ getEmptyPlaceholderIllustrations().emptyList }
                                                    imageSize="tiny"
                                                />
                                            </EmphasizedSegment>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                            {
                                showWizard && (
                                    <ApplicationCreateWizard
                                        title={
                                            t("applications:edit.sections" +
                                                ".access.addProtocolWizard.heading")
                                        }
                                        subTitle={
                                            t("applications:edit.sections" +
                                                ".access.addProtocolWizard.subHeading",
                                            { appName: appName })
                                        }
                                        closeWizard={ (): void => setShowWizard(false) }
                                        addProtocol={ true }
                                        selectedProtocols={ inboundProtocols }
                                        onUpdate={ onUpdate }
                                        appId={ appId }
                                        data-testid={ `${ componentId }-protocol-add-wizard` }
                                    />
                                )
                            }
                            {
                                showDeleteConfirmationModal && (
                                    <ConfirmationModal
                                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                                        type="negative"
                                        open={ showDeleteConfirmationModal }
                                        assertion={ protocolToDelete }
                                        assertionHint={ (
                                            <p>
                                                <Trans
                                                    i18nKey={
                                                        "applications:confirmations" +
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
                                        data-testid={ `${ componentId }-protocol-delete-confirmation-modal` }
                                        closeOnDimmerClick={ false }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ componentId }-protocol-delete-confirmation-modal-header` }
                                        >
                                            {
                                                t("applications:confirmations" +
                                                    ".deleteProtocol.header")
                                            }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={
                                                `${ componentId }-protocol-delete-confirmation-modal-message`
                                            }
                                        >
                                            {
                                                t("applications:confirmations" +
                                                    ".deleteProtocol.message")
                                            }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={
                                                `${ componentId }-protocol-delete-confirmation-modal-content`
                                            }
                                        >
                                            {
                                                t("applications:confirmations" +
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
                                        type="negative"
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
                                        data-testid={ `${ componentId }-protocol-delete-confirmation-modal` }
                                        closeOnDimmerClick={ false }
                                    >
                                        <ConfirmationModal.Header
                                            data-testid={ `${ componentId }-protocol-delete-confirmation-modal-header` }
                                        >
                                            { t("applications:confirmations." +
                                            "changeProtocol.header") }
                                        </ConfirmationModal.Header>
                                        <ConfirmationModal.Message
                                            attached
                                            negative
                                            data-testid={
                                                `${ componentId }-protocol-delete-confirmation-modal-message`
                                            }
                                        >
                                            { t("applications:confirmations" +
                                            ".changeProtocol.message",
                                            { name: selectedProtocol }) }
                                        </ConfirmationModal.Message>
                                        <ConfirmationModal.Content
                                            data-testid={
                                                `${ componentId }-protocol-delete-confirmation-modal-content`
                                            }
                                        >
                                            { t("applications:confirmations." +
                                            "changeProtocol.content") }
                                        </ConfirmationModal.Content>
                                    </ConfirmationModal>
                                )
                            }
                        </>
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
    "data-componentid": "application-access-configuration",
    extendedAccessConfig: false
};
