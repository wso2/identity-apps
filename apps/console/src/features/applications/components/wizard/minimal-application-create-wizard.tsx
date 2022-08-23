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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, FormValue, Forms, Validation, useTrigger } from "@wso2is/forms";
import {
    ContentLoader,
    DocumentationLink,
    Heading,
    Hint,
    LinkButton,
    PrimaryButton,
    SelectionCard,
    useDocumentation,
    useWizardAlert
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import set from "lodash-es/set";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, ReactNode, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Card, Dimmer, Divider, Grid } from "semantic-ui-react";
import { OauthProtocolSettingsWizardForm } from "./oauth-protocol-settings-wizard-form";
import { SAMLProtocolAllSettingsWizardForm } from "./saml-protocol-settings-all-option-wizard-form";
import { applicationConfig } from "../../../../extensions";
import {
    AppConstants,
    AppState,
    CORSOriginsListInterface,
    EventPublisher,
    ModalWithSidePanel,
    getCORSOrigins,
    getTechnologyLogos,
    history,
    store
} from "../../../core";
import { TierLimitReachErrorModal } from "../../../core/components/tier-limit-reach-error-modal";
import { OrganizationUtils } from "../../../organizations/utils";
import { createApplication, getApplicationList, getApplicationTemplateData } from "../../api";
import { getInboundProtocolLogos } from "../../configs";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import SinglePageApplicationTemplate
    from "../../data/application-templates/templates/single-page-application/single-page-application.json";
import {
    ApplicationListInterface,
    ApplicationTemplateIdTypes,
    ApplicationTemplateInterface,
    ApplicationTemplateLoadingStrategies,
    MainApplicationInterface,
    SAMLConfigModes,
    SupportedAuthProtocolTypes,
    URLFragmentTypes
} from "../../models";
import { ApplicationManagementUtils } from "../../utils";

/**
 * Prop types of the `MinimalAppCreateWizard` component.
 */
interface MinimalApplicationCreateWizardPropsInterface extends TestableComponentInterface {
    title: string;
    closeWizard: () => void;
    template?: ApplicationTemplateInterface;
    subTitle?: string;
    addProtocol: boolean;
    selectedProtocols?: string[];
    subTemplates?: ApplicationTemplateInterface[];
    subTemplatesSectionTitle?: string;
    appId?: string;
    /**
     * Callback to update the application details.
     */
    onUpdate?: (id: string) => void;
    /**
     * Flag to show/hide help panel.
     */
    showHelpPanel?: boolean;
    /**
     * Application template loading strategy.
     */
    templateLoadingStrategy: ApplicationTemplateLoadingStrategies;
}

/**
 * An app creation wizard with only the minimal features.
 *
 * @param {MinimalApplicationCreateWizardPropsInterface} props Props to be injected into the component.
 */
export const MinimalAppCreateWizard: FunctionComponent<MinimalApplicationCreateWizardPropsInterface> = (
    props: MinimalApplicationCreateWizardPropsInterface
): ReactElement => {

    const {
        title,
        closeWizard,
        template,
        subTemplates,
        subTemplatesSectionTitle,
        subTitle,
        templateLoadingStrategy,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const dispatch = useDispatch();

    const tenantName = store.getState().config.deployment.tenant;

    const [ submit, setSubmit ] = useTrigger();
    const [ submitProtocolForm, setSubmitProtocolForm ] = useTrigger();

    const isClientSecretHashEnabled: boolean = useSelector((state: AppState) =>
        state.config.ui.isClientSecretHashEnabled);

    const [ templateSettings, setTemplateSettings ] = useState<ApplicationTemplateInterface>(null);
    const [ protocolFormValues, setProtocolFormValues ] = useState<Record<string, any>>(undefined);
    const [
        customApplicationProtocol,
        setCustomApplicationProtocol
    ] = useState<SupportedAuthProtocolTypes>(SupportedAuthProtocolTypes.OAUTH2_OIDC);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ generalFormValues, setGeneralFormValues ] = useState<Map<string, FormValue>>(undefined);
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateInterface>(template);
    const [ allowedOrigins, setAllowedOrigins ] = useState([]);
    const [ issuerError, setIssuerError ] = useState<boolean>(false);
    const [ metaUrlError, setMetaUrlError ] = useState<boolean>(false);
    const [ protocolValuesChange, setProtocolValuesChange ] = useState<boolean>(false);
    const [ openLimitReachedModal, setOpenLimitReachedModal ] = useState<boolean>(false);
    const nameRef = useRef<HTMLDivElement>();
    const issuerRef = useRef<HTMLDivElement>();
    const metaUrlRef = useRef<HTMLDivElement>();

    // Maintain SAML configuration mode
    const [ samlConfigureMode, setSAMLConfigureMode ] = useState<string>(undefined);

    const [ alert, setAlert, notification ] = useWizardAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        // Stop fetching CORS origins if the selected template is `Expert Mode`.
        if (!selectedTemplate
            || selectedTemplate.id === CustomApplicationTemplate.id
            || !OrganizationUtils.isCurrentOrganizationRoot()) {
            return;
        }

        const allowedCORSOrigins = [];

        getCORSOrigins()
            .then((response: CORSOriginsListInterface[]) => {
                response.map((origin) => {
                    allowedCORSOrigins.push(origin.url);
                });
            });

        setAllowedOrigins(allowedCORSOrigins);

        // Remove error alert on protocol switch
        setAlert(null);
    }, [ selectedTemplate ]);

    /**
     * On sub-template change set the selected template to the first,
     * and load template details.
     */
    useEffect(() => {
        // Stop fetching template details if the selected template is `Expert Mode`.
        if (selectedTemplate.id === CustomApplicationTemplate.id) {
            setTemplateSettings(CustomApplicationTemplate);

            return;
        }

        if (isEmpty(subTemplates) || !Array.isArray(subTemplates) || subTemplates.length < 1) {
            loadTemplateDetails(template.id, template);

            return;
        }

        setSelectedTemplate(subTemplates[0]);
        loadTemplateDetails(subTemplates[0].id, subTemplates[0]);
    }, [ subTemplates ]);

    /**
     * This where the form submission happens. When the submit is triggered on the
     * main form, it triggers the submit of the protocol form.
     */
    useEffect(() => {

        handleError("all", false);

        // If both `protocolFormValues` & `generalFormValues` are undefined, return.
        if (!protocolFormValues && !generalFormValues) {
            return;
        }

        // If `protocolFormValues` is undefined, evaluate...
        if (!protocolFormValues) {
            if (selectedTemplate.id === CustomApplicationTemplate.id) {
                // SAML Custom Apps a has protocol settings form.
                if (customApplicationProtocol === SupportedAuthProtocolTypes.SAML) {
                    return;
                }
            }

            // If there is an `authenticationProtocol` defined in the template or it has `subTemplates`, return.
            if (template?.authenticationProtocol || template.subTemplates?.length > 0) {
                return;
            }
        }

        // Every app should atleast have a `name` input defined.
        if (!generalFormValues) {
            return;
        }

        // Get a clone to avoid mutation.
        const templateSettingsClone = cloneDeep(templateSettings);

        /**
         * Remove the default(provided by the template) callbackURLs & allowed origins from the
         * form values if theres any user defined values in the form. We do this to prevent appending
         * the default `callbackURL` to the model. {@code callbackURLs?.filter(Boolean)} ensures
         * the passing value has no undefined or falsy values so that {@code isEmpty()} call returns a clean check.
         *
         * If you check the file [single-page-application.json] you can see that there's default
         * value is already populated.
         */
        const callbackURLsPathKey = "inboundProtocolConfiguration.oidc.callbackURLs";
        const allowedOriginsPathKey = "inboundProtocolConfiguration.oidc.allowedOrigins";
        const callbackURLs = get(protocolFormValues, callbackURLsPathKey, []);

        if (!isEmpty(callbackURLs?.filter(Boolean))) {
            set(templateSettingsClone, `application.${ callbackURLsPathKey }`, []);
            set(templateSettingsClone, `application.${ allowedOriginsPathKey }`, []);
        }

        if(templateSettingsClone?.application?.inboundProtocolConfiguration?.saml?.templateConfiguration) {
            delete templateSettingsClone?.application?.inboundProtocolConfiguration?.saml?.templateConfiguration;
        }

        const application: MainApplicationInterface = cloneDeep(merge(templateSettingsClone?.application,
            protocolFormValues));

        application.name = generalFormValues.get("name").toString();
        application.templateId = selectedTemplate.id;
        // If the application is a OIDC standard-based application
        if (customApplicationProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
            && selectedTemplate?.templateId === "custom-application") {
            application.isManagementApp = generalFormValues.get("isManagementApp").length >= 2
                ? true
                : false;
        }

        // If the selected template is Custom, assign the proper `template ids`.
        if (selectedTemplate.id === CustomApplicationTemplate.id) {
            if (customApplicationProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC) {
                application.templateId = ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC;
                // Custom OAuth2/OIDC Apps are created with `client_credentials` grant by default.
                application.inboundProtocolConfiguration = {
                    oidc: {
                        grantTypes: [
                            "client_credentials"
                        ]
                    }
                };
            } else if (customApplicationProtocol === SupportedAuthProtocolTypes.SAML) {
                
                application.templateId = ApplicationManagementConstants.CUSTOM_APPLICATION_SAML;

                application.inboundProtocolConfiguration.saml.manualConfiguration = Object.assign(
                    application.inboundProtocolConfiguration.saml.manualConfiguration,
                    {
                        attributeProfile: {
                            "alwaysIncludeAttributesInResponse": true,
                            "enabled": true
                        }
                    }
                );
            } else if (customApplicationProtocol === SupportedAuthProtocolTypes.WS_FEDERATION) {
                application.templateId = ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS;
            }
        }

        setIsSubmitting(true);

        createApplication(application)
            .then((response) => {
                eventPublisher.compute(() => {
                    if (selectedTemplate.id === CustomApplicationTemplate.id) {
                        eventPublisher.publish("application-register-new-application", {
                            type: application.templateId
                        });
                    } else {
                        eventPublisher.publish("application-register-new-application", {
                            type: selectedTemplate.templateId
                        });
                    }
                });

                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.applications.notifications." +
                            "addApplication.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:develop.features.applications.notifications." +
                            "addApplication.success.message"
                        )
                    })
                );

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                    let searchParams: string = "?";
                    let defaultTabIndex: number = 0;

                    if (isClientSecretHashEnabled) {
                        searchParams = `${ searchParams }&${
                            ApplicationManagementConstants.CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY }=true`;
                    }

                    if (selectedTemplate.id === CustomApplicationTemplate.id) {
                        defaultTabIndex = applicationConfig.customApplication.defaultTabIndex;
                    }

                    history.push({
                        hash: `#${URLFragmentTypes.TAB_INDEX}${defaultTabIndex}`,
                        pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", createdAppID),
                        search: searchParams
                    });

                    return;
                }

                // Fallback to applications page, if the location header is not present.
                history.push(AppConstants.getPaths().get("APPLICATIONS"));
            })
            .catch((error) => {

                if (error.response.status === 403 &&
                    error?.response?.data?.code ===
                    ApplicationManagementConstants.ERROR_CREATE_LIMIT_REACHED.getErrorCode()) {
                    setOpenLimitReachedModal(true);

                    return;
                }

                if (error.response && error.response.data && error.response.data.code &&
                    error.response.data.code === ApplicationManagementConstants.ERROR_CODE_ISSUER_EXISTS) {
                    if (protocolValuesChange) {
                        if (samlConfigureMode !== SAMLConfigModes.MANUAL) {
                            setAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: t(
                                    "console:develop.features.applications.notifications." +
                                    "addApplication.error.message"
                                )
                            });
                            scrollToNotification();
                        } else {
                            handleError("issuer", true);
                            scrollToInValidField("issuer");
                        }
                    }

                    return;
                }

                if (error.response && error.response.data && error.response.data.code &&
                    error.response.data.code === ApplicationManagementConstants.ERROR_CODE_INVALID_METADATA_URL) {
                    if (protocolValuesChange) {
                        handleError("metaUrl", true);
                        scrollToInValidField("metaUrl");
                    }

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:develop.features.applications.notifications." +
                            "addApplication.error.message"
                        )
                    });
                    scrollToNotification();

                    return;
                }

                setAlert({
                    description: t(
                        "console:develop.features.applications.notifications." +
                        "addApplication.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.features.applications.notifications." +
                        "addApplication.genericError.message"
                    )
                });
                scrollToNotification();
            })
            .finally(() => {
                setIsSubmitting(false);
                handleProtocolValueChange(false);
                handleError("all", false);
            });
    }, [ generalFormValues, protocolFormValues ]);

    /**
     * Close the wizard.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * Close the limit reached modal.
     */
    const handleLimitReachedModalClose = (): void => {
        setOpenLimitReachedModal(false);
        handleWizardClose();
    };

    /**
     * Load application template data.
     */
    const loadTemplateDetails = (id: string, template: ApplicationTemplateInterface): void => {

        // If the loading strategy is `LOCAL`, stop making the GET request to fetch template details.
        if (templateLoadingStrategy === ApplicationTemplateLoadingStrategies.LOCAL) {
            setTemplateSettings(template);

            return;
        }

        getApplicationTemplateData(id)
            .then((response: ApplicationTemplateInterface) => {
                setTemplateSettings(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:develop.features.applications.notifications.fetchTemplate.error.message"
                            )
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.applications.notifications.fetchTemplate" +
                            ".genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:develop.features.applications.notifications.fetchTemplate.genericError.message"
                        )
                    })
                );
            });
    };

    /**
     * Scrolls to the first field that throws an error.
     *
     * @param {string} field The name of the field.
     */
    const scrollToInValidField = (field: string): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        switch (field) {
            case "name":
                nameRef.current.scrollIntoView(options);

                break;
            case "issuer":
            {
                issuerRef.current.scrollIntoView(options);
                const issuerElement = issuerRef.current.children[0].children[1].children[0] as HTMLInputElement;

                issuerElement.focus();
                issuerElement.blur();

                break;
            }
            case "metaUrl":
            {
                metaUrlRef.current.scrollIntoView(options);
                const metaUrlElement = metaUrlRef.current.children[0].children[1].children[0] as HTMLInputElement;

                metaUrlElement.focus();
                metaUrlElement.blur();

                break;
            }
        }
    };

    /**
     * Handles the protocol form values change.
     *
     * @param {boolean} state - Flag to trigger validation.
     */
    const handleProtocolValueChange = (state: boolean) => {
        setProtocolValuesChange(state);
    };

    /**
     * Check the protocol errors.
     *
     * @param {boolean} state - Flag to show the error.
     */
    const handleError = (field: string, state: boolean) => {
        switch (field) {
            case "issuer":
                setIssuerError(state);

                break;
            case "metaUrl":
            {
                setMetaUrlError(state);

                break;
            }
            default:
                setMetaUrlError(state);
                setIssuerError(state);
        }
    };

    /**
     * Resolves the relevant protocol form based on the selected protocol.
     *
     * @return {React.ReactElement}
     */
    const resolveMinimalProtocolFormFields = (): ReactElement => {

        let selectedProtocol: SupportedAuthProtocolTypes = selectedTemplate
            .authenticationProtocol as SupportedAuthProtocolTypes;

        if (selectedTemplate.id === CustomApplicationTemplate.id) {
            selectedProtocol = customApplicationProtocol;
        }

        if (selectedProtocol === SupportedAuthProtocolTypes.OIDC) {
            return (
                <OauthProtocolSettingsWizardForm
                    isProtocolConfig={ false }
                    tenantDomain={ tenantName }
                    allowedOrigins={ allowedOrigins }
                    fields={ [ "callbackURLs" ] }
                    hideFieldHints={ true }
                    triggerSubmit={ submitProtocolForm }
                    templateValues={ templateSettings?.application }
                    onSubmit={ (values): void => setProtocolFormValues(values) }
                    showCallbackURL={ true }
                    addOriginByDefault={ selectedTemplate.id === SinglePageApplicationTemplate.id }
                    isAllowEnabled={ !(selectedTemplate.id === SinglePageApplicationTemplate.id) }
                    data-testid={ `${ testId }-oauth-protocol-settings-form` }
                />
            );
        } else if (selectedProtocol === SupportedAuthProtocolTypes.SAML) {

            /**
             * Enable to have SAML wizard without config mode options.
             *
             * @example
             * <SAMLProtocolSettingsWizardForm
             *     fields={ [ "issuer", "assertionConsumerURLs" ] }
             *     hideFieldHints={ true }
             *     triggerSubmit={ submitProtocolForm }
             *     templateValues={ templateSettings?.application }
             *     onSubmit={ (values): void => setProtocolFormValues(values) }
             *     data-testid={ `${ testId }-saml-protocol-settings-form` }
             * />
             */
            return (
                <SAMLProtocolAllSettingsWizardForm
                    issuerRef={ issuerRef }
                    issuerError={ issuerError }
                    metaUrlRef={ metaUrlRef }
                    metaUrlError={ metaUrlError }
                    handleProtocolValueChange={ handleProtocolValueChange }
                    fields={ [ "issuer", "assertionConsumerURLs" ] }
                    hideFieldHints={ true }
                    triggerSubmit={ submitProtocolForm }
                    templateValues={ templateSettings?.application }
                    onSubmit={ (values): void => setProtocolFormValues(values) }
                    setSAMLConfigureMode={ setSAMLConfigureMode }
                    data-testid={ `${ testId }-saml-protocol-settings-form` }
                />
            );
        }
    };

    const renderDimmerOverlay = ( ): ReactNode => {

        return (
            <Dimmer className="lighter" active={ true }>
                { t("common:featureAvailable" ) }
            </Dimmer>
        );
    };

    const scrollToNotification = () => {
        document.getElementById("notification-div").scrollIntoView({ behavior: "smooth" });
    };

    const isNameValid = (name: string) => {
        return name && !!name.match(ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN);
    };

    /**
     * Get the list of supported custom protocols.
     *
     * @param {string} filterProtocol - Protocol to filder.
     * @return {SupportedAuthProtocolTypes[]}
     */
    const getSupportedCustomProtocols = (filterProtocol?: string): SupportedAuthProtocolTypes[] => {

        let supportedProtocols: SupportedAuthProtocolTypes[] = Object.values(SupportedAuthProtocolTypes);

        // Filter out legacy and unsupported auth protocols.
        supportedProtocols = supportedProtocols.filter((protocol: string) => {

            if (applicationConfig.customApplication.allowedProtocolTypes
                && applicationConfig.customApplication.allowedProtocolTypes.length > 0) {
                if (applicationConfig.customApplication.allowedProtocolTypes.includes(protocol)) {
                    return protocol;
                } else {
                    return false;
                }
            }

            if (protocol === SupportedAuthProtocolTypes.WS_TRUST
                || protocol === SupportedAuthProtocolTypes.OIDC
                || protocol === SupportedAuthProtocolTypes.CUSTOM
                || (filterProtocol && protocol === filterProtocol)) {

                return false;
            }

            return protocol;
        });

        const sortOrder: SupportedAuthProtocolTypes[] = [
            SupportedAuthProtocolTypes.OAUTH2_OIDC,
            SupportedAuthProtocolTypes.SAML,
            SupportedAuthProtocolTypes.WS_FEDERATION
        ];

        supportedProtocols = sortBy(supportedProtocols, (protocol: SupportedAuthProtocolTypes) => {
            return sortOrder.indexOf(protocol);
        });

        return supportedProtocols;
    };

    /**
     * Renders the sub template selection.
     * @return {React.ReactElement}
     */
    const renderSubTemplateSelection = (): ReactElement => {

        const hasSubTemplates: boolean = (subTemplates && subTemplates instanceof Array && subTemplates.length > 0);
        const isCustom: boolean = selectedTemplate.id === CustomApplicationTemplate.id;

        if (!hasSubTemplates && !isCustom) {
            return null;
        }

        if (template.id === "mobile" || template.id === "desktop") {
            return null;
        }

        const templates: SupportedAuthProtocolTypes[] | ApplicationTemplateInterface[] = isCustom
            ? getSupportedCustomProtocols()
            : subTemplates;

        return (
            <Grid.Row className="pt-0 mt-0">
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                    <div className="sub-template-selection">
                        <label className="sub-templates-label">{ subTemplatesSectionTitle }</label>
                        <Card.Group itemsPerRow={ 3 } className="sub-templates">
                            {
                                templates
                                    .map((subTemplate: SupportedAuthProtocolTypes | ApplicationTemplateInterface,
                                        index: number) => {

                                        const id: string = isCustom
                                            ? subTemplate as SupportedAuthProtocolTypes
                                            : (subTemplate as ApplicationTemplateInterface).id;
                                        const imageKey: (SupportedAuthProtocolTypes
                                            | ApplicationTemplateInterface["image"]) = isCustom
                                            ? subTemplate as SupportedAuthProtocolTypes
                                            : (subTemplate as ApplicationTemplateInterface).image;
                                        const header: ReactNode = isCustom
                                            ? subTemplate === SupportedAuthProtocolTypes.OAUTH2_OIDC
                                                ? (
                                                    <>
                                                        <div>OAuth2.0</div>
                                                        <div>OpenID Connect</div>
                                                    </>
                                                )
                                                : ApplicationManagementUtils.resolveProtocolDisplayName(
                                                        subTemplate as SupportedAuthProtocolTypes)
                                            : (subTemplate as ApplicationTemplateInterface).name;
                                        const isSelected: boolean = isCustom
                                            ? customApplicationProtocol === subTemplate
                                            : selectedTemplate.id === (subTemplate as ApplicationTemplateInterface).id;
                                        const isDisabled: boolean = isCustom
                                            ? false
                                            : (subTemplate as ApplicationTemplateInterface).previewOnly;
                                        const onClick = () => {
                                            // If `previewOnly`, avoid click actions.
                                            if ((subTemplate as ApplicationTemplateInterface).previewOnly) {
                                                return;
                                            }

                                            if (isCustom) {
                                                setCustomApplicationProtocol(subTemplate as SupportedAuthProtocolTypes);

                                                return;
                                            }

                                            setSelectedTemplate(subTemplate as ApplicationTemplateInterface);
                                            loadTemplateDetails((subTemplate as ApplicationTemplateInterface).id,
                                                subTemplate as ApplicationTemplateInterface);
                                        };

                                        return (
                                            <SelectionCard
                                                key={ index }
                                                image={
                                                    {
                                                        ...getInboundProtocolLogos(),
                                                        ...getTechnologyLogos()
                                                    }[imageKey]
                                                }
                                                size="small"
                                                className="sub-template-selection-card"
                                                header={ header }
                                                selected={ isSelected }
                                                onClick={ onClick }
                                                imageSize="x30"
                                                imageOptions={ {
                                                    relaxed: true,
                                                    square: false,
                                                    width: "auto"
                                                } }
                                                contentTopBorder={ false }
                                                showTooltips={ false }
                                                renderDisabledItemsAsGrayscale={ false }
                                                disabled={ isDisabled }
                                                overlay={ renderDimmerOverlay() }
                                                overlayOpacity={ 0.6 }
                                                data-testid={ `${ testId }-${ id }-card` }
                                            />
                                        );
                                    })
                            }
                        </Card.Group>
                        <Divider hidden />
                    </div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Resolves to the applicable content of an application template.
     *
     * @return {ReactElement} The content relevant to a specified application template.
     */
    const resolveContent = (): ReactElement => {
        return (
            <Forms
                onSubmit={ (values: Map<string, FormValue>) => {
                    setGeneralFormValues(values);
                    setSubmitProtocolForm();
                } }
                onSubmitError={ (requiredFields: Map<string, boolean>, validFields: Map<string, Validation>) => {
                    const iterator = requiredFields.entries();
                    let result = iterator.next();

                    while (!result.done) {
                        if (!result.value[ 1 ] || !validFields.get(result.value[ 0 ]).isValid) {
                            scrollToInValidField(result.value[ 0 ]);

                            break;
                        } else {
                            result = iterator.next();
                        }
                    }
                } }
                submitState={ submit }
                id="name-input"
            >
                <Grid>
                    <div id="notification-div">
                        { alert && (
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                    { notification }
                                </Grid.Column>
                            </Grid.Row>
                        ) }
                    </div>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            <Field
                                name="name"
                                ref={ nameRef }
                                label={ t(
                                    "console:develop.features.applications.forms.generalDetails.fields.name.label"
                                ) }
                                required={ true }
                                requiredErrorMessage={ t(
                                    "console:develop.features.applications.forms.generalDetails.fields.name" +
                                    ".validations.empty"
                                ) }
                                placeholder={ t(
                                    "console:develop.features.applications.forms.generalDetails.fields.name.placeholder"
                                ) }
                                type="text"
                                data-testid={ `${ testId }-application-name-input` }
                                validation={ async (value: FormValue, validation: Validation) => {
                                    if(!isNameValid(value.toString().trim())) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:develop.features.applications.forms." +
                                                "spaProtocolSettingsWizard.fields.name.validations.invalid",
                                            { appName: value.toString(),
                                                characterLimit: ApplicationManagementConstants
                                                    .FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                                            )
                                        );

                                        return;
                                    }
                                    let response: ApplicationListInterface = null;

                                    try {
                                        response = await getApplicationList(null, null, "name eq " + value.toString());
                                    } catch (error) {
                                        if (error.response && error.response.data && error.response.data.description) {
                                            dispatch(addAlert({
                                                description: error.response.data.description,
                                                level: AlertLevels.ERROR,
                                                message: t("console:develop.features.applications." +
                                                    "notifications.fetchApplications.error.message")
                                            }));

                                            return;
                                        }

                                        dispatch(addAlert({
                                            description: t("console:develop.features.applications.notifications." +
                                                "fetchApplications.genericError.description"),
                                            level: AlertLevels.ERROR,
                                            message: t("console:develop.features.applications.notifications." +
                                                "fetchApplications.genericError.message")
                                        }));
                                    }

                                    if (response?.applications?.length > 0) {
                                        validation.isValid = false;
                                        validation.errorMessages.push(
                                            t("console:develop.features.applications.forms.generalDetails.fields.name" +
                                                ".validations.duplicate" )
                                        );
                                    }
                                } }
                                displayErrorOn="blur"
                                maxLength={ ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    { renderSubTemplateSelection() }
                    <Grid.Row className="pt-0 mt-0">
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                            { resolveMinimalProtocolFormFields() }
                        </Grid.Column>
                    </Grid.Row>
                    {
                        // The Management App checkbox is only present in OIDC Standard-Based apps
                        (customApplicationProtocol === SupportedAuthProtocolTypes.OAUTH2_OIDC
                            && selectedTemplate?.templateId === "custom-application") && (
                            <div className="pt-0 mt-0">
                                <Field
                                    data-testid={ `${ testId }-management-app-checkbox` }
                                    name={ "isManagementApp" }
                                    required={ false }
                                    requiredErrorMessage={ "is required" }
                                    type="checkbox"
                                    value={ [ "isManagementApp" ] }
                                    children={ [
                                        {
                                            label: t("console:develop.features.applications.forms.generalDetails" +
                                                ".fields.isManagementApp.label" ),
                                            value: "manageApp"
                                        }
                                    ] }
                                />
                                <Hint compact>
                                    { t("console:develop.features.applications.forms.generalDetails.fields" +
                                            ".isManagementApp.hint" ) }
                                </Hint>
                            </div>
                        )
                    }
                </Grid>
            </Forms>
        );
    };

    /**
     * Renders the help panel containing wizard help.
     *
     * @return {React.ReactElement}
     */
    const renderHelpPanel = (): ReactElement => {

        // Return null when `showHelpPanel` is false or `wizardHelp` is not defined in `selectedTemplate` object.
        if (!selectedTemplate?.content?.wizardHelp) {
            return null;
        }

        let {
            wizardHelp: WizardHelp
        } = selectedTemplate.content;

        if (selectedTemplate.authenticationProtocol === SupportedAuthProtocolTypes.SAML
            && samlConfigureMode === SAMLConfigModes.META_FILE && selectedTemplate.content?.wizardHelp2) {
            WizardHelp = selectedTemplate.content?.wizardHelp2;
        }

        if (selectedTemplate.authenticationProtocol === SupportedAuthProtocolTypes.SAML
            && samlConfigureMode === SAMLConfigModes.META_URL && selectedTemplate.content?.wizardHelp3) {
            WizardHelp = selectedTemplate.content?.wizardHelp3;
        }

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.heading") }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader /> }>
                        <WizardHelp />
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    /**
     * Returns the documentation links based on the application type.
     *
     * @return {string}
     */
    const resolveDocumentationLink = (): string => {

        if (selectedTemplate?.templateId === ApplicationTemplateIdTypes.SPA) {
            return getLink("develop.applications.newApplication.singlePageApplication.learnMore");
        }

        if (selectedTemplate?.templateId === ApplicationTemplateIdTypes.OIDC_WEB_APPLICATION) {
            return getLink("develop.applications.newApplication.oidcApplication.learnMore");
        }

        if (selectedTemplate?.templateId === ApplicationTemplateIdTypes.SAML_WEB_APPLICATION) {
            return getLink("develop.applications.newApplication.samlApplication.learnMore");
        }

        // Returns undefined for application which does not have doc links.
        // Used to hide the learn more link.
        return undefined;
    };

    return (
        <>
            { openLimitReachedModal && (
                <TierLimitReachErrorModal
                    actionLabel={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.action"
                    ) }
                    handleModalClose={ handleLimitReachedModalClose }
                    header={ t(
                        "console:develop.features.applications.notifications.tierLimitReachedError.heading"
                    ) }
                    description={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.subtitles"
                    ) }
                    message={ t(
                        "console:develop.features.applications.notifications." +
                        "tierLimitReachedError.emptyPlaceholder.title"
                    ) }
                    openModal={ openLimitReachedModal }
                />
            ) }
            <ModalWithSidePanel
                open={ !openLimitReachedModal }
                className="wizard minimal-application-create-wizard"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-testid={ `${ testId }-modal` }
            >
                <ModalWithSidePanel.MainPanel>
                    <ModalWithSidePanel.Header className="wizard-header">
                        { title }
                        { subTitle && (
                            <Heading as="h6">
                                { subTitle }
                                <DocumentationLink
                                    link={ resolveDocumentationLink() }
                                >
                                    { t("common:learnMore") }
                                </DocumentationLink>
                            </Heading>
                        ) }
                    </ModalWithSidePanel.Header>
                    <ModalWithSidePanel.Content>{ resolveContent() }</ModalWithSidePanel.Content>
                    <ModalWithSidePanel.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton
                                        floated="left"
                                        onClick={ handleWizardClose }
                                    >
                                        { t("common:cancel") }
                                    </LinkButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ () => {
                                            setIssuerError(false);
                                            setSubmit();
                                        } }
                                        data-testid={ `${ testId }-next-button` }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                    >
                                        { t("common:register") }
                                    </PrimaryButton>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </ModalWithSidePanel.Actions>
                </ModalWithSidePanel.MainPanel>
                { renderHelpPanel() }
            </ModalWithSidePanel>
        </>
    );
};

/**
 * Default props for the application creation wizard.
 */
MinimalAppCreateWizard.defaultProps = {
    "data-testid": "minimal-application-create-wizard",
    showHelpPanel: true
};
