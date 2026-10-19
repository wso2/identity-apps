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
import { Edge, Node, ReactFlowState, getOutgoers, useStore } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useValidationStatus from "./use-validation-status";
import { Action, Element } from "../models/elements";
import { ExtensionExecutorInterface } from "../models/metadata";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

const USER_RESOLVE_EXECUTOR: string = "UserResolveExecutor";

/**
 * Custom hook for validating if a factor exists after the user resolve view in the profile update flow.
 */
const useUserResolveFactorValidation = (node: Node): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification, validationConfig } = useValidationStatus();
    const { metadata } = useAuthenticationFlowBuilderCore();

    const nodes: Node[] = useStore((state: ReactFlowState) => state.nodes);
    const edges: Edge[] = useStore((state: ReactFlowState) => state.edges);

    const isUserResolveFactorValidationEnabled: boolean =
        validationConfig?.isUserResolveFactorValidationEnabled ?? false;

    /**
     * Check if this view contains a user resolve action.
     */
    const containsUserResolve: boolean = useMemo(() => {
        if (!isUserResolveFactorValidationEnabled || !node) return false;

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => child?.action?.executor?.name === USER_RESOLVE_EXECUTOR
            )
        );
    }, [ node?.data?.components, isUserResolveFactorValidationEnabled, node ]);

    /**
     * Gets all descendant nodes (nodes that come after this node in the flow).
     */
    const getAllDescendants = (startNode: Node, nodes: Node[], edges: Edge[]): Node[] => {
        const visited: Set<string> = new Set<string>();
        const result: Node[] = [];

        const traverseDescendants = (currentNode: Node): void => {
            if (visited.has(currentNode.id)) return;
            visited.add(currentNode.id);
            result.push(currentNode);

            const outgoers: Node[] = getOutgoers(currentNode, nodes, edges);

            outgoers.forEach((descendant: Node) => traverseDescendants(descendant));
        };

        traverseDescendants(startNode);

        return result.filter((n: Node) => n.id !== startNode.id);
    };

    /**
     * Executors that verify the user. Covers the built-in factors and any executor contributed
     * by a deployed extension that authenticates the user.
     */
    const factorExecutors: Set<string> = useMemo(() => {
        const factors: Set<string> = new Set<string>([
            RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR,
            RegistrationFlowExecutorConstants.SMS_OTP_EXECUTOR,
            RegistrationFlowExecutorConstants.MAGIC_LINK_EXECUTOR
        ]);

        metadata?.extensionExecutors?.forEach((executor: ExtensionExecutorInterface) => {
            if (executor?.name && executor?.isAuthenticationExecutor) {
                factors.add(executor.name);
            }
        });

        return factors;
    }, [ metadata?.extensionExecutors ]);

    /**
     * Finds factor views such as SMS OTP, Email OTP, Magic Link or an extension contributed
     * factor in a node's components or in its own action.
     */
    const factorExistsInTheNode = (node: Node): boolean => {

        const isFactor = (executorName: string): boolean =>
            !!executorName && factorExecutors.has(executorName);

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => isFactor(child?.action?.executor?.name)
            )
        ) || isFactor((node?.data?.action as Action)?.executor?.name);
    };

    const descendants: Node[] = useMemo(() => {
        if (!node?.id) return [];

        return getAllDescendants(node, nodes, edges);
    }, [ node?.id, nodes, edges ]);

    const hasDescendants: boolean = descendants?.length > 0;

    /**
     * Checks if any descendant nodes have a factor view.
     */
    const checkIfDescendantsHaveFactors: boolean = useMemo((): boolean => {
        if (!isUserResolveFactorValidationEnabled || !containsUserResolve || !node) return false;

        return descendants.some((n: Node) => factorExistsInTheNode(n));
    }, [ isUserResolveFactorValidationEnabled, containsUserResolve, node, descendants, factorExecutors ]);

    const errorNotificationId: string = `user-resolve-factor-validation-${node?.id}`;

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {
            removeNotification(errorNotificationId);
        };
    }, []);

    /*
     * Handle validation updates.
     */
    useEffect(() => {
        if (!isUserResolveFactorValidationEnabled || !node) {
            return;
        }

        removeNotification(errorNotificationId);

        if (containsUserResolve && !checkIfDescendantsHaveFactors && hasDescendants) {
            const notification: Notification = new Notification(
                errorNotificationId,
                t("flows:core.validation.userResolveRequiresFactors.message"),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }
    }, [
        node?.id, isUserResolveFactorValidationEnabled, addNotification,
        containsUserResolve,
        checkIfDescendantsHaveFactors,
        removeNotification, hasDescendants
    ]);
};

export default useUserResolveFactorValidation;
