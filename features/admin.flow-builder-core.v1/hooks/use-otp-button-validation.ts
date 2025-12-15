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
        totalButtons: number;
    } = useMemo(() => {
        if (!isOTPButtonValidationEnabled || !node?.data?.components) {
            return { buttonsOutsideAllForms: 0, formsWithOTP: [], totalButtons: 0 };
        }

        const components: Element[] = node.data.components as Element[];
        const formsWithOTP: Array<{ form: Element; buttonsInsideForm: number }> = [];
        let buttonsOutsideAllForms: number = 0;
        let totalButtons: number = 0;

        /**
         * Recursively count buttons within a component tree.
         */
        const countButtonsRecursive = (comps: Element[]): number => {
            let count: number = 0;

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

                if (comp.type === BlockTypes.Form && comp.components) {
                    const hasOTP: boolean = hasOTPRecursive(comp.components);
                    const buttonsInForm: number = countButtonsRecursive(comp.components);

                    if (hasOTP) {
                        formsWithOTP.push({
                            buttonsInsideForm: buttonsInForm,
                            form: comp
                        });
                    } else {
                        buttonsOutsideAllForms += buttonsInForm;
                    }
                    totalButtons += buttonsInForm;
                } else {
                    if (comp.type === ElementTypes.Button) {
                        buttonsOutsideAllForms++;
                    }
                    if (Array.isArray(comp.components)) {
                        processComponents(comp.components);
                    }
                }
            }
        };

        processComponents(components);

        return {
            buttonsOutsideAllForms,
            formsWithOTP,
            totalButtons
        };
    }, [ node?.data?.components, isOTPButtonValidationEnabled ]);

    const baseNotificationId: string = `otp-button-validation-${node?.id}`;

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {

            removeNotification(baseNotificationId);
            removeNotification(`${baseNotificationId}-view`);
            removeNotification(`${baseNotificationId}-form`);
        };
    }, []);

    /**
     * Handle validation updates in useEffect to avoid setState during render.
     */
    useEffect(() => {
        if (!isOTPButtonValidationEnabled || !node || validationData.formsWithOTP.length === 0) {

            removeNotification(baseNotificationId);
            removeNotification(`${baseNotificationId}-view`);
            removeNotification(`${baseNotificationId}-form`);

            return;
        }

        const { formsWithOTP, buttonsOutsideAllForms } = validationData;

        removeNotification(baseNotificationId);
        removeNotification(`${baseNotificationId}-view`);
        removeNotification(`${baseNotificationId}-form`);

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

        formsWithOTP.forEach(({ form, buttonsInsideForm }: { form: Element; buttonsInsideForm: number }) => {
            if (buttonsInsideForm > 1) {
                const formNotificationId: string = `${baseNotificationId}-form`;

                const message: string = t("flowBuilder:validation.otpStepSingleActionButton.message",
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

        if (buttonsOutsideAllForms > 0 && formsWithOTP.length > 0) {
            const viewNotificationId: string = `${baseNotificationId}-view`;
            const notification: Notification = new Notification(
                viewNotificationId,
                t("flowBuilder:validation.otpStepButtonsOutsideForm.message",
                    "Steps that include an OTP form component can have action buttons " +
                    "only within the OTP form component itself."),
                NotificationType.ERROR
            );

            notification.addResource((node as unknown) as Resource);
            addNotification(notification);
        }
    }, [
        baseNotificationId,
        isOTPButtonValidationEnabled,
        node?.id,
        validationData.buttonsOutsideAllForms,
        validationData.formsWithOTP.length,
        validationData.totalButtons
    ]);
};

export default useOTPButtonValidation;
