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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useGetExtensionExecutorSteps
    from "@wso2is/admin.flow-builder-core.v1/api/use-get-extension-executor-steps";
import useGetFlowBuilderCoreResources from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-resources";
import { Resources } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { WidgetTypes } from "@wso2is/admin.flow-builder-core.v1/models/widget";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import elements from "../data/elements.json";
import steps from "../data/steps.json";
import templates from "../data/templates.json";
import widgets from "../data/widgets.json";

/**
 * Hook to get the resources supported by the registration flow builder.
 * This hook will aggregate the core resources and the registration specific resources.
 *
 * This function calls the GET method of the following endpoint to get the resources.
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetRegistrationFlowBuilderResources = <Data = Resources, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreResources } = useGetFlowBuilderCoreResources();

    // Executors contributed by extensions deployed on the server. Appended to the palette at runtime.
    const extensionExecutorSteps: Step[] = useGetExtensionExecutorSteps(FlowTypes.REGISTRATION);

    const aiFeature: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.ai
    );

    const presentationDefinitionsFeature: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.presentationDefinitions
    );

    const data: unknown = useMemo(() => {
        const isAiFeatureDisabled: boolean = !aiFeature?.enabled || aiFeature?.disabledFeatures?.includes(
            FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.AI_FLOWS_TYPES_REGISTRATION);

        const isOpenID4VPDisabled: boolean = !presentationDefinitionsFeature?.enabled ||
            presentationDefinitionsFeature?.disabledFeatures?.includes(
                FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.PRESENTATION_DEFINITIONS_FLOWS_TYPES_REGISTRATION
            );

        const filteredTemplates: Template[] = (templates as Template[]).filter((template: Template) => {
            return (!isAiFeatureDisabled || template?.type !== TemplateTypes.GeneratedWithAI) &&
                (!isOpenID4VPDisabled || template?.type !== TemplateTypes.BasicWallet);
        });

        const filteredWidgets: any[] = (widgets as any[]).filter((widget: any) => {
            return !isOpenID4VPDisabled || widget?.type !== WidgetTypes.DigitalWalletFederation;
        });

        return {
            ...coreResources,
            elements: [
                ...coreResources?.elements,
                ...elements
            ],
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
                ...filteredWidgets
            ]
        };
    }, [ coreResources, aiFeature, presentationDefinitionsFeature, extensionExecutorSteps ]);

    return {
        data: data as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetRegistrationFlowBuilderResources;
