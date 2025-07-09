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

import AIGeneratedFlowProvider from "@wso2is/admin.flow-builder-core.v1/providers/ai-generated-flow-provider";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import PasswordRecoveryFlowBuilderCore from "./password-recovery-flow-builder-core";

/**
 * Props interface of {@link PasswordRecoveryFlowBuilder}
 */
export type PasswordRecoveryFlowBuilderPropsInterface = IdentifiableComponentInterface;

/**
 * Entry point for the password recovery flow builder decorated with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns PasswordRecoveryFlowBuilder component.
 */
const PasswordRecoveryFlowBuilder: FunctionComponent<PasswordRecoveryFlowBuilderPropsInterface> = ({
    "data-componentid": componentId = "password-recovery-flow-builder",
    ...rest
}: PasswordRecoveryFlowBuilderPropsInterface): ReactElement => (
    <AIGeneratedFlowProvider>
        <PasswordRecoveryFlowBuilderCore
            data-componentid={ componentId }
            { ...rest }
        />
    </AIGeneratedFlowProvider>
);

export default PasswordRecoveryFlowBuilder;
