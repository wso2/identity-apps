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
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useValidationStatus from "./use-validation-status";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../models/resources";
import { FlowVariableInterface, FlowVariablesInterface, RuntimeValueInterface } from "../models/variables";
import { AB_TESTING_KEY, getInvalidVariableNames } from "../utils/variables";

/**
 * Reports the variables of the flow that the server would reject, so the flow cannot be saved until they are fixed:
 * names that are not valid, repeated or reserved, initial values that break the limits, and more variables than the
 * limits allow.
 *
 * @param node - The start step, which holds the variables.
 */
const useVariablesValidation = (node: Pick<Node, "data" | "type" | "id">): void => {
    const { t } = useTranslation();
    const { isVariablesEnabled, variableLimits } = useAuthenticationFlowBuilderCore();
    const { addNotification, removeNotification } = useValidationStatus();

    const invalidNotificationId: string = `variables-invalid-${node?.id}`;
    const tooManyHeadersNotificationId: string = `variables-too-many-headers-${node?.id}`;
    const tooManyRuntimeValuesNotificationId: string = `variables-too-many-runtime-values-${node?.id}`;

    const variables: FlowVariablesInterface = node?.data?.variables as FlowVariablesInterface;

    const invalidNames: string[] = useMemo(
        (): string[] => isVariablesEnabled ? getInvalidVariableNames(variables, variableLimits) : [],
        [ variables, variableLimits, isVariablesEnabled ]
    );

    // Only named variables are saved, and the A/B testing key does not count towards the limit.
    const headerCount: number = (variables?.headers ?? [])
        .filter((header: FlowVariableInterface) => header?.name?.trim()).length;
    const runtimeValueCount: number = (variables?.runtimeValues ?? [])
        .filter((runtimeValue: RuntimeValueInterface) => runtimeValue?.name?.trim()
            && runtimeValue.name.trim() !== AB_TESTING_KEY).length;
    const hasTooManyHeaders: boolean = isVariablesEnabled && headerCount > variableLimits?.maxHeaders;
    const hasTooManyRuntimeValues: boolean = isVariablesEnabled
        && runtimeValueCount > variableLimits?.maxRuntimeValues;

    /**
     * Shows a notification on the start step, or clears it when there is nothing to report.
     *
     * @param id      - Id of the notification.
     * @param message - Message to show, or undefined to clear it.
     */
    const report: (id: string, message: string | undefined) => void = (
        id: string,
        message: string | undefined
    ): void => {
        removeNotification(id);

        if (!node || !message) {
            return;
        }

        const notification: Notification = new Notification(id, message, NotificationType.ERROR);

        // Opens the start step's properties, where the variables are defined.
        notification.addResource(({ ...node, ...(node.data ?? {}), id: node.id } as unknown) as Resource);
        addNotification(notification);
    };

    useEffect(() => {
        report(invalidNotificationId, invalidNames.length
            ? t("flows:core.validation.variables.invalid", { names: invalidNames.join(", ") })
            : undefined);
    }, [ invalidNames.join("\u0000"), node?.id ]);

    useEffect(() => {
        report(tooManyHeadersNotificationId, hasTooManyHeaders
            ? t("flows:core.validation.variables.tooManyHeaders", { max: variableLimits?.maxHeaders })
            : undefined);
    }, [ hasTooManyHeaders, variableLimits?.maxHeaders, node?.id ]);

    useEffect(() => {
        report(tooManyRuntimeValuesNotificationId, hasTooManyRuntimeValues
            ? t("flows:core.validation.variables.tooManyRuntimeValues", { max: variableLimits?.maxRuntimeValues })
            : undefined);
    }, [ hasTooManyRuntimeValues, variableLimits?.maxRuntimeValues, node?.id ]);

    useEffect(() => () => {
        removeNotification(invalidNotificationId);
        removeNotification(tooManyHeadersNotificationId);
        removeNotification(tooManyRuntimeValuesNotificationId);
    }, []);
};

export default useVariablesValidation;
