/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { updateGovernanceConnector } from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import {
    UpdateGovernanceConnectorConfigInterface
} from "@wso2is/admin.server-configurations.v1/models/governance-connectors";
import PasswordRecoveryFlowBuilderConstants from "../constants/password-recovery-flow-builder-constants";

/**
 * Sets the Password Recovery flow builder feature status.
 *
 * @param enable - Flag to enable or disable the password recovery flow builder.
 * @returns A promise that resolves when the update is complete.
 */
const updateNewPasswordRecoveryPortalFeatureStatus = (enable: boolean = true): Promise<any> => {
    const payload: UpdateGovernanceConnectorConfigInterface = {
        operation: "UPDATE",
        properties: [
            {
                name: PasswordRecoveryFlowBuilderConstants.FLOW_BUILDER_STATUS_CONFIG_KEY,
                value: enable ? "true" : "false"
            }
        ]
    };

    return updateGovernanceConnector(
        payload,
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID
    );
};

export default updateNewPasswordRecoveryPortalFeatureStatus;
