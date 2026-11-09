/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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
import useGetExtensionExecutorSteps
    from "@wso2is/admin.flow-builder-core.v1/api/use-get-extension-executor-steps";
import useGetFlowBuilderCoreResources from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-resources";
import { Resources } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import { ExecutionTypes, Step } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { Template, TemplateTypes } from "@wso2is/admin.flow-builder-core.v1/models/templates";
import { Widget, WidgetTypes } from "@wso2is/admin.flow-builder-core.v1/models/widget";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { useMemo } from "react";
import elements from "../data/elements.json";
import steps from "../data/steps.json";
import templates from "../data/templates.json";
import widgets from "../data/widgets.json";

/**
 * Templates and widgets that need the device registration executor.
 */
const DEVICE_REGISTRATION_TEMPLATES: string[] = [
    TemplateTypes.BasicDeviceRegistration,
    TemplateTypes.BasicQrDeviceRegistration
];
const DEVICE_REGISTRATION_WIDGETS: string[] = [
    WidgetTypes.NativeDeviceRegistration,
    WidgetTypes.QrDeviceRegistration
];

/**
 * Hook to get the resources supported by the password recovery flow builder.
 * This hook will aggregate the core resources and the password recovery specific resources.
 *
 * This function calls the GET method of the following endpoint to get the resources.
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetAskPasswordFlowBuilderResources = <Data = Resources, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreResources } = useGetFlowBuilderCoreResources();

    // Executors contributed by extensions deployed on the server. Appended to the palette at runtime.
    const extensionExecutorSteps: Step[] = useGetExtensionExecutorSteps(FlowTypes.INVITED_USER_REGISTRATION);

    const data: unknown = useMemo(() => {
        // The device registration executor is listed only when it is enabled on the server.
        const isDeviceRegistrationAvailable: boolean = extensionExecutorSteps.some(
            (step: Step) => step?.data?.action?.executor?.name === ExecutionTypes.DeviceRegistration
        );

        const filteredTemplates: Template[] = (templates as Template[]).filter((template: Template) =>
            isDeviceRegistrationAvailable || !DEVICE_REGISTRATION_TEMPLATES.includes(template?.type));

        const filteredWidgets: Widget[] = (widgets as Widget[]).filter((widget: Widget) =>
            isDeviceRegistrationAvailable || !DEVICE_REGISTRATION_WIDGETS.includes(widget?.type));

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
    }, [ coreResources, extensionExecutorSteps ]);

    return {
        data: data as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetAskPasswordFlowBuilderResources;
