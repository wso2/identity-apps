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
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useValidationStatus from "./use-validation-status";
import { Action, Element } from "../models/elements";
import { ExtensionExecutorInterface } from "../models/metadata";
import Notification, { NotificationType } from "../models/notification";
import { ExecutionTypes } from "../models/steps";
import { Resource } from "../public-api";

/**
 * Built in executors that authenticate the user. Mirrors the executors that extend
 * `AuthenticationExecutor` on the server.
 */
const AUTHENTICATION_EXECUTORS: string[] = [
    RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR,
    RegistrationFlowExecutorConstants.SMS_OTP_EXECUTOR,
    RegistrationFlowExecutorConstants.MAGIC_LINK_EXECUTOR,
    RegistrationFlowExecutorConstants.OPEN_ID_CONNECT_EXECUTOR,
    ExecutionTypes.PasskeyEnrollment,
    ExecutionTypes.GoogleFederation,
    ExecutionTypes.AppleFederation,
    ExecutionTypes.FacebookFederation,
    ExecutionTypes.MicrosoftFederation,
    ExecutionTypes.GithubFederation
];

/**
 * Validates that a device registration step comes after a step that authenticates the user. The server
 * refuses to register a device for a user who has only been identified, not authenticated.
 *
 * @param nodeId - ID of the execution node.
 * @param executorName - Name of the executor of the execution node.
 */
const useDeviceRegistrationValidation = (nodeId: string, executorName: string): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification } = useValidationStatus();
    const { metadata } = useAuthenticationFlowBuilderCore();

    const nodes: Node[] = useStore((state: ReactFlowState) => state.nodes);
    const edges: Edge[] = useStore((state: ReactFlowState) => state.edges);

    const isDeviceRegistrationNode: boolean =
        executorName === ExecutionTypes.DeviceRegistration;
    const notificationId: string = `device-registration-validation-${ nodeId }`;

    const authenticationExecutors: Set<string> = useMemo(() => {
        const executors: Set<string> = new Set<string>(AUTHENTICATION_EXECUTORS);

        metadata?.extensionExecutors?.forEach((executor: ExtensionExecutorInterface) => {
            if (executor?.name && executor?.isAuthenticationExecutor) {
                executors.add(executor.name);
            }
        });

        return executors;
    }, [ metadata?.extensionExecutors ]);

    const isAuthenticatedBefore: boolean = useMemo(() => {
        if (!isDeviceRegistrationNode) {
            return true;
        }

        const isAuthenticationExecutor = (name: string): boolean => !!name && authenticationExecutors.has(name);

        const authenticates = (node: Node): boolean =>
            isAuthenticationExecutor((node?.data?.action as Action)?.executor?.name)
            || (node?.data?.components as Element[])?.some((component: Element) =>
                component?.components?.some((child: Element) =>
                    isAuthenticationExecutor(child?.action?.executor?.name)));

        const currentNode: Node | undefined = nodes.find((node: Node) => node.id === nodeId);

        if (!currentNode) {
            return true;
        }

        const visited: Set<string> = new Set<string>([ currentNode.id ]);
        const pending: Node[] = getIncomers(currentNode, nodes, edges);

        while (pending.length > 0) {
            const node: Node = pending.pop();

            if (visited.has(node.id)) {
                continue;
            }

            visited.add(node.id);

            if (authenticates(node)) {
                return true;
            }

            pending.push(...getIncomers(node, nodes, edges));
        }

        return false;
    }, [ isDeviceRegistrationNode, nodeId, nodes, edges, authenticationExecutors ]);

    useEffect(() => {
        removeNotification(notificationId);

        if (isAuthenticatedBefore) {
            return;
        }

        const notification: Notification = new Notification(
            notificationId,
            t("devices:registrationStep.validation.authenticationRequired"),
            NotificationType.ERROR
        );
        const currentNode: Node | undefined = nodes.find((node: Node) => node.id === nodeId);

        if (currentNode) {
            notification.addResource((currentNode as unknown) as Resource);
        }

        addNotification(notification);
    }, [ isAuthenticatedBefore, notificationId ]);

    useEffect(() => {
        return () => {
            removeNotification(notificationId);
        };
    }, [ notificationId ]);
};

export default useDeviceRegistrationValidation;
