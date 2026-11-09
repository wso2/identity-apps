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

import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";

/**
 * Hook that resolves the name of the page the flow handoff link points to when no target URL is set.
 * It follows the portal URL the server uses for each flow type.
 */
const useFlowHandoffDefaultTarget = (): string => {
    const { t } = useTranslation();
    const { metadata } = useAuthenticationFlowBuilderCore();

    switch (metadata?.flowType) {
        case FlowTypes.REGISTRATION:
        case FlowTypes.INVITED_USER_REGISTRATION:
            return t("flows:core.executions.flowHandoff.defaultTargets.registration");
        case FlowTypes.PASSWORD_RECOVERY:
            return t("flows:core.executions.flowHandoff.defaultTargets.passwordRecovery");
        default:
            return t("flows:core.executions.flowHandoff.defaultTargets.profileUpdate");
    }
};

export default useFlowHandoffDefaultTarget;
