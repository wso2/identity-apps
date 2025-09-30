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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import
RegistrationFlowExecutorConstants
    from "@wso2is/admin.registration-flow-builder.v1/constants/registration-flow-executor-constants";
import { Edge, Node, getIncomers, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import { Element, ElementCategories } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating Email and SMS OTP components.
 * Ensures that at least one email/mobile field exists in the flow before allowing Email/SMS OTP components.
 */
const useOTPValidation = (node: Node) => {

    const { t } = useTranslation();
    const { getEdges, getNodes } = useReactFlow();
    const { addNotification, removeNotification, validationConfig } = useValidationStatus();
    const edges: Edge[] = getEdges();
    const nodes: Node[] = getNodes();

    const isOTPValidationEnabled: boolean = validationConfig?.isOTPValidationEnabled ?? false;

    /**
     * Check if this view contains Email OTP components.
     */
    const containsEmailOTP: boolean = useMemo(() => {
        if (!isOTPValidationEnabled || !node) return false;

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => child?.action?.executor?.name ===
                    RegistrationFlowExecutorConstants.EMAIL_OTP_EXECUTOR
            )
        );
    }, [ node?.data?.components, isOTPValidationEnabled, node ]);

    /**
     * Check if this view contains SMS OTP components.
     */
    const containsSMSOTP: boolean = useMemo(() => {
        if (!isOTPValidationEnabled || !node) return false;

        return (node?.data?.components as Element[])?.some((parent: Element) =>
            parent?.components?.some(
                (child: Element) => child?.action?.executor?.name ===
                    RegistrationFlowExecutorConstants.SMS_OTP_EXECUTOR
            )
        );
    }, [ node?.data?.components, isOTPValidationEnabled, node ]);

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
    const findEmailFields = (node: Node): Element[] => {
        const results: Element[] = [];

        const searchComponents = (components: Element[]): void => {
            for (const comp of components) {
                if (comp.category === ElementCategories.Field) {
                    const identifier: string = comp?.config?.identifier ?? "";

                    if (identifier.toLowerCase().includes(ClaimManagementConstants.EMAIL_CLAIM_URI)) {
                        results.push(comp);
                    }
                }

                if (Array.isArray(comp.components)) {
                    searchComponents(comp.components);
                }
            }
        };

        if (node?.data?.components) {
            searchComponents(node?.data.components as Element[]);
        }

        return results;
    };

    /**
     * Finds mobile number fields in a node's components.
     */
    const findMobileFields = (node: Node): Element[] => {
        const results: Element[] = [];

        const searchComponents = (components: Element[]): void => {
            for (const comp of components) {
                if (comp.category === ElementCategories.Field) {
                    const identifier: string = comp?.config?.identifier ?? "";

                    if (identifier.toLowerCase().includes(ClaimManagementConstants.MOBILE_CLAIM_URI)) {
                        results.push(comp);
                    }
                }

                if (Array.isArray(comp.components)) {
                    searchComponents(comp.components);
                }
            }
        };

        if (node?.data?.components) {
            searchComponents(node?.data.components as Element[]);
        }

        return results;
    };

    /**
     * Checks if any ancestor nodes have email fields.
     */
    const checkIfAncestorsHaveEmailField = (): boolean => {
        if (!isOTPValidationEnabled || !node) return false;

        const ancestors: Node[] = getAllAncestors(node, nodes, edges);

        for (const n of ancestors) {
            const emailFields: Element[] = findEmailFields(n);

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
        if (!isOTPValidationEnabled || !node) return false;

        const ancestors: Node[] = getAllAncestors(node, nodes, edges);

        for (const n of ancestors) {
            const mobileFields: Element[] = findMobileFields(n);

            if (mobileFields.length > 0) {
                return true;
            }
        }

        return false;
    };

    const hasEmailFieldInAncestors: boolean = checkIfAncestorsHaveEmailField();
    const hasMobileFieldInAncestors: boolean = checkIfAncestorsHaveMobileField();
    const emailNotificationId: string = `email-otp-validation-${node?.id}`;
    const smsNotificationId: string = `sms-otp-validation-${node?.id}`;

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {
            removeNotification(emailNotificationId);
            removeNotification(smsNotificationId);
        };
    }, []);

    /*
     * Handle validation updates in useEffect to avoid setState during render
     */
    useEffect(() => {
        if (!isOTPValidationEnabled || !node) {
            return;
        }

        // Email OTP validation
        removeNotification(emailNotificationId);

        if (containsEmailOTP && !hasEmailFieldInAncestors) {
            const notification: Notification = new Notification(
                emailNotificationId,
                t("flowBuilder:validation.emailOTPRequiresEmailField.message",
                    "Email OTP requires at least one email field to be present in the flow."),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }

        // SMS OTP validation
        removeNotification(smsNotificationId);

        if (containsSMSOTP && !hasMobileFieldInAncestors) {
            const notification: Notification = new Notification(
                smsNotificationId,
                t("flowBuilder:validation.smsOTPRequiresMobileField.message",
                    "SMS OTP requires at least one mobile number field to be present in the flow."),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }
    }, [
        containsEmailOTP, hasEmailFieldInAncestors,
        containsSMSOTP, hasMobileFieldInAncestors,
        node, isOTPValidationEnabled, t, addNotification, removeNotification
    ]);

    return {
        containsEmailOTP,
        containsSMSOTP,
        hasEmailFieldInAncestors,
        hasMobileFieldInAncestors
    };
};

export default useOTPValidation;
