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

import Accordion from "@oxygen-ui/react/Accordion";
import AccordionDetails from "@oxygen-ui/react/AccordionDetails";
import AccordionSummary from "@oxygen-ui/react/AccordionSummary";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Grid from "@oxygen-ui/react/Grid";
import Switch from "@oxygen-ui/react/Switch";
import Tooltip from "@oxygen-ui/react/Tooltip";
import Typography from "@oxygen-ui/react/Typography";
import { DiamondIcon } from "@oxygen-ui/react-icons";
import ConditionalAuthPremiumBanner
    from "@wso2is/admin.applications.v1/components/banners/conditional-auth-premium-banner";
import { AdaptiveScriptUtils } from "@wso2is/admin.applications.v1/utils/adaptive-script-utils";
import { AppState } from "@wso2is/admin.core.v1/store";
import useFeatureGate, { UseFeatureGateInterface } from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import { LOGIN_FLOW_AI_FEATURE_TAG } from "@wso2is/admin.login-flow.ai.v1/constants/login-flow-ai-constants";
import useAILoginFlow from "@wso2is/admin.login-flow.ai.v1/hooks/use-ai-login-flow";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    PropsWithChildren,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import AdaptiveScriptResetConfirmationModal from "./adaptive-script-reset-confirmation-modal";
import ScriptEditorPanel from "./script-editor-panel";
import useAuthenticationFlow from "../../hooks/use-authentication-flow";
import "./script-based-flow-switch.scss";

/**
 * Proptypes for the Script Based Flow switching component.
 */
export interface ScriptBasedFlowSwitchPropsInterface extends IdentifiableComponentInterface {
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
}

/**
 * Script based flow switch component.
 *
 * @param props - Props injected to the component.
 * @returns Script based flow switch component.
 */
const ScriptBasedFlowSwitch = (props: PropsWithChildren<ScriptBasedFlowSwitchPropsInterface>): ReactElement => {
    const { readOnly, "data-componentid": componentId } = props;

    const { t } = useTranslation();

    const {
        isConditionalAuthenticationEnabled,
        onConditionalAuthenticationToggle,
        updateAuthenticationSequence,
        applicationMetaData
    } = useAuthenticationFlow();

    const { aiGeneratedLoginFlow } = useAILoginFlow();

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const [ showScriptResetWarning, setShowScriptResetWarning ] = useState<boolean>(false);

    const applicationDisabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.applications?.disabledFeatures);

    const { conditionalAuthPremiumFeature }: UseFeatureGateInterface = useFeatureGate();

    /**
     * This useEffect is responsible for deciding whether
     * the adaptive script section should be enabled or not.
     */
    useEffect(() => {
        // Enable conditional authentication script for AI generated authentication sequence.
        if (!applicationDisabledFeatures?.includes(LOGIN_FLOW_AI_FEATURE_TAG)
            && !isSubOrganization()
            && aiGeneratedLoginFlow?.script
            && !AdaptiveScriptUtils.isDefaultScript(
                aiGeneratedLoginFlow.script,
                aiGeneratedLoginFlow?.steps?.length
            )
            && !AdaptiveScriptUtils.isEmptyScript(aiGeneratedLoginFlow?.script)) {
            onConditionalAuthenticationToggle(true);

            return;
        }

        if (applicationMetaData?.authenticationSequence?.script
                && !AdaptiveScriptUtils.isDefaultScript(
                    applicationMetaData.authenticationSequence.script,
                    applicationMetaData.authenticationSequence?.steps?.length
                )
                && !AdaptiveScriptUtils.isEmptyScript(applicationMetaData.authenticationSequence?.script)) {
            onConditionalAuthenticationToggle(true);

            return;
        }

        onConditionalAuthenticationToggle(false);
    }, [ applicationMetaData?.authenticationSequence?.script ]);

    const handleSwitchChange = () => {
        if (isConditionalAuthenticationEnabled) {
            setShowScriptResetWarning(true);

            return;
        }

        onConditionalAuthenticationToggle(true);
    };

    return (
        <>
            <Box className="script-based-flow-switch" data-componentid={ componentId }>
                <Accordion expanded={ isConditionalAuthenticationEnabled } elevation={ 0 }>
                    <AccordionSummary>
                        <Box display="flex" flexDirection="column" width="100%">
                            <Grid className="script-based-flow-switch-accordion-summary">
                                <Grid
                                    xs={ 12 }
                                    sm={ 6 }
                                    md={ 2 }
                                    lg={ 1 }
                                    xl={ 1 }
                                >
                                    {
                                        !readOnly && (
                                            <Switch
                                                checked={ isConditionalAuthenticationEnabled }
                                                onChange={ handleSwitchChange }
                                            />
                                        )
                                    }
                                </Grid>
                                <Grid
                                    className="script-based-flow-switch-text"
                                    xs={ 12 }
                                    sm={ 6 }
                                    md={ 11 }
                                    lg={ 11 }
                                    xl={ 11 }
                                >
                                    <div className="title">
                                        <Typography variant="body1">
                                            {
                                                t("applications:edit.sections.signOnMethod." +
                                                    "sections.authenticationFlow.sections.scriptBased.accordion." +
                                                    "title.heading" + (readOnly && !conditionalAuthPremiumFeature
                                                    ? ".readOnly" : ".readWrite"))
                                            }
                                        </Typography>
                                        { readOnly && !conditionalAuthPremiumFeature && (
                                            <Tooltip
                                                title={ t("applications:edit.sections.signOnMethod.sections." +
                                                    "authenticationFlow.sections.scriptBased.accordion.title." +
                                                    "tooltip.readOnly") }>
                                                <span>
                                                    <Icon name="warning sign" color="yellow" />
                                                </span>
                                            </Tooltip>)
                                        }
                                        {
                                            conditionalAuthPremiumFeature && (
                                                <Chip
                                                    icon = { <DiamondIcon /> }
                                                    label={ t(FeatureStatusLabel.PREMIUM) }
                                                    className="oxygen-menu-item-chip oxygen-chip-premium ml-2"
                                                    style={ { height: "fit-content" } }
                                                />
                                            )
                                        }
                                    </div>
                                    <Typography variant="body2">
                                        {
                                            t("applications:edit.sections.signOnMethod." +
                                                "sections.authenticationFlow.sections.scriptBased.accordion." +
                                                "title.description")
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                            <ConditionalAuthPremiumBanner/>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails className="script-based-flow-switch-accordion-details">
                        <ScriptEditorPanel readOnly={ readOnly }/>
                    </AccordionDetails>
                </Accordion>
            </Box>
            { showScriptResetWarning && (
                <AdaptiveScriptResetConfirmationModal
                    open={ showScriptResetWarning }
                    onClose={ () => {
                        updateAuthenticationSequence({
                            script: ""
                        });
                        setShowScriptResetWarning(false);
                    } }
                />
            ) }
        </>
    );
};

/**
 * Default props for the script based flow switch component.
 */
ScriptBasedFlowSwitch.defaultProps = {
    "data-componentid": "script-based-flow-switch"
};

export default ScriptBasedFlowSwitch;
