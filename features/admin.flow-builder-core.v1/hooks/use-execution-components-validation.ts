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

import { Node } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import VisualFlowConstants from "../constants/visual-flow-constants";
import { Action, Element } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { StepTypes } from "../models/steps";
import { Resource } from "../public-api";
import resolveExecutionAllowedResourceTypes from "../utils/resolve-execution-allowed-resource-types";

/**
 * Reports an error, which blocks publishing, when an execution step's page has components its executor does not
 * allow in the step's phase, such as a form left on a device registration step after its phase changed. Only
 * executors listed in `FLOW_BUILDER_EXECUTION_ALLOWED_RESOURCE_TYPES` are checked.
 *
 * @param node - Step node to validate.
 */
const useExecutionComponentsValidation = (node: Node): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification } = useValidationStatus();

    const notificationId: string = `execution-components-${ node?.id }`;

    const components: Element[] = node?.data?.components as Element[];
    const action: Action | undefined = node?.data?.action as Action;
    const executorName: string | undefined = action?.executor?.name;
    const phase: string | undefined = action?.executor?.meta?.phase;
    const isChecked: boolean = node?.type === StepTypes.Execution
        && !!executorName && !!VisualFlowConstants.FLOW_BUILDER_EXECUTION_ALLOWED_RESOURCE_TYPES[ executorName ];

    // Palette labels of the disallowed components, such as "Form", falling back to the type.
    const disallowedTypes: string[] = useMemo(() => {
        if (!isChecked) {
            return [];
        }

        const allowedTypes: string[] = resolveExecutionAllowedResourceTypes(executorName, phase);

        return Array.from(new Set<string>((components ?? [])
            .filter((component: Element) => !!component?.type && !allowedTypes.includes(component.type))
            .map((component: Element) => component?.display?.label || component.type)));
    }, [ components, executorName, phase, isChecked ]);

    useEffect(() => {
        removeNotification(notificationId);

        if (disallowedTypes.length === 0) {
            return;
        }

        const notification: Notification = new Notification(
            notificationId,
            t("flows:core.validation.executionStep.disallowedComponents", {
                types: disallowedTypes.join(", ")
            }),
            NotificationType.ERROR
        );

        notification.addResource((node as unknown) as Resource);
        addNotification(notification);
    }, [ disallowedTypes.join(","), notificationId ]);

    useEffect(() => {
        return () => {
            removeNotification(notificationId);
        };
    }, [ notificationId ]);
};

export default useExecutionComponentsValidation;
