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

import { CircleInfoIcon, GearIcon } from "@oxygen-ui/react-icons";
import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import Image from "@oxygen-ui/react/Image";
import Toolbar from "@oxygen-ui/react/Toolbar";
import Typography from "@oxygen-ui/react/Typography";
import useDeploymentConfig from "@wso2is/common/src/hooks/use-deployment-configs";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    Heading,
    LinkButton,
    PrimaryButton
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, ReactNode, SVGProps, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import AdaptiveAuthTemplateChangeConfirmationModal from "./adaptive-auth-template-change-confimation-modal";
import AdaptiveAuthTemplateInfoModal from "./adaptive-auth-template-info-modal";
import BasicLoginFlowTemplateChangeConfirmationModal from "./basic-login-flow-template-change-confimation-modal";
import PredefinedSocialFlowHandlerModalFactory from "./predefined-social-flow-handler-modal-factory";
import { serverConfigurationConfig } from "../../../../extensions/configs/server-configuration";
import {
    AdaptiveAuthTemplateCategoryInterface,
    AdaptiveAuthTemplateInterface,
    AuthenticationSequenceInterface,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../../admin-applications-v1/models/application";
import { AdaptiveScriptUtils } from "../../../admin-applications-v1/utils/adaptive-script-utils";
import { ConnectionManagementConstants } from "../../../connections/constants/connection-constants";
import { getAuthenticatorIcons } from "../../../identity-providers/configs/ui";
import { GenericAuthenticatorInterface } from "../../../identity-providers/models";
import {
    getConnectorDetails,
    updateGovernanceConnector
} from "../../../server-configurations/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "../../../server-configurations/constants/server-configurations-constants";
import { AnalyticsConfigurationForm } from "../../../server-configurations/forms/analytics-form";
import {
    GovernanceConnectorInterface,
    UpdateGovernanceConnectorConfigInterface
} from "../../../server-configurations/models/governance-connectors";
import { GovernanceConnectorUtils } from "../../../server-configurations/utils/governance-connector-utils";
import { APPLE_LOGIN_SEQUENCE, ELK_RISK_BASED_TEMPLATE_NAME } from "../../constants/template-constants";
import * as FlowSequences from "../../data/flow-sequences";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";
import { PredefinedFlowCategories, SocialIdPPlaceholders } from "../../models/predefined-flows";
import "./predefined-flows-side-panel.scss";

/**
 * Proptypes for the Predefined Flows Side Panel component.
 */
export interface PredefinedFlowsSidePanelPropsInterface extends IdentifiableComponentInterface {
    /**
     * Callback to be fired when the user selects a predefined flow.
     * @param template - Selected template.
     */
    onAdaptiveAuthTemplateChange?: (template: AdaptiveAuthTemplateInterface) => void;
    /**
     * Callback to be fired when the user selects a predefined flow.
     * @param templaye - Selected template.
     */
    onBasicLoginTemplateChange?: (template: {
        sequenceCategoryId: string;
        sequenceId: string;
        sequence: AuthenticationSequenceInterface;
    }) => void;
    /**
     * Whether to show the adaptive login templates.
     */
    showAdaptiveLoginTemplates?: boolean;
    /**
     * Whether to show the basic login templates.
     */
    showBasicLoginTemplates?: boolean;
}

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const PlusIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
    </svg>
);

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const ChevronRightIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg viewBox="0 0 24 24" { ...rest }>
        <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
    </svg>
);

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const ArrowRightIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" { ...rest }>
        { /* eslint-disable-next-line max-len */ }
        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
    </svg>
);

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const LambdaIcon = ({ ...rest }: SVGProps<SVGSVGElement>): ReactElement => (
    <svg
        stroke="currentColor"
        fill="none"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
        { ...rest }
    >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M6 20l6.5 -9"></path>
        <path d="M19 20c-6 0 -6 -16 -12 -16"></path>
    </svg>
);

/**
 * Predefined flows side panel component.
 *
 * @param props - Props injected to the component.
 * @returns Predefined flows side panel component.
 */
const PredefinedFlowsSidePanel: FunctionComponent<PredefinedFlowsSidePanelPropsInterface> = (
    props: PredefinedFlowsSidePanelPropsInterface
) => {
    const {
        onAdaptiveAuthTemplateChange,
        onBasicLoginTemplateChange,
        showBasicLoginTemplates,
        showAdaptiveLoginTemplates,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const { deploymentConfig } = useDeploymentConfig();

    const {
        adaptiveAuthTemplates,
        authenticators,
        defaultAuthenticationSequence,
        updateAuthenticationSequence,
        onConditionalAuthenticationToggle
    } = useAuthenticationFlow();

    const authenticatorsMeta: GenericAuthenticatorInterface[] = Object.values(
        authenticators
    ).flat() as GenericAuthenticatorInterface[];

    const [ expanded, setExpanded ] = useState<string[]>([ "basic-login-panel" ]);
    const [
        showAdaptiveAuthTemplateChangeConfirmationModal,
        setShowAdaptiveAuthTemplateChangeConfirmationModal
    ] = useState<boolean>(false);
    const [
        showBasicLoginFlowTemplateChangeConfirmationModal,
        setShowBasicLoginFlowTemplateChangeConfirmationModal
    ] = useState<boolean>(false);
    const [ showAdaptiveAuthTemplateInfoModal, setShowAdaptiveAuthTemplateInfoModal ] = useState<boolean>(false);
    const [ selectedBasicLoginSequence, setSelectedBasicLoginSequence ] = useState<{
        sequenceCategoryId: string;
        sequenceId: string;
        sequence: AuthenticationSequenceInterface;
    }>(undefined);
    const [ selectedAdaptiveAuthTemplate, setSelectedAdaptiveAuthTemplate ] = useState<AdaptiveAuthTemplateInterface>(
        undefined
    );
    const [ selectedSocialFlowSequence, setSelectedSocialFlowSequence ] = useState<{
        id: string;
        sequence: AuthenticationSequenceInterface;
    }>(undefined);
    const [
        showPredefinedSocialFlowModalHandlerModalFactory,
        setShowPredefinedSocialFlowModalHandlerModalFactory
    ] = useState<boolean>(false);
    const [ openELKAnalyticsModal, setELKAnalyticsModalOpen ] = useState(false);
    const [ isConnectorRequestLoading, setConnectorRequestLoading ] = useState<boolean>(false);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ categoryId, setCategoryId ] = useState<string>(undefined);
    const [ connectorId, setConnectorId ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();

    /**
     * Handles the accordion change event.
     *
     * @param panel - Active panel.
     */
    const handleAccordionChange = (panel: string): void => {
        if (expanded.includes(panel)) {
            setExpanded(expanded.filter((item: string) => item !== panel));

            return;
        }

        setExpanded([ ...expanded, panel ]);
    };

    /**
     * Handler for the sequence selection event.
     * If the sequence is social, it will open the social handler factory instead of
     * directly updating the authentication sequence state.
     *
     * @param template - Selected template.
     */
    const handleBasicLoginSequenceChange = (template: {
        sequenceCategoryId: string;
        sequenceId: string;
        sequence: AuthenticationSequenceInterface;
    }): void => {
        if (!template) {
            return;
        }

        const sequence: AuthenticationSequenceInterface = {
            ...template.sequence,
            script: template.sequence.script ??
                AdaptiveScriptUtils.generateScript(template.sequence.steps.length + 1).join("\n")
        };

        if (template.sequenceCategoryId === PredefinedFlowCategories.Social) {
            setSelectedSocialFlowSequence({
                id: template.sequenceId,
                sequence: sequence
            });
            setShowPredefinedSocialFlowModalHandlerModalFactory(true);

            return;
        }

        updateAuthenticationSequence(sequence);
    };

    /**
     * Generates the login sequences.
     *
     * @returns Set of login sequences.
     */
    const generateLoginSequences = (): ReactElement[] => {
        return Object.entries(FlowSequences).map(([ sequenceCategoryId, sequenceCategory ]: [string, any]) => {
            let title: ReactNode = null;

            if (sequenceCategoryId === ((PredefinedFlowCategories.Basic as unknown) as string)) {
                title = t("authenticationFlow:predefinedFlows.categories.basic.label");
            } else if (sequenceCategoryId === ((PredefinedFlowCategories.MFA as unknown) as string)) {
                title = t("authenticationFlow:predefinedFlows.categories.mfa.label");
            } else if (sequenceCategoryId === ((PredefinedFlowCategories.Passwordless as unknown) as string)) {
                title = t("authenticationFlow:predefinedFlows.categories.passwordless.label");
            } else if (sequenceCategoryId === ((PredefinedFlowCategories.Social as unknown) as string)) {
                title = t("authenticationFlow:predefinedFlows.categories.social.label");
            }

            /**
             * Returns the display name of the social authenticator placeholders.
             *
             * @param authenticatorName - Name of the authenticator.
             * @param authenticatorIdP - IdP of the authenticator.
             * @returns Display name of the authenticator.
             */
            const getAuthenticatorDisplayName = (authenticatorName: string, authenticatorIdP: string): string => {
                if (authenticatorIdP !== "LOCAL") {
                    if (authenticatorIdP === SocialIdPPlaceholders.Apple) {
                        return t("authenticationFlow:predefinedFlows.authenticators.apple.displayName");
                    } else if (authenticatorIdP === SocialIdPPlaceholders.Facebook) {
                        return t("authenticationFlow:predefinedFlows.authenticators.facebook.displayName");
                    } else if (authenticatorIdP === SocialIdPPlaceholders.Google) {
                        return t("authenticationFlow:predefinedFlows.authenticators.google.displayName");
                    } else if (authenticatorIdP === SocialIdPPlaceholders.GitHub) {
                        return t("authenticationFlow:predefinedFlows.authenticators.github.displayName");
                    }
                }

                return authenticatorsMeta.find((authenticator: GenericAuthenticatorInterface) => {
                    return authenticator.defaultAuthenticator.name === authenticatorName;
                })?.displayName;
            };

            return (
                <Box key={ sequenceCategoryId } className="predefined-flow-category">
                    <Typography variant="body1">{ title }</Typography>
                    <Box className="predefined-flow-category-items">
                        { Object.entries(sequenceCategory).map(([ sequenceId, sequence ]: [string, any]) => {
                            if (sequenceId === APPLE_LOGIN_SEQUENCE
                                && new URL(deploymentConfig?.serverOrigin)?.hostname === ConnectionManagementConstants.
                                    LOCAL_SERVER_URL) {
                                return null;
                            }

                            return (
                                <Box
                                    key={ sequenceId }
                                    className={ classNames("predefined-flow-sequence", {
                                        "full-width": sequence.steps.length > 1
                                    }) }
                                    onClick={ () => {
                                        setSelectedBasicLoginSequence({
                                            sequence,
                                            sequenceCategoryId,
                                            sequenceId
                                        });
                                        setShowBasicLoginFlowTemplateChangeConfirmationModal(true);
                                    } }
                                >
                                    { sequence.steps.map((step: AuthenticationStepInterface, stepIndex: number) => (
                                        <>
                                            <div className="predefined-flow-sequence-step">
                                                { step?.options?.map(
                                                    (option: AuthenticatorInterface, optionIndex: number) => (
                                                        <>
                                                            <div
                                                                key={ optionIndex }
                                                                className="predefined-flow-sequence-step-option"
                                                            >
                                                                <Image
                                                                    height="14px"
                                                                    src={
                                                                        getAuthenticatorIcons()[option.authenticator] ||
                                                                        getAuthenticatorIcons()[option.idp]
                                                                    }
                                                                />
                                                                <Typography>
                                                                    { getAuthenticatorDisplayName(
                                                                        option.authenticator,
                                                                        option.idp
                                                                    ) }
                                                                </Typography>
                                                            </div>
                                                            { step.options.length > 1 &&
                                                                optionIndex !== step.options.length - 1 && (
                                                                <PlusIcon height="10px" />
                                                            ) }
                                                        </>
                                                    )
                                                ) }
                                            </div>
                                            { sequence.steps.length > 1 && stepIndex !== sequence.steps.length - 1 && (
                                                <div className="predefined-flow-sequence-step-separator">
                                                    <ArrowRightIcon height="10px" />
                                                </div>
                                            ) }
                                        </>
                                    )) }
                                </Box>
                            );
                        }) }
                    </Box>
                </Box>
            );
        });
    };

    /**
     * Load ELK analytics connector details.
     */
    const loadConnectorDetails = () => {
        const categoryId: string = ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID;
        const connectorId: string = ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID;

        setCategoryId(categoryId);
        setConnectorId(connectorId);
        setConnectorRequestLoading(true);

        getConnectorDetails(categoryId, connectorId)
            .then((response: GovernanceConnectorInterface) => {
                setConnector(response);
            })
            .catch((error: AxiosError) => {
                if (error?.response && error?.response?.data && error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error?.response?.data?.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setConnectorRequestLoading(false);
            });
    };

    /**
     * Handles ELK analytics configuration form submit.
     */
    const handleSubmit = (values: Record<string, unknown>) => {

        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: []
        };

        for (const key in values) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(key),
                value: values[ key ]
            });
        }

        if (
            serverConfigurationConfig.connectorToggleName[ connector?.name ] &&
            serverConfigurationConfig.autoEnableConnectorToggleProperty
        ) {
            data.properties.push({
                name: GovernanceConnectorUtils.decodeConnectorPropertyName(
                    serverConfigurationConfig.connectorToggleName[ connector?.name ]
                ),
                value: "true"
            });
        }

        setIsSubmitting(true);

        updateGovernanceConnector(data, categoryId, connectorId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("extensions:manage.serverConfigurations.analytics.form." +
                            "notification.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:notifications." +
                            "updateConnector.success.message"
                        )
                    })
                );
            })
            .catch((error: AxiosError) => {
                if (error?.response && error?.response?.data && error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "extensions:manage.serverConfigurations.analytics.form." +
                                "notification.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.message"
                            )
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                handleELKAnalyticsModalClose();
            });
    };

    const handleELKAnalyticsModalClose = (): void => setELKAnalyticsModalOpen(false);

    const handleELKAnalyticsModalOpen = (): void => {
        loadConnectorDetails();
        setELKAnalyticsModalOpen(true);
    };

    const elkAnalyticsConfigurationsModal = (): ReactElement => {
        let submitAuthorization: () => void;

        return (
            <Modal
                open={ openELKAnalyticsModal }
                onClose={ handleELKAnalyticsModalClose }
                size="small"
                dimmer="blurring"
            >
                <Modal.Header>
                    { connector?.friendlyName }
                    <Heading subHeading ellipsis as="h6">
                        { t("governanceConnectors:connectorSubHeading", {
                            name: connector?.friendlyName })
                        }
                    </Heading>
                </Modal.Header>
                <Modal.Content className="elk-analytics-modal" scrolling>
                    {
                        isConnectorRequestLoading
                            ? <ContentLoader inline="centered" active />
                            : (
                                <AnalyticsConfigurationForm
                                    onSubmit={ handleSubmit }
                                    triggerSubmission={ (submitFunctionCb: () => void) => {
                                        submitAuthorization = submitFunctionCb;
                                    } }
                                    initialValues={ connector }
                                    isConnectorEnabled={ true }
                                    isSubmitting={ isSubmitting }
                                    hideUpdateButton
                                    isModalForm
                                />
                            )
                    }
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 }>
                                <LinkButton
                                    data-testid={ `${componentId}-cancel-button` }
                                    floated="left"
                                    onClick={ () => handleELKAnalyticsModalClose() }
                                >
                                    { t("apiResources:tabs.scopes.form.cancelButton") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 }>
                                <PrimaryButton
                                    data-testid={ `${componentId}-finish-button` }
                                    floated="right"
                                    onClick={ () => submitAuthorization() }
                                    loading={ isSubmitting }
                                >
                                    { t("common:update") }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
        );
    };

    /**
     * Generates the adaptive authentication templates.
     *
     * @returns Set of adaptive authentication templates.
     */
    const generateAdaptiveAuthTemplates = (): ReactElement[] => {
        return Object.entries(adaptiveAuthTemplates).map(
            ([ categoryId, category ]: [string, AdaptiveAuthTemplateCategoryInterface]) => {
                if (!category?.templates || category?.templates?.length <= 0) {
                    return null;
                }

                return (
                    <Box key={ categoryId } className="predefined-flow-category">
                        <Typography variant="body1">{ category.displayName }</Typography>
                        <Box className="predefined-flow-category-items">
                            { category?.templates?.map((template: AdaptiveAuthTemplateInterface, index: number) => (
                                <Box key={ index } className="predefined-flow-sequence full-width no-hover">
                                    <div className="predefined-flow-sequence-step adaptive-auth-template">
                                        <div className="label">
                                            <LambdaIcon />
                                            { template.name }
                                        </div>
                                        <div className="actions">
                                            {
                                                template.name === ELK_RISK_BASED_TEMPLATE_NAME && (
                                                    <IconButton
                                                        size="small"
                                                        onClick={ () => {
                                                            setSelectedAdaptiveAuthTemplate(template);
                                                            handleELKAnalyticsModalOpen();
                                                        } }
                                                    >
                                                        <GearIcon size={ 14 } />
                                                    </IconButton>
                                                )
                                            }
                                            <IconButton
                                                size="small"
                                                onClick={ () => {
                                                    setSelectedAdaptiveAuthTemplate(template);
                                                    setShowAdaptiveAuthTemplateInfoModal(true);
                                                } }
                                            >
                                                <CircleInfoIcon size={ 14 } />
                                            </IconButton>
                                            <Button
                                                size="small"
                                                className="add-button"
                                                onClick={ () => {
                                                    setSelectedAdaptiveAuthTemplate(template);
                                                    setShowAdaptiveAuthTemplateChangeConfirmationModal(true);
                                                } }
                                            >
                                                { t("authenticationFlow:predefinedFlows.adaptive.actions.add") }
                                            </Button>
                                        </div>
                                    </div>
                                </Box>
                            )) }
                        </Box>
                    </Box>
                );
            }
        );
    };

    /**
     * Handles the data loading from a adaptive auth template when it is selected
     * from the panel.
     *
     * @param template - Adaptive authentication templates.
     */
    const handleAdaptiveAuthTemplateChange = (template: AdaptiveAuthTemplateInterface): void => {
        if (!template) {
            return;
        }

        let newSequence: AuthenticationSequenceInterface = {};

        if (template.code) {
            newSequence = {
                ...newSequence,
                script: template.code.join("\n")
            };
        }

        if (template.defaultAuthenticators) {
            const steps: AuthenticationStepInterface[] = [];

            for (const [ key, value ] of Object.entries(template.defaultAuthenticators)) {
                steps.push({
                    id: parseInt(key, 10),
                    options: value.local.map((authenticator: string) => {
                        return {
                            authenticator,
                            idp: "LOCAL"
                        };
                    })
                });
            }

            newSequence = {
                ...newSequence,
                attributeStepId: 1,
                steps,
                subjectStepId: 1
            };
        }

        // Since the adaptive auth templates contains a script,
        // need to enable the toggle. Else the script will be ignored on update.
        onConditionalAuthenticationToggle(true);
        updateAuthenticationSequence(newSequence);
    };

    return (
        <div className="predefined-flows-side-panel" data-componentid={ componentId }>
            <div className="toolbar-container">
                <Toolbar variant="dense">
                    <Typography>{ t("authenticationFlow:predefinedFlows.header") }</Typography>
                </Toolbar>
            </div>
            <div
                className={ classNames("predefined-flows-side-panel-content", {
                    "full-height": !showBasicLoginTemplates || !showAdaptiveLoginTemplates
                }) }
            >
                { showBasicLoginTemplates && (
                    <Accordion
                        square
                        disableGutters
                        defaultExpanded
                        expanded={ expanded.includes("basic-login-panel") }
                        className={ classNames("predefined-flow-categories", {
                            expanded: expanded.includes("basic-login-panel"),
                            "full-height": expanded.length === 1 && expanded.includes("basic-login-panel")
                        }) }
                    >
                        <AccordionSummary
                            className="predefined-flow-category-heading"
                            aria-controls="basic-login-panel-content"
                            id="basic-login-panel-header"
                            expandIcon={ <ChevronRightIcon height="14px" /> }
                            onClick={ () => handleAccordionChange("basic-login-panel") }
                        >
                            <Typography>{ t("authenticationFlow:predefinedFlows.basic.header") }</Typography>
                        </AccordionSummary>
                        <AccordionDetails>{ generateLoginSequences() }</AccordionDetails>
                    </Accordion>
                ) }
                { showAdaptiveLoginTemplates &&
                    adaptiveAuthTemplates &&
                    Object.entries(adaptiveAuthTemplates).length > 0 && (
                    <Accordion
                        square
                        disableGutters
                        defaultExpanded
                        expanded={ expanded.includes("conditional-login-panel") }
                        className={ classNames("predefined-flow-categories", {
                            expanded: expanded.includes("conditional-login-panel"),
                            "full-height": expanded.length === 1 && expanded.includes("conditional-login-panel")
                        }) }
                    >
                        <AccordionSummary
                            className="predefined-flow-category-heading"
                            aria-controls="conditional-login-panel-content"
                            id="conditional-login-panel-header"
                            expandIcon={ <ChevronRightIcon height="14px" /> }
                            onClick={ () => handleAccordionChange("conditional-login-panel") }
                        >
                            <Typography>{ t("authenticationFlow:predefinedFlows.adaptive.header") }</Typography>
                        </AccordionSummary>
                        <AccordionDetails>{ generateAdaptiveAuthTemplates() }</AccordionDetails>
                    </Accordion>
                ) }
            </div>
            { showAdaptiveAuthTemplateChangeConfirmationModal && (
                <AdaptiveAuthTemplateChangeConfirmationModal
                    onELKConfigureClick={ () => handleELKAnalyticsModalOpen() }
                    isELKRiskBased={ selectedAdaptiveAuthTemplate?.name === "ELK-Risk-Based" }
                    open={ showAdaptiveAuthTemplateChangeConfirmationModal }
                    onClose={ () => setShowAdaptiveAuthTemplateChangeConfirmationModal(false) }
                    selectedTemplate={ selectedAdaptiveAuthTemplate }
                    onTemplateChange={ (template: AdaptiveAuthTemplateInterface) => {
                        handleAdaptiveAuthTemplateChange(template);
                        onAdaptiveAuthTemplateChange && onAdaptiveAuthTemplateChange(template);
                    } }
                />
            ) }
            { showBasicLoginFlowTemplateChangeConfirmationModal && (
                <BasicLoginFlowTemplateChangeConfirmationModal
                    open={ showBasicLoginFlowTemplateChangeConfirmationModal }
                    onClose={ () => setShowBasicLoginFlowTemplateChangeConfirmationModal(false) }
                    selectedTemplate={ selectedBasicLoginSequence }
                    onTemplateChange={ (template: {
                        sequenceCategoryId: string;
                        sequenceId: string;
                        sequence: AuthenticationSequenceInterface;
                    }) => {
                        handleBasicLoginSequenceChange(template);
                        onBasicLoginTemplateChange && onBasicLoginTemplateChange(template);
                    } }
                />
            ) }
            { showAdaptiveAuthTemplateInfoModal && (
                <AdaptiveAuthTemplateInfoModal
                    template={ selectedAdaptiveAuthTemplate }
                    open={ showAdaptiveAuthTemplateInfoModal }
                    onClose={ () => setShowAdaptiveAuthTemplateInfoModal(false) }
                />
            ) }
            { showPredefinedSocialFlowModalHandlerModalFactory && (
                <PredefinedSocialFlowHandlerModalFactory
                    selectedSequence={ selectedSocialFlowSequence }
                    onSelect={ (sequence: AuthenticationSequenceInterface) => {
                        updateAuthenticationSequence({
                            ...defaultAuthenticationSequence,
                            ...sequence
                        });
                        setShowPredefinedSocialFlowModalHandlerModalFactory(false);
                    } }
                />
            ) }
            { elkAnalyticsConfigurationsModal() }
        </div>
    );
};

/**
 * Default props for the component.
 */
PredefinedFlowsSidePanel.defaultProps = {
    "data-componentid": "predefined-flows-side-panel",
    showAdaptiveLoginTemplates: true,
    showBasicLoginTemplates: true
};

export default PredefinedFlowsSidePanel;
