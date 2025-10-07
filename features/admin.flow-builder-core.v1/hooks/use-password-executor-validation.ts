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

import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import { Element, ElementTypes } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

/**
 * Custom hook for validating password executor configuration.
 * Finds the node that contains the button resource and validates password field requirements.
 *
 * @param resource - The button action resource from button-adapter.tsx
 */
const usePasswordExecutorValidation = (resource: Element): void => {
    const { t } = useTranslation();
    const { getNodes } = useReactFlow();
    const { addNotification, removeNotification } = useValidationStatus();

    const nodes: Node[] = getNodes();
    const notificationId: string = `password-executor-validation-${resource?.id}`;

    /**
     * Find the node that contains this button resource by searching through all nodes components.
     */
    const parentNode: Node | undefined = useMemo(() => {
        if (!resource?.id || !nodes?.length) {
            return undefined;
        }

        return nodes?.find((node: Node) => {
            const components: Element[] = node?.data?.components as Element[];

            if (!components?.length) {
                return false;
            }

            // Search through all components in the node to find the one with matching ID
            return components?.some((component: Element) => {

                if (component.components?.length) {
                    return component.components.some((nestedComponent: Element) =>
                        nestedComponent.id === resource.id
                    );
                }

                return false;
            });
        });
    }, [ resource?.id, nodes ]);

    /**
     * Check if the parent node has password fields.
     */
    const hasPasswordField: boolean = useMemo(() => {
        if (!parentNode?.data?.components) {
            return false;
        }

        const components: Element[] = parentNode.data.components as Element[];

        return components.some((component: Element) => {

            if (component.components?.length) {

                return component.components.some((nestedComponent: Element) =>
                    nestedComponent.type === ElementTypes.Input && nestedComponent.config.identifier === "password"
                );
            }

            return false;
        });
    }, [ parentNode ]);


    /**
     * Check if the button has a password provisioner executor
     */
    const isPasswordProvisioner: boolean = useMemo(() => {
        return resource?.action?.executor?.name === "PasswordProvisioningExecutor";
    }, [ resource?.action?.executor?.name ]);

    /**
     * Validate the configuration: if there's a password field, there should be a password provisioner
     */
    const isValidConfiguration: boolean = useMemo(() => {
        if (hasPasswordField) {
            return isPasswordProvisioner;
        }

        return true;
    }, [ hasPasswordField, isPasswordProvisioner ]);

    /**
     * Effect to handle password executor validation notifications.
     */
    useEffect(() => {
        if (!resource?.id || !parentNode) {
            return;
        }

        removeNotification(notificationId);

        if (!isValidConfiguration) {
            const notification: Notification = new Notification(
                notificationId,
                t("flowBuilder:validation.passwordExecutorRequired.message",
                    "Forms with a Password field requires a 'Provision Password' Action" +
                    " to be configured for the button."),
                NotificationType.ERROR
            );

            notification.addResource((resource as unknown) as Resource);
            addNotification(notification);
        }
    }, [ hasPasswordField, isPasswordProvisioner, isValidConfiguration, resource?.id,
        notificationId, t, addNotification, removeNotification ]);

    /**
     * Cleanup function to remove notifications on unmount
     */
    useEffect(() => {
        return () => {
            removeNotification(notificationId);
        };
    }, [ notificationId, removeNotification ]);

};

export default usePasswordExecutorValidation;
