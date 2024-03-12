/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PrimaryButton } from "@wso2is/react-components";
import classNames from "classnames";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import { Dispatch } from "redux";
import AuthenticationFlowModeSwitchDisclaimerModal from "./authentication-flow-mode-switch-disclaimer-modal";
import AuthenticationFlowVisualEditor from "./authentication-flow-visual-editor";
import PredefinedFlowsSidePanel from "./predefined-flows-side-panel/predefined-flows-side-panel";
import ScriptBasedFlowSwitch from "./script-editor-panel/script-based-flow-switch";
import SidePanelDrawer from "./side-panel-drawer";
import {
    updateAuthenticationSequence as updateAuthenticationSequenceFromAPI
} from "../../applications/api/application";
import {
    ApplicationInterface,
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../applications/models/application";
import { AdaptiveScriptUtils } from "../../applications/utils/adaptive-script-utils";
import { AppState } from "../../core/store";
import {
    IdentityProviderManagementConstants
} from "../../identity-providers/constants/identity-provider-management-constants";
import { OrganizationType } from "../../organizations/constants/organization-constants";
import useAuthenticationFlow from "../hooks/use-authentication-flow";
import { AuthenticationFlowBuilderModes, AuthenticationFlowBuilderModesInterface } from "../models/flow-builder";
import "./sign-in-methods.scss";

/**
 * Proptypes for the Authentication flow builder component.
 */
export interface AuthenticationFlowBuilderPropsInterface extends IdentifiableComponentInterface {
    /**
     * Legacy builder.
     */
    legacyBuilder: ReactElement;
    /**
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void, template?: any) => void;
    /**
     * Make the component read only.
     */
    readOnly?: boolean;
}

/**
 * Authentication flow builder component.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow builder component.
 */
const AuthenticationFlowBuilder: FunctionComponent<AuthenticationFlowBuilderPropsInterface> = (
    props: AuthenticationFlowBuilderPropsInterface
): ReactElement => {
    const {
        legacyBuilder: LegacyBuilder,
        onIDPCreateWizardTrigger,
        readOnly,
        "data-componentid": componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        applicationMetaData,
        isAdaptiveAuthAvailable,
        isAuthenticationSequenceDefault,
        isVisualEditorEnabled,
        isLegacyEditorEnabled,
        refetchApplication,
        authenticationSequence,
        preferredAuthenticationFlowBuilderMode,
        setPreferredAuthenticationFlowBuilderMode,
        isConditionalAuthenticationEnabled,
        updateAuthenticationSequence,
        isSystemApplication,
        onActiveFlowModeChange
    } = useAuthenticationFlow();

    const FlowModes: AuthenticationFlowBuilderModesInterface[] = readOnly ? [
        {
            id: 0,
            label: t("console:loginFlow.modes.legacy.label"),
            mode: AuthenticationFlowBuilderModes.Classic
        }
    ] : [
        {
            id: 0,
            label: t("console:loginFlow.modes.legacy.label"),
            mode: AuthenticationFlowBuilderModes.Classic
        },
        {
            extra: <Chip size="small" label="Beta" className="oxygen-chip-beta" />,
            id: 1,
            label: t("console:loginFlow.modes.visual.label"),
            mode: AuthenticationFlowBuilderModes.Visual
        }
    ];

    const isSAASDeployment: boolean = useSelector((state: AppState) => state?.config?.ui?.isSAASDeployment);
    const orgType: OrganizationType = useSelector((state: AppState) => state?.organization?.organizationType);

    const [ activeFlowMode, setActiveFlowMode ] = useState<AuthenticationFlowBuilderModesInterface>(FlowModes[0]);
    const [ flowModeToSwitch, setFlowModeToSwitch ] = useState<AuthenticationFlowBuilderModesInterface>(null);
    const [ isPredefinedFlowsSidePanelDrawerOpen ] = useState<boolean>(isAuthenticationSequenceDefault);
    const [
        showAuthenticationFlowModeSwitchDisclaimerModal,
        setShowAuthenticationFlowModeSwitchDisclaimerModal
    ] = useState<boolean>(false);

    /**
     * Set the active flow mode to the flow mode to switch.
     */
    useEffect(() => {
        if (isVisualEditorEnabled && isLegacyEditorEnabled) {
            return;
        }

        if (isVisualEditorEnabled && !readOnly) {
            setActiveFlowMode(FlowModes[1]);
            onActiveFlowModeChange(FlowModes[1]?.mode);
        } else {
            setActiveFlowMode(FlowModes[0]);
            onActiveFlowModeChange(FlowModes[0]?.mode);
        }
    }, [ isVisualEditorEnabled, isLegacyEditorEnabled ]);

    /**
     * Set the active flow mode to the preferred flow mode when the user preference is updated.
     */
    useEffect(() => {
        if (!preferredAuthenticationFlowBuilderMode) {
            return;
        }

        const activeMode: AuthenticationFlowBuilderModesInterface = FlowModes.find(
            (mode: AuthenticationFlowBuilderModesInterface) => mode.mode === preferredAuthenticationFlowBuilderMode
        );

        setActiveFlowMode(activeMode);
        onActiveFlowModeChange(activeMode?.mode);
    }, [ preferredAuthenticationFlowBuilderMode ]);

    /**
     * Handles the flow mode switch.
     *
     * @param _ - Event.
     * @param newTabIndex - New tab index.
     */
    const handleTabChange = (_: React.SyntheticEvent, newTabIndex: number): void => {
        setFlowModeToSwitch(FlowModes[newTabIndex]);
        setShowAuthenticationFlowModeSwitchDisclaimerModal(true);
    };

    /**
     * Handles the `onUpdate` callback of the `VisualEditor`.
     *
     * @param newSequence - Updated sequence.
     * @param isRevertFlow - Is triggered from revert flow.
     */
    const handleOnUpdate = (
        newSequence: AuthenticationSequenceInterface,
        isRevertFlow?: boolean
    ): void => {
        let payload: Partial<ApplicationInterface> = {};
        const sequence: AuthenticationSequenceInterface = {
            ...cloneDeep(newSequence),
            type: isRevertFlow
                ? AuthenticationSequenceType.DEFAULT
                : AuthenticationSequenceType.USER_DEFINED
        };

        if (
            !isAdaptiveAuthAvailable
            || !isConditionalAuthenticationEnabled
            || AdaptiveScriptUtils.isEmptyScript(authenticationSequence.script)
        ) {
            sequence.script = AdaptiveScriptUtils.generateScript(
                authenticationSequence?.steps?.length + 1).join("\n"
            );
        }

        if (orgType === OrganizationType.SUBORGANIZATION) {
            sequence.script = "";
        }

        // Update the modified script state in the context.
        updateAuthenticationSequence({
            ...newSequence,
            script: sequence.script
        });

        // If the updating application is a system application,
        // we need to send the application name in the PATCH request.
        if (isSystemApplication) {
            payload = {
                authenticationSequence: sequence,
                name: applicationMetaData?.name
            };
        } else {
            payload = {
                authenticationSequence: sequence
            };
        }

        const isValid: boolean = validateSteps(newSequence?.steps);

        if (!isValid) {
            return;
        }

        updateAuthenticationSequenceFromAPI(applicationMetaData?.id, payload)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:develop.features.applications.notifications.updateAuthenticationFlow" +
                                ".success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:develop.features.applications.notifications.updateAuthenticationFlow" +
                                ".success.message"
                        )
                    })
                );
            })
            .finally(() => refetchApplication());
    };

    /**
     * Validate the authentication steps.
     *
     * @param options - Authenticator options.
     * @returns True or false - Is steps are valid or not.
     */
    const validateSteps = (steps: AuthenticationStepInterface[]): boolean => {

        // Don't allow identifier first being the only authenticator in the flow.
        if ( steps.length === 1
            && steps[ 0 ].options.length === 1
            && steps[ 0 ].options[ 0 ].authenticator
                === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR ) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.updateOnlyIdentifierFirstError" +
                        ".description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.updateOnlyIdentifierFirstError" +
                        ".message"
                    )
                })
            );

            return false;
        }

        // Don't allow identifier first being with another authenticator in the 1FA flow.
        if (
            steps.length === 1
            && steps[0].options.length > 1
            && handleIdentifierFirstInStep(steps[0].options)
        ) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.updateIdentifierFirstInFirstStepError" +
                        ".description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.updateIdentifierFirstInFirstStepError" +
                        ".message"
                    )
                })
            );

            return false;
        }

        return true;
    };

    /**
     * Check if the options include the Identifier First as an authenticator.
     *
     * @param options - Authenticator options.
     * @returns true or false - Options include Identifier First or not.
     */
    const handleIdentifierFirstInStep = (options: AuthenticatorInterface[]): boolean =>
        options.some(
            (option: AuthenticatorInterface) =>
                option.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
        );

    return (
        <Box className="sign-in-method-split-view">
            <SidePanelDrawer
                open={ isPredefinedFlowsSidePanelDrawerOpen }
                className={
                    classNames("predefined-side-panel-drawer", { hidden: activeFlowMode.id === FlowModes[0].id })
                }
                panel={ <PredefinedFlowsSidePanel showAdaptiveLoginTemplates={ isAdaptiveAuthAvailable } /> }
                panelControlsLabel={ t("console:loginFlow.predefinedFlows.panelHeader") }
            >
                <div id="drawer-container" style={ { position: "relative" } }>
                    <Box>
                        { isLegacyEditorEnabled && isVisualEditorEnabled && (
                            <Box>
                                <Tabs
                                    value={ activeFlowMode.id }
                                    onChange={ handleTabChange }
                                    aria-label="basic tabs example"
                                >
                                    { FlowModes.map((mode: AuthenticationFlowBuilderModesInterface) => (
                                        <Tab
                                            key={ mode.id }
                                            label={ (
                                                <div className="beta-feature-tab-item">
                                                    <Typography sx={ { fontWeight: 500 } }>
                                                        { mode.label }
                                                    </Typography>
                                                    { isSAASDeployment && mode.extra }
                                                </div>
                                            ) }
                                            data-componentid={ `${componentId}-${ mode.id }-tab` }
                                        />
                                    )) }
                                </Tabs>
                            </Box>
                        ) }
                        <TabPanel
                            index={ 0 }
                            value={ activeFlowMode.id }
                            data-componentid={ `${componentId}-legacy-builder` }
                        >
                            <div className="ui basic very padded segment sign-on-methods-tab-content">
                                { LegacyBuilder }
                            </div>
                        </TabPanel>
                        <TabPanel
                            index={ 1 }
                            value={ activeFlowMode.id }
                            className="visual-editor-tab-panel"
                            data-componentid={ `${componentId}-visual-builder` }
                        >
                            <ReactFlowProvider>
                                <AuthenticationFlowVisualEditor
                                    onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                                    className="visual-editor"
                                    onUpdate={ (
                                        sequence: AuthenticationSequenceInterface,
                                        isRevertFlow?: boolean
                                    ) => handleOnUpdate(sequence, isRevertFlow) }
                                />
                            </ReactFlowProvider>
                            { isAdaptiveAuthAvailable && <ScriptBasedFlowSwitch /> }
                            { isAdaptiveAuthAvailable && isConditionalAuthenticationEnabled && (
                                <div className="visual-editor-update-button-container">
                                    <PrimaryButton
                                        variant="contained"
                                        className="update-button"
                                        data-componentid={ `${componentId}-update-button` }
                                        onClick={ () => handleOnUpdate(authenticationSequence) }
                                    >
                                        { t("console:loginFlow.visualEditor.actions.update.label") }
                                    </PrimaryButton>
                                </div>
                            ) }
                        </TabPanel>
                    </Box>
                </div>
            </SidePanelDrawer>
            {
                showAuthenticationFlowModeSwitchDisclaimerModal && (
                    <AuthenticationFlowModeSwitchDisclaimerModal
                        mode={ flowModeToSwitch }
                        open={ showAuthenticationFlowModeSwitchDisclaimerModal }
                        onPrimaryActionClick={ () => {
                            setActiveFlowMode(flowModeToSwitch);
                            setFlowModeToSwitch(null);
                            setShowAuthenticationFlowModeSwitchDisclaimerModal(false);
                            refetchApplication();
                            setPreferredAuthenticationFlowBuilderMode(flowModeToSwitch?.mode);
                        } }
                        onClose={ () => {
                            setFlowModeToSwitch(null);
                            setShowAuthenticationFlowModeSwitchDisclaimerModal(false);
                        } }
                    />
                )
            }
        </Box>
    );
};

/**
 * Default props for the component.
 */
AuthenticationFlowBuilder.defaultProps = {
    "data-componentid": "authentication-flow-builder",
    readOnly: false
};

export default AuthenticationFlowBuilder;
