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

import { Node } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import { BlockTypes, Element, ElementTypes, InputVariants } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating OTP steps in form components.
 * Ensures that if there is an OTP step in a form component,
 * you can have only one action button other than the Resend button.
 */
const useOTPButtonValidation = (node: Node): void => {

    const { t } = useTranslation();
    const { addNotification, removeNotification, validationConfig } = useValidationStatus();

    const isOTPButtonValidationEnabled: boolean = validationConfig?.isOTPButtonValidationEnabled ?? true;

    /**
     * Optimized validation data structure.
     * Counts buttons and checks for OTP in forms in a single pass.
     */
    const validationData: {
        formsWithOTP: Array<{ form: Element; buttonsInsideForm: number }>;
        buttonsOutsideAllForms: number;
    } = useMemo(() => {
        if (!isOTPButtonValidationEnabled || !node?.data?.components) {
            return { formsWithOTP: [], buttonsOutsideAllForms: 0 };
        }

        const components: Element[] = node.data.components as Element[];
        const formsWithOTP: Array<{ form: Element; buttonsInsideForm: number }> = [];
        let buttonsOutsideAllForms = 0;

        /**
         * Recursively count buttons within a component tree.
         */
        const countButtonsRecursive = (comps: Element[]): number => {
            let count = 0;
            for (const comp of comps) {
                if (comp.type === ElementTypes.Button) {
                    count++;
                }
                if (Array.isArray(comp.components)) {
                    count += countButtonsRecursive(comp.components);
                }
            }
            return count;
        };

        /**
         * Recursively check for OTP inputs in components.
         */
        const hasOTPRecursive = (comps: Element[]): boolean => {
            for (const comp of comps) {
                if (comp.type === ElementTypes.Input && comp.variant === InputVariants.OTP) {
                    return true;
                }
                if (Array.isArray(comp.components) && hasOTPRecursive(comp.components)) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Process components in a single pass: identify forms, check for OTP, and count buttons.
         */
        const processComponents = (comps: Element[]): void => {
            for (const comp of comps) {
                // Check if this is a form component
                if (comp.type === BlockTypes.Form && comp.components) {
                    const hasOTP = hasOTPRecursive(comp.components);
                    const buttonsInForm = countButtonsRecursive(comp.components);

                    if (hasOTP) {
                        // Form has OTP - track it with its button count
                        formsWithOTP.push({
                            form: comp,
                            buttonsInsideForm: buttonsInForm
                        });
                    } else {
                        // Form doesn't have OTP - its buttons count as outside
                        buttonsOutsideAllForms += buttonsInForm;
                    }
                } else {
                    // Not a form - count buttons as outside
                    if (comp.type === ElementTypes.Button) {
                        buttonsOutsideAllForms++;
                    }
                    // Recursively process nested components
                    if (Array.isArray(comp.components)) {
                        processComponents(comp.components);
                    }
                }
            }
        };

        processComponents(components);

        return {
            formsWithOTP,
            buttonsOutsideAllForms
        };
    }, [ node?.data?.components, isOTPButtonValidationEnabled, node ]);

    const baseNotificationId: string = `otp-button-validation-${node?.id}`;

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {
            // Remove all potential notifications for this node
            // We remove notifications for all forms that currently have OTP
            validationData.formsWithOTP.forEach(({ form }) => {
                removeNotification(`${baseNotificationId}-${form.id}`);
            });
            // Also remove the multiple forms notification and view notification
            removeNotification(baseNotificationId);
            removeNotification(`${baseNotificationId}-view`);
        };
    }, [ validationData.formsWithOTP, baseNotificationId, removeNotification ]);

    /**
     * Handle validation updates in useEffect to avoid setState during render.
     */
    useEffect(() => {
        if (!isOTPButtonValidationEnabled || !node || validationData.formsWithOTP.length === 0) {
            // Remove any existing notifications when validation is disabled or no forms with OTP
            removeNotification(baseNotificationId);
            removeNotification(`${baseNotificationId}-view`);
            // Remove all form notifications
            validationData.formsWithOTP.forEach(({ form }) => {
                removeNotification(`${baseNotificationId}-${form.id}`);
            });
            return;
        }
        
        const { formsWithOTP, buttonsOutsideAllForms } = validationData;
        
        // Remove existing notifications first (will be re-added if needed)
        removeNotification(baseNotificationId);
        removeNotification(`${baseNotificationId}-view`);
        formsWithOTP.forEach(({ form }) => {
            removeNotification(`${baseNotificationId}-${form.id}`);
        });

        // Check if there are multiple form components with OTP
        if (formsWithOTP.length > 1) {
            const notification: Notification = new Notification(
                baseNotificationId,
                t("flowBuilder:validation.otpStepMultipleForms.message",
                    "Multiple forms with OTP steps are not allowed."),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }

        // For each form with OTP, check if there are more than 1 action button
        formsWithOTP.forEach(({ form, buttonsInsideForm }) => {
            if (buttonsInsideForm > 1) {
                const formNotificationId: string = `${baseNotificationId}-${form.id}`;
                
                const message = t("flowBuilder:validation.otpStepSingleActionButton.message",
                        "Forms with an OTP step can have only one action button other than the Resend button.");
                
                const notification: Notification = new Notification(
                    formNotificationId,
                    message,
                    NotificationType.ERROR
                );

                notification.addResource((form as unknown) as Resource);
                addNotification(notification);
            }
        });

        // Check if there are buttons in components outside forms
        if (buttonsOutsideAllForms > 0 && formsWithOTP.length > 0) {
            const viewNotificationId: string = `${baseNotificationId}-view`;
            const notification: Notification = new Notification(
                viewNotificationId,
                t("flowBuilder:validation.otpStepButtonsOutsideForm.message",
                    "Action buttons outside forms with OTP steps are not allowed."),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }
    }, [
        validationData,
        node?.id,
        isOTPButtonValidationEnabled,
        t,
        addNotification,
        removeNotification,
        baseNotificationId
    ]);
};

export default useOTPButtonValidation;
