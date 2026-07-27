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

import
RegistrationFlowExecutorConstants
    from "@wso2is/admin.registration-flow-builder.v1/constants/registration-flow-executor-constants";
import { Edge, Node, ReactFlowState, getIncomers, useStore } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import { Element } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating that a DeviceRegistrationExecutor step is preceded by
 * Email OTP or SMS OTP in the flow.
 *
 * @param nodeId - The id of the current EXECUTION node.
 * @param executorName - The executor name of the current EXECUTION node.
 */
const useDeviceRegistrationValidation = (nodeId: string, executorName: string): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification, validationConfig } = useValidationStatus();

    const nodes: Node[] = useStore((state: ReactFlowState) => state.nodes);
    const edges: Edge[] = useStore((state: ReactFlowState) => state.edges);

    const isEnabled: boolean =
        validationConfig?.isDeviceRegistrationFactorValidationEnabled ?? false;

    const isDeviceRegistrationNode: boolean =
        executorName === RegistrationFlowExecutorConstants.DEVICE_REGISTRATION_EXECUTOR;

    /**
     * Traverses upstream to collect all ancestor nodes.
     */
    const getAllAncestors = (startNode: Node, allNodes: Node[], allEdges: Edge[]): Node[] => {
        const visited: Set<string> = new Set<string>();
        const result: Node[] = [];

        const traverse = (current: Node): void => {
            if (visited.has(current.id)) return;
            visited.add(current.id);
            result.push(current);
            getIncomers(current, allNodes, allEdges).forEach(traverse);
        };

        traverse(startNode);

        return result.filter((n: Node) => n.id !== startNode.id);
    };

    /**
     * Checks whether a node contains an Email OTP or SMS OTP executor button.
     */
    const nodeHasOTPFactor = (node: Node): boolean =>
        (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) =>
                    child?.action?.executor?.name ===
                        RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR ||
                    child?.action?.executor?.name ===
                        RegistrationFlowExecutorConstants.SMS_OTP_EXECUTOR
            )
        );

    const ancestors: Node[] = useMemo((): Node[] => {
        if (!isEnabled || !isDeviceRegistrationNode) return [];

        const currentNode: Node | undefined = nodes.find((n: Node) => n.id === nodeId);

        if (!currentNode) return [];

        return getAllAncestors(currentNode, nodes, edges);
    }, [ nodeId, nodes, edges, isEnabled, isDeviceRegistrationNode ]);

    const hasOTPFactor: boolean = useMemo((): boolean => {
        if (!isEnabled || !isDeviceRegistrationNode) return true;

        return ancestors.some(nodeHasOTPFactor);
    }, [ ancestors, isEnabled, isDeviceRegistrationNode ]);

    const errorNotificationId: string = `device-registration-factor-validation-${nodeId}`;

    useEffect(() => {
        return () => {
            removeNotification(errorNotificationId);
        };
    }, []);

    useEffect(() => {
        if (!isEnabled || !isDeviceRegistrationNode) {
            return;
        }

        removeNotification(errorNotificationId);

        if (!hasOTPFactor) {
            const currentNode: Node | undefined = nodes.find((n: Node) => n.id === nodeId);

            const notification: Notification = new Notification(
                errorNotificationId,
                t(
                    "flowBuilder:validations.deviceRegistrationRequiresFactors.message",
                    "Device registration requires at least one of the following " +
                        "factors to be present in the flow: Email OTP or SMS OTP."
                ),
                NotificationType.ERROR
            );

            if (currentNode) {
                notification.addResource((currentNode as unknown) as Resource);
            }

            addNotification(notification);
        }
    }, [
        nodeId,
        isEnabled,
        isDeviceRegistrationNode,
        hasOTPFactor,
        addNotification,
        removeNotification
    ]);
};

export default useDeviceRegistrationValidation;
