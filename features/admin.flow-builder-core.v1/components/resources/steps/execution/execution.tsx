/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FC, ReactElement, memo } from "react";
import ExecutionMinimal from "./execution-minimal";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { ExecutionTypes } from "../../../../models/steps";
import { CommonStepFactoryPropsInterface } from "../common-step-factory";
import View from "../view/view";

/**
 * Props interface of {@link Execution}
 */
export type ExecutionPropsInterface = CommonStepFactoryPropsInterface & IdentifiableComponentInterface;

/**
 * Execution Node component.
 *
 * @param props - Props injected to the component.
 * @returns Execution node component.
 */
const Execution: FC<ExecutionPropsInterface> = memo(({
    id,
    data,
    resource
}: ExecutionPropsInterface): ReactElement => {
    const { setLastInteractedResource, setLastInteractedStepId } = useAuthenticationFlowBuilderCore();

    const components: Element[] = data?.components as Element[] || [];

    /**
     * Resolves the execution name based on the type.
     *
     * @param executionType - The type of the execution.
     * @returns Resolved execution name.
     */
    const resolveExecutionName = (executionType: ExecutionTypes): string => {
        switch (executionType) {
            case ExecutionTypes.GoogleFederation:
                return "Google";
            case ExecutionTypes.AppleFederation:
                return "Apple";
            case ExecutionTypes.GithubFederation:
                return "GitHub";
            case ExecutionTypes.FacebookFederation:
                return "Facebook";
            case ExecutionTypes.MicrosoftFederation:
                return "Microsoft";
            case ExecutionTypes.PasskeyEnrollment:
                return "Enroll Passkey";
            case ExecutionTypes.ConfirmationCode:
                return "Confirmation Code";
            default:
                return "Execution";
        }
    };

    return (
        components && components.length > 0
            ? (
                <View
                    heading={ resolveExecutionName((data?.action as any)?.executor?.name) }
                    data={ data }
                    enableSourceHandle={ true }
                    droppableAllowedTypes={ VisualFlowConstants.FLOW_BUILDER_STATIC_CONTENT_ALLOWED_RESOURCE_TYPES }
                    onActionPanelDoubleClick={
                        () => {
                            setLastInteractedStepId(id);
                            setLastInteractedResource(resource);
                        }
                    }
                />
            )
            : <ExecutionMinimal id={ id } data={ data } resource={ resource } />
    );
}, (prevProps: ExecutionPropsInterface, nextProps: ExecutionPropsInterface) => {
    return prevProps.id === nextProps.id &&
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
        JSON.stringify(prevProps.resource) === JSON.stringify(nextProps.resource);
});

export default Execution;
