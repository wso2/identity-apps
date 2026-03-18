/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { useSelector } from "react-redux";
import useCompatibilitySettings from "./use-compatibility-settings";
import { CompatibilitySettingsInterface, FlowExecutionCompatibilityInterface } from "../models/config";
import type { AppState } from "../store";

/**
 * Supported legacy flow types for the `useEnableLegacyFlows` hook.
 */
export enum LegacyFlowType {
    SELF_REGISTRATION = "SELF_REGISTRATION",
    INVITED_USER_REGISTRATION = "INVITED_USER_REGISTRATION",
    PASSWORD_RECOVERY = "PASSWORD_RECOVERY"
}

/**
 * Resolves effective legacy enablement for one flow using the priority:
 * server flag first, then compatibility flag.
 */
const resolveIndividualFlow = (serverFlag: boolean, compatibilityFlag: boolean): boolean => {
    if (serverFlag) {
        return true;
    }

    return compatibilityFlag;
};

/**
 * Returns the effective legacy-flow-enabled flag for a given flow type.
 *
 * Priority is resolved according to (in order to enable a flow):
 * 1. Server → flowExecution.enableLegacyFlows (all flows)
 * 2. Server → flowExecution.<individualFlag>
 * 3. Compatibility → flowExecution.enableLegacyFlows (all flows)
 * 4. Compatibility → flowExecution.<individualFlag>
 *
 * @param flowType - Legacy flow type for which the flag should be resolved.
 * @returns Effective enableLegacy flag for the given flow type.
 */
export const useEnableLegacyFlows = (flowType: LegacyFlowType): boolean => {
    const { compatibilitySettings } = useCompatibilitySettings();

    const deploymentFlowExecutionConfig: {
        enableLegacyFlows: boolean;
        enableLegacySelfRegistrationFlow?: boolean;
        enableLegacyInvitedUserRegistrationFlow?: boolean;
        enableLegacyPasswordRecoveryFlow?: boolean;
    } | undefined = useSelector((state: AppState) => state?.config?.ui?.flowExecution);

    const compatibilityFlowExecutionConfig: FlowExecutionCompatibilityInterface | undefined =
        (compatibilitySettings as CompatibilitySettingsInterface | undefined)?.flowExecution;

    const serverEnableLegacyFlows: boolean = deploymentFlowExecutionConfig?.enableLegacyFlows ?? false;
    const compatibilityEnableLegacyFlows: boolean =
        compatibilityFlowExecutionConfig?.enableLegacyFlows === "true";
    const defaultLegacyEnablement: boolean = serverEnableLegacyFlows || compatibilityEnableLegacyFlows;

    if (serverEnableLegacyFlows || compatibilityEnableLegacyFlows) {
        return true;
    }

    const serverEnableLegacySelfRegistrationFlow: boolean =
        deploymentFlowExecutionConfig?.enableLegacySelfRegistrationFlow ?? defaultLegacyEnablement;
    const serverEnableLegacyInvitedUserRegistrationFlow: boolean =
        deploymentFlowExecutionConfig?.enableLegacyInvitedUserRegistrationFlow ?? defaultLegacyEnablement;
    const serverEnableLegacyPasswordRecoveryFlow: boolean =
        deploymentFlowExecutionConfig?.enableLegacyPasswordRecoveryFlow ?? defaultLegacyEnablement;
    const compatibilityEnableLegacySelfRegistrationFlow: boolean =
        compatibilityFlowExecutionConfig?.enableLegacySelfRegistrationFlow === "true";
    const compatibilityEnableLegacyInvitedUserRegistrationFlow: boolean =
        compatibilityFlowExecutionConfig?.enableLegacyInvitedUserRegistrationFlow === "true";
    const compatibilityEnableLegacyPasswordRecoveryFlow: boolean =
        compatibilityFlowExecutionConfig?.enableLegacyPasswordRecoveryFlow === "true";

    switch (flowType) {
        case LegacyFlowType.SELF_REGISTRATION:
            return resolveIndividualFlow(
                serverEnableLegacySelfRegistrationFlow,
                compatibilityEnableLegacySelfRegistrationFlow
            );
        case LegacyFlowType.INVITED_USER_REGISTRATION:
            return resolveIndividualFlow(
                serverEnableLegacyInvitedUserRegistrationFlow,
                compatibilityEnableLegacyInvitedUserRegistrationFlow
            );
        case LegacyFlowType.PASSWORD_RECOVERY:
            return resolveIndividualFlow(
                serverEnableLegacyPasswordRecoveryFlow,
                compatibilityEnableLegacyPasswordRecoveryFlow
            );
        default:
            return true;
    }
};

export default useEnableLegacyFlows;
