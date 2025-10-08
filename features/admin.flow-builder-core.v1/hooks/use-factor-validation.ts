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

import
RegistrationFlowExecutorConstants
    from "@wso2is/admin.registration-flow-builder.v1/constants/registration-flow-executor-constants";
import { Edge, Node, ReactFlowState, getIncomers, useStore } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import { Action, Element } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating if a factor exists when reset password view is available in the password recovery flow.
 */
const useRecoveryFactorValidation = (node: Node): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification, validationConfig } = useValidationStatus();

    const nodes: Node[] = useStore((state: ReactFlowState) => state.nodes);
    const edges: Edge[] = useStore((state: ReactFlowState) => state.edges);

    const isRecoveryFactorValidationEnabled: boolean = validationConfig?.isRecoveryFactorValidationEnabled ?? false;

    /**
     * Check if this view contains Email OTP components.
     */
    const containsResetPassword: boolean = useMemo(() => {
        if (!isRecoveryFactorValidationEnabled || !node) return false;

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => child?.action?.executor?.name ===
                    RegistrationFlowExecutorConstants.PASSWORD_PROVISIONING_EXECUTOR
            )
        );
    }, [ node?.data?.components, isRecoveryFactorValidationEnabled, node ]);

    /**
     * Gets all ancestor nodes (nodes that come before this node in the flow).
     */
    const getAllAncestors = (startNode: Node, nodes: Node[], edges: Edge[]): Node[] => {
        const visited: Set<string> = new Set<string>();
        const result: Node[] = [];

        const traverseAncestors = (currentNode: Node): void => {
            if (visited.has(currentNode.id)) return;
            visited.add(currentNode.id);
            result.push(currentNode);

            const incomers: Node[] = getIncomers(currentNode, nodes, edges);

            incomers.forEach((ancestor: Node) => traverseAncestors(ancestor));
        };

        traverseAncestors(startNode);

        return result.filter((n: Node) => n.id !== startNode.id);
    };

    /**
     * Finds factor views such as SMS OTP, Email OTP and Magic Link in a node's components.
     */
    const FactorExistsInTheFlow = (node: Node): boolean => {

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => child?.action?.executor?.name ===
                    RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR ||
                    child?.action?.executor?.name ===
                    RegistrationFlowExecutorConstants.SMS_OTP_EXECUTOR
            )
        ) || (node?.data?.action as Action)?.executor?.name ===
            RegistrationFlowExecutorConstants.MAGIC_LINK_EXECUTOR;
    };

    /**
     * Get all ancestors only once and memoize the result.
     * This avoids recalculating ancestors multiple times during validation checks.
     */
    const ancestors: Node[] = useMemo(() => {
        if (!node?.id) return [];

        return getAllAncestors(node, nodes, edges);
    }, [ node?.id, nodes, edges, containsResetPassword ]);

    const hasAncestors: boolean = ancestors?.length > 0;

    /**
     * Checks if any ancestor nodes have factor views such as SMS OTP, Email OTP and Magic Link.
     */
    const checkIfAncestorsHaveFactors: boolean = useMemo((): boolean => {
        if (!isRecoveryFactorValidationEnabled || !containsResetPassword || !node) return false;

        for (const n of ancestors) {
            if (FactorExistsInTheFlow(n)) {
                return true;
            }
        }

        return false;
    }, [ isRecoveryFactorValidationEnabled, containsResetPassword, node, ancestors ]);

    const errorNotificationId: string = `recovery-factor-validation-${node?.id}`;

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {
            removeNotification(errorNotificationId);
            removeNotification(errorNotificationId);
        };
    }, []);

    /*
     * Handle validation updates.
     */
    useEffect(() => {
        if (!isRecoveryFactorValidationEnabled || !containsResetPassword || !node) {
            return;
        }

        removeNotification(errorNotificationId);

        if (isRecoveryFactorValidationEnabled && !checkIfAncestorsHaveFactors && hasAncestors) {
            const notification: Notification = new Notification(
                errorNotificationId,
                t(
                    "flowBuilder:validations.passwordRecoveryRequiresFactors.message",
                    "Password recovery requires at least one of the following " +
                        "factors to be present in the flow: Email OTP, SMS OTP, " +
                        "or Magic Link."
                ),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }
    }, [
        node?.id, isRecoveryFactorValidationEnabled, addNotification,
        containsResetPassword,
        checkIfAncestorsHaveFactors,
        removeNotification, hasAncestors
    ]);
};

export default useRecoveryFactorValidation;
