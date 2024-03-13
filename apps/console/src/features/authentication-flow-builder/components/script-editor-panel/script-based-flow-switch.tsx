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
import Grid from "@oxygen-ui/react/Grid";
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, {
    PropsWithChildren,
    ReactElement,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import AdaptiveScriptResetConfirmationModal from "./adaptive-script-reset-confirmation-modal";
import ScriptEditorPanel from "./script-editor-panel";
import { AdaptiveScriptUtils } from "../../../applications/utils/adaptive-script-utils";
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
        authenticationSequence,
        isConditionalAuthenticationEnabled,
        onConditionalAuthenticationToggle,
        updateAuthenticationSequence,
        applicationMetaData
    } = useAuthenticationFlow();

    const [ showScriptResetWarning, setShowScriptResetWarning ] = useState<boolean>(false);

    /**
     * This useEffect is responsible for deciding whether
     * the adaptive script section should be enabled or not.
     */
    useEffect(() => {
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
                    <AccordionSummary disabled={ readOnly }>
                        <Grid className="script-based-flow-switch-accordion-summary">
                            <Grid
                                xs={ 12 }
                                sm={ 6 }
                                md={ 2 }
                                lg={ 1 }
                                xl={ 1 }
                            >
                                <Switch
                                    checked={ isConditionalAuthenticationEnabled }
                                    onChange={ handleSwitchChange }
                                />
                            </Grid>
                            <Grid
                                className="script-based-flow-switch-text"
                                xs={ 12 }
                                sm={ 6 }
                                md={ 11 }
                                lg={ 11 }
                                xl={ 11 }
                            >
                                <Typography variant="body1">
                                    {
                                        t("console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.authenticationFlow.sections.scriptBased.accordion." +
                                            "title.heading")
                                    }
                                </Typography>
                                <Typography variant="body2">
                                    {
                                        t("console:develop.features.applications.edit.sections.signOnMethod." +
                                            "sections.authenticationFlow.sections.scriptBased.accordion." +
                                            "title.description")
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails className="script-based-flow-switch-accordion-details">
                        <ScriptEditorPanel/>
                    </AccordionDetails>
                </Accordion>
            </Box>
            { showScriptResetWarning && (
                <AdaptiveScriptResetConfirmationModal
                    open={ showScriptResetWarning }
                    onClose={ () => {
                        updateAuthenticationSequence({
                            script:
                                AdaptiveScriptUtils.generateScript(authenticationSequence?.steps?.length + 1).join("\n")
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
