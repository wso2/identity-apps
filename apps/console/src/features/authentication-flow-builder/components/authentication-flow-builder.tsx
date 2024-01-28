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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ReactFlowProvider } from "reactflow";
import AuthenticationFlowModeSwitchDisclaimerModal from "./authentication-flow-mode-switch-disclaimer-modal";
import AuthenticationFlowVisualEditor from "./authentication-flow-visual-editor";
import PredefinedFlowsSidePanel from "./predefined-flows-side-panel/predefined-flows-side-panel";
import ScriptBasedFlowSwitch from "./script-editor-panel/script-based-flow-switch";
import SidePanelDrawer from "./side-panel-drawer";
import { AppState } from "../../core/store";
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

    const {
        isAdaptiveAuthAvailable,
        isAuthenticationSequenceDefault,
        isVisualEditorEnabled,
        isLegacyEditorEnabled,
        refetchApplication,
        preferredAuthenticationFlowBuilderMode,
        setPreferredAuthenticationFlowBuilderMode
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
        } else {
            setActiveFlowMode(FlowModes[0]);
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
                                />
                            </ReactFlowProvider>
                            { isAdaptiveAuthAvailable && <ScriptBasedFlowSwitch /> }
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
