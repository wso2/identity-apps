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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useGetFlowBuilderCoreResources from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-resources";
import { Resources } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import deviceRegistrationTemplates from "../data/device-registration-templates.json";
import deviceRegistrationWidgets from "../data/device-registration-widgets.json";
import registrationTemplates from "../data/registration-templates.json";
import registrationWidgets from "../data/registration-widgets.json";
import steps from "../data/steps.json";

/**
 * Core step panel labels shown when building a device registration flow.
 */
const DEVICE_REGISTRATION_PANEL_STEP_LABELS: Set<string> = new Set([
    "Blank View",
    "Email OTP View",
    "SMS OTP View"
]);

/**
 * Hook to get the resources supported by the registration flow builder.
 * Aggregates core resources with self-registration or device-registration specific resources.
 *
 * @param flowType - The flow type (FlowTypes.REGISTRATION or FlowTypes.DEVICE_REGISTRATION).
 * @param _shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetRegistrationFlowBuilderResources = <Data = Resources, Error = RequestErrorInterface>(
    flowType: FlowTypes = FlowTypes.REGISTRATION,
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreResources } = useGetFlowBuilderCoreResources();

    const aiFeature: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.ai
    );

    const data: unknown = useMemo(() => {
        if (flowType === FlowTypes.DEVICE_REGISTRATION) {
            const coreStepsForPanel: any[] = coreResources?.steps.map((step: any) => ({
                ...step,
                display: {
                    ...step.display,
                    showOnResourcePanel: DEVICE_REGISTRATION_PANEL_STEP_LABELS.has(step?.display?.label)
                }
            }));

            return {
                ...coreResources,
                steps: coreStepsForPanel,
                templates: deviceRegistrationTemplates,
                widgets: deviceRegistrationWidgets
            };
        }

        const isAiFeatureDisabled: boolean = !aiFeature?.enabled || aiFeature?.disabledFeatures?.includes(
            FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.AI_FLOWS_TYPES_REGISTRATION);

        const filteredTemplates: Template[] = (registrationTemplates as Template[]).filter((template: Template) => {
            return !isAiFeatureDisabled || template?.type !== TemplateTypes.GeneratedWithAI;
        });

        return {
            ...coreResources,
            steps: [
                ...coreResources?.steps,
                ...steps
            ],
            templates: [
                ...coreResources?.templates,
                ...filteredTemplates
            ],
            widgets: [
                ...coreResources?.widgets,
                ...registrationWidgets
            ]
        };
    }, [ coreResources, aiFeature, flowType ]);

    return {
        data: data as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetRegistrationFlowBuilderResources;
