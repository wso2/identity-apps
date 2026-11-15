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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetExtensionExecutorSteps
    from "@wso2is/admin.flow-builder-core.v1/api/use-get-extension-executor-steps";
import useGetFlowBuilderCoreResources from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-resources";
import { Element, ElementTypes, InputVariants } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import { Resources } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import FlowConstants from "@wso2is/admin.flow-builder-core.v1/constants/flow-constants";
import { Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Template } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import steps from "../data/steps.json";
import templates from "../data/templates.json";
import widgets from "../data/widgets.json";

/**
 * Template that picks the branch from a runtime value, so it needs decision steps and flow variables.
 */
const BRANCHED_TEMPLATE_TYPE: string = "DEVICE_REGISTRATION_BOTH";

/**
 * Hook to get the resources supported by the device registration flow builder.
 * This hook will aggregate the core resources and the device registration specific resources.
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetDeviceRegistrationFlowBuilderResources = <Data = Resources, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreResources } = useGetFlowBuilderCoreResources();

    // Executors contributed by extensions deployed on the server. Appended to the palette at runtime.
    const extensionExecutorSteps: Step[] = useGetExtensionExecutorSteps(FlowTypes.DEVICE_REGISTRATION);

    const flowsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.flows
    );

    const data: unknown = useMemo(() => {
        const isBranchingAvailable: boolean =
            isFeatureEnabled(flowsFeatureConfig, FlowConstants.CONDITIONAL_BRANCHING_FEATURE_ID)
            && isFeatureEnabled(flowsFeatureConfig, FlowConstants.VARIABLES_FEATURE_ID);

        const filteredTemplates: Template[] = (templates as Template[]).filter(
            (template: Template) => isBranchingAvailable || template?.type !== BRANCHED_TEMPLATE_TYPE
        );

        // The device registration flow doesn't support password provisioning.
        const filteredElements: Element[] = (coreResources?.elements as Element[]).filter((element: Element) => {
            return !(element?.type === ElementTypes.Input && element?.variant === InputVariants.Password);
        });

        return {
            ...coreResources,
            elements: filteredElements,
            steps: [
                ...coreResources?.steps,
                ...steps,
                ...extensionExecutorSteps
            ],
            templates: [
                ...coreResources?.templates,
                ...filteredTemplates
            ],
            widgets: [
                ...coreResources?.widgets,
                ...widgets
            ]
        };
    }, [ coreResources, extensionExecutorSteps, flowsFeatureConfig ]);

    return {
        data: data as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetDeviceRegistrationFlowBuilderResources;
