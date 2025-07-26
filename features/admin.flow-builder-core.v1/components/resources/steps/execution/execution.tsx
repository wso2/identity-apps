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
import cloneDeep from "lodash-es/cloneDeep";
import React, { FC, ReactElement, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import ExecutionMinimal from "./execution-minimal";
import VisualFlowConstants from "../../../../constants/visual-flow-constants";
import useAuthenticationFlowBuilderCore from "../../../../hooks/use-authentication-flow-builder-core-context";
import { ExecutionTypes, Step } from "../../../../models/steps";
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
    const { t } = useTranslation();

    const components: Element[] = data?.components as Element[] || [];

    /**
     * Full resource object with data included.
     */
    const fullResource: Step = useMemo(() => {
        if (!resource || !data) {
            return;
        }

        return cloneDeep({
            id,
            ...resource,
            data
        }) as Step;
    }, [ data, resource ]);

    /**
     * Resolves the execution name based on the type.
     *
     * @param executionType - The type of the execution.
     * @returns Resolved execution name.
     */
    const resolveExecutionName = (executionType: ExecutionTypes): string => {
        switch (executionType) {
            case ExecutionTypes.GoogleFederation:
                return t("flows:core.executions.names.google");
            case ExecutionTypes.AppleFederation:
                return t("flows:core.executions.names.apple");
            case ExecutionTypes.GithubFederation:
                return t("flows:core.executions.names.github");
            case ExecutionTypes.FacebookFederation:
                return t("flows:core.executions.names.facebook");
            case ExecutionTypes.MicrosoftFederation:
                return t("flows:core.executions.names.microsoft");
            case ExecutionTypes.PasskeyEnrollment:
                return t("flows:core.executions.names.passkeyEnrollment");
            case ExecutionTypes.ConfirmationCode:
                return t("flows:core.executions.names.confirmationCode");
            case ExecutionTypes.MagicLinkExecutor:
                return t("flows:core.executions.names.magicLink");
            default:
                return t("flows:core.executions.names.default");
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
                            setLastInteractedResource(fullResource);
                        }
                    }
                    resource={ fullResource }
                />
            )
            : <ExecutionMinimal id={ id } data={ data } resource={ fullResource } />
    );
}, (prevProps: ExecutionPropsInterface, nextProps: ExecutionPropsInterface) => {
    return prevProps.id === nextProps.id &&
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data) &&
        JSON.stringify(prevProps.resource) === JSON.stringify(nextProps.resource);
});

export default Execution;
