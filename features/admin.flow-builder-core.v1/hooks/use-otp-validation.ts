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

import { Edge, Node, getIncomers, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating Email and SMS OTP components.
 * Ensures that at least one email/mobile field exists in the flow before allowing Email/SMS OTP components.
 */
const useOTPValidation = (node: Node) => {
    const { t } = useTranslation();
    const { getEdges, getNodes } = useReactFlow();
    const { addNotification, removeNotification } = useValidationStatus();
    const edges: Edge[] = getEdges();
    const nodes: Node[] = getNodes();

    /**
     * Check if this view contains Email OTP components.
     */
    const containsEmailOTP: boolean = useMemo(() => {
        return (node?.data?.components as any)?.some((parent: any) =>
            (parent?.components as any[])?.some(
                (child: any) => child?.action?.executor?.name === "EmailOTPExecutor"
            )
        );
    }, [ node?.data?.components ]);

    /**
     * Check if this view contains SMS OTP components.
     */
    const containsSMSOTP: boolean = useMemo(() => {
        return (node?.data?.components as any[])?.some((parent: any) =>
            parent?.components?.some(
                (child: any) => child?.action?.executor?.name === "SMSOTPExecutor"
            )
        );
    }, [ node?.data?.components ]);

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
     * Finds email fields in a node's components.
     */
    const findEmailFields = (node: Node): any[] => {
        const results: any[] = [];

        const searchComponents = (components: any[]): void => {
            for (const comp of components) {
                // Check if this is an email FIELD
                if (comp.category === "FIELD") {
                    const identifier: string = comp?.config?.identifier ?? "";

                    if (identifier.toLowerCase().includes("http://wso2.org/claims/emailaddress")) {
                        results.push(comp);
                    }
                }

                // Recurse into nested components
                if (Array.isArray(comp.components)) {
                    searchComponents(comp.components);
                }
            }
        };

        if (node?.data?.components) {
            searchComponents(node.data.components as any[]);
        }

        return results;
    };

    /**
     * Finds mobile number fields in a node's components.
     */
    const findMobileFields = (node: Node): any[] => {
        const results: any[] = [];

        const searchComponents = (components: any[]): void => {
            for (const comp of components) {
                if (comp.category === "FIELD") {
                    const identifier: string = comp?.config?.identifier ?? "";

                    if (identifier.toLowerCase().includes("http://wso2.org/claims/mobile")) {
                        results.push(comp);
                    }
                }

                if (Array.isArray(comp.components)) {
                    searchComponents(comp.components);
                }
            }
        };

        if (node?.data?.components) {
            searchComponents(node.data.components as any[]);
        }

        return results;
    };

    /**
     * Checks if any ancestor nodes have email fields.
     */
    const checkIfAncestorsHaveEmailField = (): boolean => {
        const ancestors: Node[] = getAllAncestors(node, nodes, edges);

        for (const n of ancestors) {
            const emailFields: any[] = findEmailFields(n);

            if (emailFields.length > 0) {
                return true;
            }
        }

        return false;
    };

    /**
     * Checks if any ancestor nodes have mobile fields.
     */
    const checkIfAncestorsHaveMobileField = (): boolean => {
        const ancestors: Node[] = getAllAncestors(node, nodes, edges);

        for (const n of ancestors) {
            const mobileFields: any[] = findMobileFields(n);

            if (mobileFields.length > 0) {
                return true;
            }
        }

        return false;
    };


    // Compute validation state (but don't update notifications during render)
    const hasEmailFieldInAncestors: boolean = checkIfAncestorsHaveEmailField();
    const hasMobileFieldInAncestors: boolean = checkIfAncestorsHaveMobileField();

    // Handle validation updates in useEffect to avoid setState during render
    useEffect(() => {
        // Email OTP validation
        const emailNotificationId: string = `email-otp-validation-${node.id}`;

        removeNotification(emailNotificationId);

        if (containsEmailOTP && !hasEmailFieldInAncestors) {
            const notification: Notification = new Notification(
                emailNotificationId,
                t("flowBuilder:validation.emailOTPRequiresEmailField.message",
                    "Email OTP requires at least one email field to be present in the flow."),
                NotificationType.ERROR
            );

            if (node) {
                notification.addResource((node as unknown) as Resource);
            }

            addNotification(notification);
        }

        // SMS OTP validation
        const smsNotificationId: string = `sms-otp-validation-${node.id}`;

        removeNotification(smsNotificationId);

        if (containsSMSOTP && !hasMobileFieldInAncestors) {
            const notification: Notification = new Notification(
                smsNotificationId,
                t("flowBuilder:validation.smsOTPRequiresMobileField.message",
                    "SMS OTP requires at least one mobile number field to be present in the flow."),
                NotificationType.ERROR
            );

            if (node) {
                notification.addResource((node as unknown) as Resource);
            }

            addNotification(notification);
        }
    }, [
        containsEmailOTP, hasEmailFieldInAncestors,
        containsSMSOTP, hasMobileFieldInAncestors,
        node.id, node, t, addNotification, removeNotification
    ]);

    return {
        containsEmailOTP,
        containsSMSOTP,
        hasEmailFieldInAncestors,
        hasMobileFieldInAncestors
    };
};

export default useOTPValidation;
