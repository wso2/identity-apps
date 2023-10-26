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

import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Tab from "@oxygen-ui/react/Tab";
import TabPanel from "@oxygen-ui/react/TabPanel";
import Tabs from "@oxygen-ui/react/Tabs";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, SVGAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactFlowProvider } from "reactflow";
import AuthenticationFlowModeSwitchDisclaimerModal from "./authentication-flow-mode-switch-disclaimer-modal";
import AuthenticationFlowVisualEditor from "./authentication-flow-visual-editor";
import PredefinedFlowsSidePanel from "./predefined-flows-side-panel/predefined-flows-side-panel";
import ScriptEditorSidePanel from "./script-editor-side-panel/script-editor-side-panel";
import SidePanelDrawer from "./side-panel-drawer";
import useAuthenticationFlow from "../hooks/use-authentication-flow";
import { AuthenticationFlowBuilderModesInterface } from "../models/flow-builder";
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
}

// TODO: Move this to Oxygen UI once https://github.com/wso2/oxygen-ui/issues/158 is fixed.
const CodeWindowIcon = ({ width = 16, height = 16, ...rest }: SVGAttributes<SVGSVGElement>): ReactElement => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={ width }
        height={ height }
        viewBox="0 0 640 512"
        { ...rest }
    >
        { /* eslint-disable max-len */ }
        <path d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"/>
        { /* eslint-enable max-len */ }
    </svg>
);

/**
 * Authentication flow builder component.
 *
 * @param props - Props injected to the component.
 * @returns Authentication flow builder component.
 */
const AuthenticationFlowBuilder: FunctionComponent<AuthenticationFlowBuilderPropsInterface> = (
    props: AuthenticationFlowBuilderPropsInterface
): ReactElement => {
    const { legacyBuilder: LegacyBuilder, onIDPCreateWizardTrigger, "data-componentid": componentId } = props;

    const { t } = useTranslation();

    const {
        isAdaptiveAuthAvailable,
        isAuthenticationSequenceDefault,
        isVisualEditorEnabled,
        isLegacyEditorEnabled,
        refetchApplication
    } = useAuthenticationFlow();

    const FlowModes: AuthenticationFlowBuilderModesInterface[] = [
        {
            id: 0,
            label: t("console:loginFlow.modes.legacy.label")
        },
        {
            extra: <Chip size="small" label="Beta" className="oxygen-chip-beta" />,
            id: 1,
            label: t("console:loginFlow.modes.visual.label")
        }
    ];

    const [ activeFlowMode, setActiveFlowMode ] = useState<AuthenticationFlowBuilderModesInterface>(FlowModes[0]);
    const [ flowModeToSwitch, setFlowModeToSwitch ] = useState<AuthenticationFlowBuilderModesInterface>(null);
    const [ isScriptEditorSidePanelDrawerOpen, setIsScriptEditorSidePanelDrawerOpen ] = useState<boolean>(false);
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

        if (isVisualEditorEnabled) {
            setActiveFlowMode(FlowModes[1]);
        } else {
            setActiveFlowMode(FlowModes[0]);
        }
    }, [ isVisualEditorEnabled, isLegacyEditorEnabled ]);

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
                                                    <Typography sx={ { fontWeight: 500 } }>{ mode.label }</Typography>
                                                    { mode.extra }
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
                            <SidePanelDrawer
                                open={ isScriptEditorSidePanelDrawerOpen }
                                onClose={ () => {
                                    setIsScriptEditorSidePanelDrawerOpen(false);
                                } }
                                className={
                                    classNames("script-editor-drawer", { "standalone": !isLegacyEditorEnabled })
                                }
                                drawerIcon={ <CodeWindowIcon height={ 16 } width={ 16 } /> }
                                panel={ isAdaptiveAuthAvailable && <ScriptEditorSidePanel /> }
                                panelControlsLabel={ t("console:loginFlow.scriptEditor.panelHeader") }
                            >
                                <ReactFlowProvider>
                                    <AuthenticationFlowVisualEditor
                                        onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                                        className={
                                            classNames("visual-editor", { "with-panel": isAdaptiveAuthAvailable })
                                        }
                                    />
                                </ReactFlowProvider>
                            </SidePanelDrawer>
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
    "data-componentid": "authentication-flow-builder"
};

export default AuthenticationFlowBuilder;
