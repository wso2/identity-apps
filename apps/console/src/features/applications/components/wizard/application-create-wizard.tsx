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
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import get from "lodash-es/get";
import has from "lodash-es/has";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import merge from "lodash-es/merge";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { InboundCustomProtocolWizardForm } from "./custom-protcol-settings-wizard-form";
import { GeneralSettingsWizardForm } from "./general-settings-wizard-form";
import { OauthProtocolSettingsWizardForm } from "./oauth-protocol-settings-wizard-form";
import { PassiveStsProtocolSettingsWizardForm } from "./passive-sts-protocol-settings-wizard-form";
import { ProtocolSelectionWizardForm } from "./protocol-selection-wizard-form";
import { ProtocolWizardSummary } from "./protocol-wizard-summary";
import { SAMLProtocolAllSettingsWizardForm } from "./saml-protocol-settings-all-option-wizard-form";
import { SAMLProtocolSettingsWizardForm } from "./saml-protocol-settings-wizard-form";
import { WizardSummary } from "./wizard-summary";
import { WSTrustProtocolSettingsWizardForm } from "./ws-trust-protocol-settings-wizard-form";
import { AppConstants, AppState, history } from "../../../core";
import {
    createApplication,
    getApplicationTemplateData,
    getAuthProtocolMetadata,
    updateAuthProtocolConfig
} from "../../api";
import { getApplicationWizardStepIcons } from "../../configs";
import { ApplicationManagementConstants } from "../../constants";
import CustomApplicationTemplate
    from "../../data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationTemplateInterface,
    ApplicationTemplateListItemInterface,
    DefaultProtocolTemplate,
    MainApplicationInterface,
    OIDCDataInterface,
    SAML2ConfigurationInterface,
    SupportedAuthProtocolMetaTypes,
    SupportedAuthProtocolTypes,
    URLFragmentTypes,
    emptyApplication
} from "../../models";
import { setAuthProtocolMeta } from "../../store";
import {
    OAuthProtocolTemplate,
    OAuthProtocolTemplateItem,
    PassiveStsProtocolTemplate,
    PassiveStsProtocolTemplateItem,
    SAMLProtocolTemplate,
    SAMLProtocolTemplateItem
} from "../meta";

/**
 * Proptypes for the application creation wizard component.
 */
interface ApplicationCreateWizardPropsInterface extends TestableComponentInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    template?: ApplicationTemplateListItemInterface;
    subTitle?: string;
    addProtocol: boolean;
    selectedProtocols?: string[];
    appId?: string;
    /**
     * Callback to update the application details.
     */
    onUpdate?: (id: string) => void;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Interface for the wizard steps.
 */
interface WizardStepInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    name: WizardStepsFormTypes;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    PROTOCOL_SELECTION = "protocolSelection",
    GENERAL_SETTINGS = "generalSettings",
    PROTOCOL_SETTINGS = "protocolSettings",
    SUMMARY = "summary"
}

/**
 * Application creation wizard component.
 *
 * @param {ApplicationCreateWizardPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ApplicationCreateWizard: FunctionComponent<ApplicationCreateWizardPropsInterface> = (
    props: ApplicationCreateWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        title,
        subTitle,
        template,
        addProtocol,
        selectedProtocols,
        appId,
        onUpdate,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);

    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ templateSettings, setTemplateSettings ] = useState<MainApplicationInterface>(undefined);

    const dispatch = useDispatch();

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitOAuth, setSubmitOauth ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();
    const [ selectedTemplate, setSelectedTemplate ] = useState<ApplicationTemplateListItemInterface>(template);
    const [ triggerProtocolSelectionSubmit, setTriggerProtocolSelectionSubmit ] = useTrigger();
    const [ selectedCustomInboundProtocol, setSelectedCustomInboundProtocol ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ selectedSAMLMetaFile ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    /**
     *  Retrieve Application template data.
     *
     */
    const loadApplicationTemplateData = (id: string): void => {

        if (id === DefaultProtocolTemplate.OIDC) {
            setTemplateSettings(OAuthProtocolTemplate.application);
        } else if (id === DefaultProtocolTemplate.SAML) {
            setTemplateSettings(SAMLProtocolTemplate.application);
        } else if (id === DefaultProtocolTemplate.WS_FEDERATION) {
            setTemplateSettings(PassiveStsProtocolTemplate.application);
        } else {
            getApplicationTemplateData(id)
                .then((response) => {
                    setTemplateSettings((response as ApplicationTemplateInterface).application);
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        setAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.fetchTemplate.error" +
                                ".message")
                        });

                        return;
                    }
                    setAlert({
                        description: t("console:develop.features.applications.notifications.fetchTemplate" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchTemplate.genericError" +
                            ".message")
                    });
                });
        }
    };

    /**
     * Creates a new application.
     *
     * @param {MainApplicationInterface} application - The application to be created.
     */
    const createNewApplication = (application: MainApplicationInterface): void => {

        let submittingApplication = application;

        // Add template mapping.
        submittingApplication = {
            ...submittingApplication,
            templateId: selectedTemplate.id
        };

        setIsSubmitting(true);

        createApplication(submittingApplication)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.addApplication.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.addApplication.success.message")
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                    let defaultTabIndex: number = 0;

                    if (selectedTemplate.id === CustomApplicationTemplate.id) {
                        defaultTabIndex = 1;
                    }

                    history.push({
                        hash: `#${ URLFragmentTypes.TAB_INDEX }${ defaultTabIndex }`,
                        pathname: AppConstants.getPaths().get("APPLICATION_EDIT").replace(":id", createdAppID),
                        search: `?${ ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_KEY }=${
                            ApplicationManagementConstants.APP_STATE_URL_SEARCH_PARAM_VALUE }`
                    });

                    return;
                }

                // Fallback to applications page, if the location header is not present.
                history.push(AppConstants.getPaths().get("APPLICATIONS"));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.addApplication.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.applications.notifications.addApplication.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:develop.features.applications.notifications.addApplication.genericError.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Updates application protocols.
     *
     * @param values - Form values.
     */
    const handleApplicationProtocolsUpdate = (values: any): void => {
        setIsSubmitting(true);

        updateAuthProtocolConfig<
            OIDCDataInterface | SAML2ConfigurationInterface
        >(appId, values, selectedTemplate.authenticationProtocol)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateProtocol.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateProtocol.success.message")
                }));

                onUpdate(appId);
                handleWizardClose();
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.updateProtocol.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.applications.notifications.updateProtocol.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateProtocol.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * The following function creates a custom application.
     *
     * @param values
     */
    const handleCustomAppWizardFinish = (values: any): void => {

        let customApplication: MainApplicationInterface = emptyApplication();

        for (const [ key, value ] of Object.entries(values)) {
            customApplication = {
                ...customApplication,
                [ key ]: value
            };
        }

        createNewApplication(customApplication);
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = (): void => {
        switch (wizardSteps[currentWizardStep]?.name) {
            case WizardStepsFormTypes.PROTOCOL_SELECTION:
                setTriggerProtocolSelectionSubmit();

                break;
            case WizardStepsFormTypes.GENERAL_SETTINGS:
                setSubmitGeneralSettings();

                break;
            case WizardStepsFormTypes.PROTOCOL_SETTINGS:
                setSubmitOauth();

                break;
            case WizardStepsFormTypes.SUMMARY:
                setFinishSubmit();

                break;
            default:
                break;
        }
    };

    /**
     * Navigates to the previous wizard step.
     */
    const navigateToPrevious = (): void => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes): void => {
        if (formType === WizardStepsFormTypes.PROTOCOL_SELECTION) {
            if (values) {
                if (isEqual(values, selectedTemplate)) {
                    setCurrentWizardStep(currentWizardStep + 1);
                } else {
                    setSelectedTemplate(values as ApplicationTemplateListItemInterface);
                }
            } else {
                setTriggerProtocolSelectionSubmit();
            }
        } else {
            setCurrentWizardStep(currentWizardStep + 1);
            if (has(wizardState, formType)) {
                setWizardState(set(wizardState, formType, values));
            } else {
                setWizardState(merge(wizardState, { [formType]: values }));
            }
        }
    };

    /**
     * Generates a summary of the wizard.
     */
    const generateWizardSummary = (): MainApplicationInterface => {
        if (!wizardState) {
            return;
        }
        let summary: any = {};

        if (addProtocol) {
            let configName = selectedTemplate.authenticationProtocol;

            if (configName === SupportedAuthProtocolTypes.WS_FEDERATION) {
                configName = "passiveSts";
            } else if (configName === SupportedAuthProtocolTypes.WS_TRUST) {
                configName = "wsTrust";
            }

            summary = get(wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS],
                ("inboundProtocolConfiguration." + configName));

            if (selectedTemplate.id !== DefaultProtocolTemplate.SAML && !selectedCustomInboundProtocol) {
                summary = merge(
                    cloneDeep(templateSettings.inboundProtocolConfiguration[configName]),
                    summary
                );
            }

            return summary;
        } else {
            for (const [ key, value ] of Object.entries(wizardState)) {
                if (key === WizardStepsFormTypes.PROTOCOL_SELECTION) {
                    continue;
                }

                summary = {
                    ...summary,
                    ...value
                };
            }

            return merge(cloneDeep(templateSettings), summary);
        }
    };

    /**
     * Handles the final wizard submission.
     *
     * @param application - Application data.
     */
    const handleWizardFormFinish = (application: any): void => {
        if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] === SupportedAuthProtocolTypes.OIDC) {
            delete application.inboundProtocolConfiguration.saml;
        } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] === SupportedAuthProtocolTypes.SAML) {
            delete application.inboundProtocolConfiguration.oidc;
        }

        createNewApplication(application);
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {
        closeWizard();
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (wizardSteps[currentWizardStep]?.name) {
            case WizardStepsFormTypes.PROTOCOL_SELECTION:
                return (
                    <ProtocolSelectionWizardForm
                        initialSelectedTemplate={ selectedTemplate }
                        onSubmit={ (values): void => handleWizardFormSubmit(values,
                            WizardStepsFormTypes.PROTOCOL_SELECTION) }
                        defaultTemplates={ [
                            PassiveStsProtocolTemplateItem,
                            OAuthProtocolTemplateItem,
                            SAMLProtocolTemplateItem
                        ] }
                        triggerSubmit={ triggerProtocolSelectionSubmit }
                        selectedProtocols={ selectedProtocols }
                        setSelectedCustomInboundProtocol={ setSelectedCustomInboundProtocol }
                        data-testid={ `${ testId }-protocol-selection-form` }
                    />
                );
            case WizardStepsFormTypes.GENERAL_SETTINGS:
                if (selectedTemplate.id === CustomApplicationTemplate.id) {
                    return (
                        <GeneralSettingsWizardForm
                            triggerSubmit={ submitGeneralSettings }
                            initialValues={ wizardState && wizardState[WizardStepsFormTypes.GENERAL_SETTINGS] }
                            onSubmit={ (values): void => {
                                handleCustomAppWizardFinish(values);
                            } }
                            templateValues={ templateSettings }
                            data-testid={ `${ testId }-general-settings-form` }
                        />
                    );
                } else {
                    return (
                        <GeneralSettingsWizardForm
                            triggerSubmit={ submitGeneralSettings }
                            initialValues={ wizardState && wizardState[WizardStepsFormTypes.GENERAL_SETTINGS] }
                            onSubmit={ (values): void => handleWizardFormSubmit(values,
                                WizardStepsFormTypes.GENERAL_SETTINGS) }
                            templateValues={ templateSettings }
                            data-testid={ `${ testId }-general-settings-form` }
                        />
                    );
                }
            case WizardStepsFormTypes.PROTOCOL_SETTINGS:
                if (wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION]) {

                    if (selectedCustomInboundProtocol) {
                        return (
                            <InboundCustomProtocolWizardForm
                                triggerSubmit={ submitOAuth }
                                protocolName={ selectedTemplate.id }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                metadata={ authProtocolMeta[selectedTemplate.id] }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                data-testid={ `${ testId }-custom-protocol-settings-form` }
                            />
                        );
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.OIDC) {

                        return (
                            <OauthProtocolSettingsWizardForm
                                isProtocolConfig={ true }
                                selectedTemplate={ selectedTemplate }
                                triggerSubmit={ submitOAuth }
                                fields={ [ "callbackURLs" ] }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                // TODO remove if not needed
                                showCallbackURL={ true }
                                data-testid={ `${ testId }-oauth-protocol-settings-form` }
                            />
                        );
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.SAML) {

                        return (
                            (selectedTemplate.id === DefaultProtocolTemplate.SAML)
                                ? (
                                    <SAMLProtocolAllSettingsWizardForm
                                        triggerSubmit={ submitOAuth }
                                        initialValues={
                                            wizardState && wizardState[ WizardStepsFormTypes.PROTOCOL_SETTINGS ]
                                        }
                                        templateValues={ templateSettings }
                                        fields={ [ "issuer", "assertionConsumerURLs" ] }
                                        hideFieldHints={ true }
                                        onSubmit={ (values): void => handleWizardFormSubmit(values,
                                            WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                        data-testid={ `${ testId }-saml-protocol-all-settings-form` }
                                    />
                                )
                                : (
                                    <SAMLProtocolSettingsWizardForm
                                        triggerSubmit={ submitOAuth }
                                        initialValues={
                                            wizardState && wizardState[ WizardStepsFormTypes.PROTOCOL_SETTINGS ]
                                        }
                                        templateValues={ templateSettings }
                                        onSubmit={ (values): void => handleWizardFormSubmit(values,
                                            WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                        data-testid={ `${ testId }-saml-protocol-settings-form` }
                                    />
                                )
                        );
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_TRUST) {
                        return (
                            <WSTrustProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                data-testid={ `${ testId }-ws-trust-protocol-settings-form` }
                            />
                        );
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_FEDERATION) {
                        return (
                            <PassiveStsProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                data-testid={ `${ testId }-passive-sts-protocol-settings-form` }
                            />
                        );
                    }
                }

                return null;
            case WizardStepsFormTypes.SUMMARY:
                if (addProtocol) {
                    return (
                        <ProtocolWizardSummary
                            triggerSubmit={ finishSubmit }
                            summary={ generateWizardSummary() }
                            onSubmit={ handleApplicationProtocolsUpdate }
                            image={ selectedTemplate.authenticationProtocol }
                            customProtocol={ selectedCustomInboundProtocol }
                            samlMetaFileSelected={ selectedSAMLMetaFile }
                            data-testid={ `${ testId }-protocol-summary` }
                        />
                    );
                } else {
                    return (
                        <WizardSummary
                            triggerSubmit={ finishSubmit }
                            summary={ generateWizardSummary() }
                            onSubmit={ handleWizardFormFinish }
                            data-testid={ `${ testId }-summary` }
                        />
                    );
                }
        }
    };

    /**
     * Load template data and initialize the wizard.
     */
    useEffect(() => {
        if (selectedTemplate) {
            if (selectedTemplate.id === CustomApplicationTemplate.id) {
                const NEW_STEPS: WizardStepInterface[] = [ ...STEPS ];

                setWizardSteps(NEW_STEPS.splice(1, 1));
            } else {
                setWizardState(merge(wizardState,
                    {
                        [WizardStepsFormTypes.PROTOCOL_SELECTION]: selectedTemplate.authenticationProtocol
                    }));

                // Load template if it is not custom protocol.
                if (!selectedCustomInboundProtocol) {
                    loadApplicationTemplateData(selectedTemplate.id);
                }
                // Set the steps for the wizard.
                if (addProtocol) {
                    setCurrentWizardStep(currentWizardStep + 1);
                } else {
                    setWizardSteps(STEPS.slice(1));
                }
            }
        }
    }, [ selectedTemplate, selectedCustomInboundProtocol ]);

    /**
     *  If custom protocol is selected
     */
    useEffect(() => {

        if (!selectedTemplate) {
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(authProtocolMeta, selectedTemplate.authenticationProtocol)) {
            getAuthProtocolMetadata(selectedTemplate.authenticationProtocol)
                .then((response) => {
                    dispatch(
                        setAuthProtocolMeta(
                            selectedTemplate.authenticationProtocol as SupportedAuthProtocolMetaTypes, response
                        )
                    );
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        setAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:develop.features.applications.notifications.fetchProtocolMeta.error" +
                                ".message")
                        });

                        return;
                    }

                    setAlert({
                        description: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.applications.notifications.fetchProtocolMeta" +
                            ".genericError.message")
                    });
                });
        }
    }, [ selectedCustomInboundProtocol ]);

    /**
     * Set initial steps.
     */
    useEffect(() => {
        if (addProtocol) {
            const NEW_STEPS: WizardStepInterface[] = [ ...STEPS ];

            NEW_STEPS.splice(1, 1);
            setWizardSteps(NEW_STEPS);
        }
    }, [ addProtocol ]);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);

        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    const STEPS: WizardStepInterface[] = [
        {
            icon: getApplicationWizardStepIcons().protocolSelection,
            name: WizardStepsFormTypes.PROTOCOL_SELECTION,
            title: t("console:develop.features.applications.addWizard.steps.protocolSelection.heading")
        },
        {
            icon: getApplicationWizardStepIcons().general,
            name: WizardStepsFormTypes.GENERAL_SETTINGS,
            title: t("console:develop.features.applications.addWizard.steps.generalSettings.heading")
        },
        {
            icon: getApplicationWizardStepIcons().protocolConfig,
            name: WizardStepsFormTypes.PROTOCOL_SETTINGS,
            title: t("console:develop.features.applications.addWizard.steps.protocolConfig.heading")
        },
        {
            icon: getApplicationWizardStepIcons().summary,
            name: WizardStepsFormTypes.SUMMARY,
            title: t("console:develop.features.applications.addWizard.steps.summary.heading")
        }
    ];

    return (
        wizardSteps
            ? (
                <Modal
                    open={ true }
                    className="wizard application-create-wizard"
                    dimmer="blurring"
                    onClose={ handleWizardClose }
                    closeOnDimmerClick={ false }
                    closeOnEscape
                    data-testid={ `${ testId }-modal` }
                >
                    <Modal.Header className="wizard-header">
                        { title }
                        { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                    </Modal.Header>
                    <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                        <Steps.Group current={ currentWizardStep }>
                            { wizardSteps.map((step, index) => (
                                <Steps.Step
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                    data-testid={ `${ testId }-step-${ index }` }
                                />
                            )) }
                        </Steps.Group>
                    </Modal.Content>
                    <Modal.Content className="content-container" scrolling>
                        { alert && alertComponent }
                        { resolveStepContent() }
                    </Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton
                                        data-testid={ `${ testId }-cancel-button` }
                                        floated="left"
                                        onClick={ handleWizardClose }
                                    >
                                        { t("common:cancel") }
                                    </LinkButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    { currentWizardStep < wizardSteps.length - 1 && (
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ navigateToNext }
                                            data-testid={ `${ testId }-next-button` }
                                        >
                                            { t("common:next") }
                                            <Icon name="arrow right"/>
                                        </PrimaryButton>
                                    ) }
                                    { currentWizardStep === wizardSteps.length - 1 && (
                                        <PrimaryButton
                                            floated="right"
                                            onClick={ navigateToNext }
                                            data-testid={ `${ testId }-finish-button` }
                                            loading={ isSubmitting }
                                            disabled= { isSubmitting }
                                        >
                                            { t("common:finish") }
                                        </PrimaryButton>
                                    ) }
                                    { currentWizardStep > 0 && (
                                        <LinkButton
                                            floated="right"
                                            onClick={ navigateToPrevious }
                                            data-testid={ `${ testId }-previous-button` }
                                        >
                                            <Icon name="arrow left"/>
                                            { t("common:previous") }
                                        </LinkButton>
                                    ) }
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Actions>
                </Modal>
            )
            : null
    );
};

/**
 * Default props for the application creation wizard.
 */
ApplicationCreateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "application-create-wizard"
};
