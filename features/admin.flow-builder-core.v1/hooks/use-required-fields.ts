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

import cloneDeep from "lodash-es/cloneDeep";
import { ReactElement, useEffect } from "react";
import useValidationStatus from "./use-validation-status";
import ValidationConstants from "../constants/validation-constants";
import Notification, { NotificationType } from "../models/notification";
import { Resource } from "../models/resources";

/**
 * Interface for the required field.
 */
export interface RequiredFieldInterface {
    /**
     * The name of the required field.
     */
    name: string;
    /**
     * The error message for the required field.
     */
    errorMessage: string;
}

/**
 * Custom hook to manage required fields validation.
 */
const useRequiredFields = (
    resource: Resource,
    generalMessage: string | ReactElement,
    fields: RequiredFieldInterface[]
) => {
    const { addNotification, removeNotification, getNotification } = useValidationStatus();

    useEffect(() => {
        if (!resource || !fields || fields.length === 0) {
            return;
        }

        fields.forEach((field: RequiredFieldInterface) => {
            const errorId: string = buildErrorId();

            if (!resource?.config[field.name] && !resource?.[field.name]) {
                if (!getNotification(errorId)) {
                    const error: Notification = new Notification(errorId, generalMessage, NotificationType.ERROR);

                    error.addResource(resource);
                    error.addResourceFieldNotification(buildFieldErrorId(field.name), field.errorMessage);

                    addNotification(error);
                } else {
                    if (!getNotification(errorId).hasResourceFieldNotification(buildFieldErrorId(field.name))) {
                        const existingError: Notification = cloneDeep(getNotification(errorId));

                        existingError.addResource(resource);
                        existingError.addResourceFieldNotification(buildFieldErrorId(field.name), field.errorMessage);
                        addNotification(existingError);
                    }
                }
            } else {
                if (getNotification(errorId) &&
                    getNotification(errorId).hasResourceFieldNotification(buildFieldErrorId(field.name))) {
                    if (getNotification(errorId).getResourceFieldNotifications().size === 1) {
                        removeNotification(errorId);
                    } else {
                        const existingError: Notification = cloneDeep(getNotification(errorId));

                        existingError.addResource(resource);
                        existingError.removeResourceFieldNotification(buildFieldErrorId(field.name));
                        addNotification(existingError);
                    }
                }
            }
        });
    }, [ resource, fields, generalMessage, getNotification ]);

    /**
     * Builds the error ID for a required field.
     * @param fieldName - The name of the field.
     * @returns The error ID.
     */
    const buildErrorId = (): string => {
        return `${resource.id}_${ValidationConstants.REQUIRED_FIELD_ERROR_CODE}`;
    };

    /**
     * Builds the error ID for a field.
     * @param fieldName - The name of the field.
     * @returns The error ID.
     */
    const buildFieldErrorId = (fieldName: string): string => {
        return `${resource.id}_${fieldName}`;
    };
};

export default useRequiredFields;
