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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useAuthenticationFlowBuilderCore from "./use-authentication-flow-builder-core-context";
import useValidationStatus from "./use-validation-status";
import { BlockTypes, Element, ElementTypes, InputVariants } from "../models/elements";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../public-api";

const USER_RESOLVE_EXECUTOR: string = "UserResolveExecutor";
const USER_IDENTIFIER: string = "userIdentifier";

/**
 * Custom hook for validating UserResolveExecutor form configuration.
 * Ensures that forms containing a UserResolveExecutor button only have
 * text input fields mapped to username or userIdentifier (if multi-attribute login is enabled).
 *
 * @param resource - The button action resource from button-adapter.tsx
 */
const useUserResolveExecutorValidation = (resource: Element): void => {
    const { t } = useTranslation();
    const { getNodes } = useReactFlow();
    const { addNotification, removeNotification } = useValidationStatus();
    const { metadata } = useAuthenticationFlowBuilderCore();

    const nodes: Node[] = getNodes();
    const notificationId: string = `user-resolve-executor-validation-${resource?.id}`;

    /**
     * Check if the button has a UserResolveExecutor.
     */
    const isUserResolveExecutor: boolean = useMemo(() => {
        return resource?.action?.executor?.name === USER_RESOLVE_EXECUTOR;
    }, [ resource?.action?.executor?.name ]);

    /**
     * Find the parent form that contains this button resource.
     */
    const parentForm: Element | undefined = useMemo(() => {
        if (!isUserResolveExecutor || !resource?.id || !nodes?.length) {
            return undefined;
        }

        for (const node of nodes) {
            const components: Element[] = node?.data?.components as Element[];

            if (!components?.length) {
                continue;
            }

            for (const component of components) {
                if (component.type === BlockTypes.Form && component.components?.length) {
                    const containsButton: boolean = component.components.some(
                        (nestedComponent: Element) => nestedComponent.id === resource.id
                    );

                    if (containsButton) {
                        return component;
                    }
                }
            }
        }

        return undefined;
    }, [ isUserResolveExecutor, resource?.id, nodes ]);

    /**
     * Check if multi-attribute login is enabled from metadata.
     */
    const multiAttributeLoginEnabled: boolean = useMemo(() => {
        return metadata?.connectorConfigs?.multiAttributeLoginEnabled ?? false;
    }, [ metadata?.connectorConfigs?.multiAttributeLoginEnabled ]);

    /**
     * Validate that all input fields in the form are text inputs mapped to allowed identifiers.
     */
    const isValidConfiguration: boolean = useMemo(() => {
        if (!isUserResolveExecutor || !parentForm?.components?.length) {
            return true;
        }

        const allowedIdentifiers: string[] = [ ClaimManagementConstants.USER_NAME_CLAIM_URI ];

        if (multiAttributeLoginEnabled) {
            allowedIdentifiers.push(USER_IDENTIFIER);
        }

        const inputFields: Element[] = parentForm.components.filter(
            (component: Element) => component.type === ElementTypes.Input
        );

        return inputFields.every((field: Element) =>
            field.variant === InputVariants.Text
            && allowedIdentifiers.includes(field.config?.identifier)
        );
    }, [ isUserResolveExecutor, parentForm, multiAttributeLoginEnabled ]);

    /**
     * Effect to handle user resolve executor validation notifications.
     */
    useEffect(() => {
        if (!isUserResolveExecutor || !resource?.id || !parentForm) {
            removeNotification(notificationId);

            return;
        }

        removeNotification(notificationId);

        if (!isValidConfiguration) {
            const message: string = multiAttributeLoginEnabled
                ? t("flows:core.validation.userResolveExecutorFields.messageWithUserIdentifier")
                : t("flows:core.validation.userResolveExecutorFields.message");

            const notification: Notification = new Notification(
                notificationId,
                message,
                NotificationType.ERROR
            );

            notification.addResource((resource as unknown) as Resource);
            addNotification(notification);
        }
    }, [ isUserResolveExecutor, isValidConfiguration, resource?.id, parentForm,
        notificationId, multiAttributeLoginEnabled, t, addNotification, removeNotification ]);

    /**
     * Cleanup function to remove notifications on unmount.
     */
    useEffect(() => {
        return () => {
            removeNotification(notificationId);
        };
    }, [ notificationId, removeNotification ]);
};

export default useUserResolveExecutorValidation;
