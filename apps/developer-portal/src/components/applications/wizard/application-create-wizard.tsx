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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { GeneralSettingsWizardForm } from "./general-settings-wizard-form";
import { OauthProtocolSettingsWizardForm } from "./oauth-protocol-settings-wizard-form";
import { PassiveStsProtocolSettingsWizardForm } from "./passive-sts-protocol-settings-wizard-form";
import { ProtocolSelectionWizardForm } from "./protocol-selection-wizard-form";
import { ProtocolWizardSummary } from "./protocol-wizard-summary";
import { SAMLProtocolSettingsWizardForm } from "./saml-protocol-settings-wizard-form";
import { WizardSummary } from "./wizard-summary";
import { WSTrustProtocolSettingsWizardForm } from "./ws-trust-protocol-settings-wizard-form";
import {
    createApplication,
    getApplicationTemplateData,
    getAuthProtocolMetadata,
    updateAuthProtocolConfig
} from "../../../api";
import { ApplicationWizardStepIcons } from "../../../configs";
import { history } from "../../../helpers";
import { ApplicationConstants } from "../../../constants";
import {
    PassiveStsProtocolTemplate,
    PassiveStsProtocolTemplateItem,
    OAuthProtocolTemplate,
    OAuthProtocolTemplateItem,
    SAMLProtocolTemplate,
    SAMLProtocolTemplateItem,
    WSTrustProtocolTemplate,
    WSTrustProtocolTemplateItem
} from "../meta";
import {
    ApplicationTemplateInterface,
    ApplicationTemplateListItemInterface,
    MainApplicationInterface,
    SupportedAuthProtocolTypes,
    DefaultProtocolTemplate, emptyApplication, SupportedAuthProtocolMetaTypes
} from "../../../models";
import { ApplicationManagementUtils } from "../../../utils";
import { SAMLProtocolAllSettingsWizardForm } from "./saml-protcol-settings-all-option-wizard-form";
import { AppState } from "../../../store";
import { InboundCustomProtocolWizardForm } from "./custom-protcol-settings-wizard-form";
import { setAuthProtocolMeta } from "../../../store/actions";


/**
 * Proptypes for the application creation wizard component.
 */
interface ApplicationCreateWizardPropsInterface {
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

const STEPS: WizardStepInterface[] = [
    {
        icon: ApplicationWizardStepIcons.protocolSelection,
        title: "Protocol Selection",
        name: WizardStepsFormTypes.PROTOCOL_SELECTION
    },
    {
        icon: ApplicationWizardStepIcons.general,
        title: "General Settings",
        name: WizardStepsFormTypes.GENERAL_SETTINGS
    },
    {
        icon: ApplicationWizardStepIcons.protocolConfig,
        title: "Protocol Configuration",
        name: WizardStepsFormTypes.PROTOCOL_SETTINGS
    },
    {
        icon: ApplicationWizardStepIcons.summary,
        title: "Summary",
        name: WizardStepsFormTypes.SUMMARY
    }
];

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
        onUpdate
    } = props;

    const authProtocolMeta = useSelector((state: AppState) => state.application.meta.protocolMeta);

    const [wizardSteps, setWizardSteps] = useState<WizardStepInterface[]>(undefined);
    const [wizardState, setWizardState] = useState<WizardStateInterface>(undefined);
    const [partiallyCompletedStep, setPartiallyCompletedStep] = useState<number>(undefined);
    const [currentWizardStep, setCurrentWizardStep] = useState<number>(currentStep);
    const [templateSettings, setTemplateSettings] = useState<MainApplicationInterface>(undefined);

    const dispatch = useDispatch();

    const [submitGeneralSettings, setSubmitGeneralSettings] = useTrigger();
    const [submitOAuth, setSubmitOauth] = useTrigger();
    const [finishSubmit, setFinishSubmit] = useTrigger();
    const [selectedTemplate, setSelectedTemplate] = useState<ApplicationTemplateListItemInterface>(undefined);
    const [triggerProtocolSelectionSubmit, setTriggerProtocolSelectionSubmit] = useState<boolean>(false);
    const [selectedCustomInboundProtocol, setSelectedCustomInboundProtocol] = useState<boolean>(false);

    const [selectedSAMLMetaFile, setSelectedSAMLMetaFile] = useState<boolean>(false);

    /**
     *  Retrieve Application template data.
     *
     */
    const loadApplicationTemplateData = (id: string): void => {

        if (id === DefaultProtocolTemplate.OIDC) {
            setTemplateSettings(OAuthProtocolTemplate.application);
        } else if (id === DefaultProtocolTemplate.SAML) {
            setTemplateSettings(SAMLProtocolTemplate.application);
        } else if (id === DefaultProtocolTemplate.WS_TRUST) {
            setTemplateSettings(WSTrustProtocolTemplate.application);
        } else if (id === DefaultProtocolTemplate.WS_FEDERATION) {
            setTemplateSettings(PassiveStsProtocolTemplate.application);
        } else {
            getApplicationTemplateData(id)
                .then((response) => {
                    setTemplateSettings((response as ApplicationTemplateInterface).application);
                })
                .catch((error) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Application Template data Fetch Error"
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: "An error occurred while retrieving application template data",
                        level: AlertLevels.ERROR,
                        message: "Retrieval Error"
                    }));
                })
        }
    };

    /**
     * Creates a new application.
     *
     * @param {MainApplicationInterface} application - The application to be created.
     */
    const createNewApplication = (application: MainApplicationInterface): void => {
        createApplication(application)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully created the application",
                    level: AlertLevels.SUCCESS,
                    message: "Creation successful"
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!_.isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);

                    history.push(ApplicationConstants.PATHS.get("APPLICATION_EDIT").replace(":id",
                        createdAppID));

                    return;
                }

                // Fallback to applications page, if the location header is not present.
                history.push(ApplicationConstants.PATHS.get("APPLICATIONS"));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Create Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while creating the application",
                    level: AlertLevels.ERROR,
                    message: "Creation Error"
                }));
            });
    };

    /**
     * Updates application protocols.
     *
     * @param values - Form values.
     */
    const HandleApplicationProtocolsUpdate = (values: any): void => {
        handleWizardClose();
        updateAuthProtocolConfig(appId, values, selectedTemplate.authenticationProtocol)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully added new protocol configurations.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(appId);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application update Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while updating the application",
                    level: AlertLevels.ERROR,
                    message: "Update Error"
                }));
            });
    };

    /**
     * The following function creates a custom application.
     *
     * @param values
     */
    const handleCustomAppWizardFinish = (values: any): void => {

        let customApplication: MainApplicationInterface = emptyApplication();

        for (const [key, value] of Object.entries(values)) {
            customApplication = {
                ...customApplication,
                [key]: value
            }
        }

        createNewApplication(ApplicationManagementUtils.prefixTemplateNameToDescription(customApplication, template));
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = (): void => {
        const step = currentWizardStep;

        switch (wizardSteps[step]?.name) {
            case WizardStepsFormTypes.PROTOCOL_SELECTION:
                setTriggerProtocolSelectionSubmit(true);
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
                setSelectedTemplate(values as ApplicationTemplateListItemInterface);
            } else {
                setTriggerProtocolSelectionSubmit(false);
            }
        } else {
            setCurrentWizardStep(currentWizardStep + 1);
            if (_.has(wizardState, formType)) {
                setWizardState(_.set(wizardState, formType, values));
            } else {
                setWizardState(_.merge(wizardState, { [formType]: values }));
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

            summary = _.get(wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS],
                ("inboundProtocolConfiguration." + configName));

            if (selectedTemplate.id !== DefaultProtocolTemplate.SAML && !selectedCustomInboundProtocol) {
                summary = _.merge(
                    _.cloneDeep(templateSettings.inboundProtocolConfiguration[configName]),
                    summary
                );
            }

            return summary;
        } else {
            for (const [key, value] of Object.entries(wizardState)) {
                if (key === WizardStepsFormTypes.PROTOCOL_SELECTION) {
                    continue;
                }

                summary = {
                    ...summary,
                    ...value
                };
            }

            return _.merge(_.cloneDeep(templateSettings), summary);
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

        createNewApplication(ApplicationManagementUtils.prefixTemplateNameToDescription(application, selectedTemplate));
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
                            SAMLProtocolTemplateItem,
                            WSTrustProtocolTemplateItem
                        ] }
                        triggerSubmit={ triggerProtocolSelectionSubmit }
                        selectedProtocols={ selectedProtocols }
                        setSelectedCustomInboundProtocol={ setSelectedCustomInboundProtocol }
                    />
                );
            case WizardStepsFormTypes.GENERAL_SETTINGS:
                if (template.id === "custom-application") {
                    return (
                        <GeneralSettingsWizardForm
                            triggerSubmit={ submitGeneralSettings }
                            initialValues={ wizardState && wizardState[WizardStepsFormTypes.GENERAL_SETTINGS] }
                            onSubmit={ (values): void => {
                                handleCustomAppWizardFinish(values)
                            } }
                            templateValues={ templateSettings }
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
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.OIDC) {
                        return (
                            <OauthProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                // TODO remove if not needed
                                showCallbackURL={ true }
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.SAML) {
                        return (
                            (selectedTemplate.id === DefaultProtocolTemplate.SAML) ?
                                <SAMLProtocolAllSettingsWizardForm
                                    triggerSubmit={ submitOAuth }
                                    initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                    updateSelectedSAMLMetaFile={ setSelectedSAMLMetaFile }
                                    onSubmit={ (values): void => handleWizardFormSubmit(values,
                                        WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                /> :
                                <SAMLProtocolSettingsWizardForm
                                    triggerSubmit={ submitOAuth }
                                    initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                    templateValues={ templateSettings }
                                    onSubmit={ (values): void => handleWizardFormSubmit(values,
                                        WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                                />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_TRUST) {
                        return (
                            <WSTrustProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                            />
                        )
                    } else if (wizardState[WizardStepsFormTypes.PROTOCOL_SELECTION] ===
                        SupportedAuthProtocolTypes.WS_FEDERATION) {
                        return (
                            <PassiveStsProtocolSettingsWizardForm
                                triggerSubmit={ submitOAuth }
                                initialValues={ wizardState && wizardState[WizardStepsFormTypes.PROTOCOL_SETTINGS] }
                                templateValues={ templateSettings }
                                onSubmit={ (values): void => handleWizardFormSubmit(values,
                                    WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                            />
                        )
                    }
                }

                return null;
            case WizardStepsFormTypes.SUMMARY:
                if (addProtocol) {
                    return (
                        <ProtocolWizardSummary
                            triggerSubmit={ finishSubmit }
                            summary={ generateWizardSummary() }
                            onSubmit={ HandleApplicationProtocolsUpdate }
                            image={ selectedTemplate.authenticationProtocol }
                            customProtocol={ selectedCustomInboundProtocol }
                            samlMetaFileSelected={ selectedSAMLMetaFile }
                        />
                    )
                } else {
                    return (
                        <WizardSummary
                            triggerSubmit={ finishSubmit }
                            summary={ generateWizardSummary() }
                            onSubmit={ handleWizardFormFinish }
                        />
                    )
                }
        }
    };

    /**
     * Load template data and initialize the wizard.
     */
    useEffect(() => {
        if (selectedTemplate) {
            if (selectedTemplate.id === "custom-application") {
                const NEW_STEPS: WizardStepInterface[] = [ ...STEPS ];
                setWizardSteps(NEW_STEPS.splice(1, 1));
            } else {
                setWizardState(_.merge(wizardState,
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
    }, [selectedTemplate, selectedCustomInboundProtocol]);

    /**
     *  If custom protocol is selected
     */
    useEffect(() => {

        if (!selectedTemplate) {
            return
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
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: "An error occurred retrieving the protocol metadata.",
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                });
        }
    }, [selectedCustomInboundProtocol]);

    /**
     * Set initial steps.
     */
    useEffect(() => {
        if (addProtocol) {
            const NEW_STEPS: WizardStepInterface[] = [...STEPS];
            NEW_STEPS.splice(1, 1);
            setWizardSteps(NEW_STEPS);
        }
    }, [addProtocol]);

    /**
     * Set selected template if passed.
     */
    useEffect(() => {

        if (template) {
            setSelectedTemplate(template)
        }
    }, [template]);


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
    }, [partiallyCompletedStep]);

    /**
     * Called when protocol selection form trigger value is changed.
     */
    useEffect(() => {
        if (triggerProtocolSelectionSubmit) {
            setTriggerProtocolSelectionSubmit(!triggerProtocolSelectionSubmit);
        }
    }, [triggerProtocolSelectionSubmit]);

    return (
        wizardSteps
            ? (
                <Modal
                    open={ true }
                    className="wizard application-create-wizard"
                    dimmer="blurring"
                    onClose={ handleWizardClose }
                    closeOnDimmerClick
                    closeOnEscape
                >
                    <Modal.Header className="wizard-header">
                        { title }
                        { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                    </Modal.Header>
                    <Modal.Content className="steps-container">
                        <Steps.Group current={ currentWizardStep }>
                            { wizardSteps.map((step, index) => (
                                <Steps.Step
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                />
                            )) }
                        </Steps.Group>
                    </Modal.Content>
                    <Modal.Content className="content-container" scrolling>{ resolveStepContent() }</Modal.Content>
                    <Modal.Actions>
                        <Grid>
                            <Grid.Row column={ 1 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    <LinkButton floated="left" onClick={ handleWizardClose }>Cancel</LinkButton>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                    { currentWizardStep < wizardSteps.length - 1 && (
                                        <PrimaryButton floated="right" onClick={ navigateToNext }>
                                            Next <Icon name="arrow right"/>
                                        </PrimaryButton>
                                    ) }
                                    { currentWizardStep === wizardSteps.length - 1 && (
                                        <PrimaryButton floated="right" onClick={ navigateToNext }>Finish</PrimaryButton>
                                    ) }
                                    { currentWizardStep > 0 && (
                                        <LinkButton floated="right" onClick={ navigateToPrevious }>
                                            <Icon name="arrow left"/> Previous
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
    currentStep: 0
};
