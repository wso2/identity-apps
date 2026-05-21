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

import { ConsentListItemInterface } from "@wso2is/common.consents.v1";
import cloneDeep from "lodash-es/cloneDeep";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import useValidationStatus from "./use-validation-status";
import Notification, { NotificationType } from "../models/notification";
import { PurposeInterface } from "../models/purpose";
import { Resource } from "../models/resources";

/**
 * Configuration for purpose validation.
 */
interface ValidatePurposesConfigInterface {
    /** Unique type identifier for the consent (e.g., "policy" or "marketing") */
    type: string;
    /** Translation key prefix for validation messages */
    messageKeyPrefix: string;
    /** Whether to validate that purposes are available (defaults to false) */
    validateAvailability?: boolean;
}

/**
 * Generic hook to validate purpose selection in consent elements.
 *
 * @param resource - The consent element resource.
 * @param selectedPurposes - Array of selected purpose config items.
 * @param allPurposes - Array of available purposes (undefined = loading, null/[] = none available).
 * @param config - Configuration for validation behavior.
 */
const useValidatePurposes = (
    resource: Resource,
    selectedPurposes: PurposeInterface[],
    allPurposes: ConsentListItemInterface[] | undefined | null,
    config: ValidatePurposesConfigInterface
): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification, getNotification } = useValidationStatus();

    useEffect(() => {
        if (!resource) {
            return;
        }

        const notificationId: string = `${ resource.id }_${ config.type }-consent-validation`;

        // Skip validation while purposes are still loading (undefined means not yet fetched).
        if (allPurposes === undefined) {
            return;
        }

        const hasPurposesSelected: boolean = selectedPurposes && selectedPurposes.length > 0;
        const hasPurposesAvailable: boolean = (allPurposes?.length ?? 0) > 0;

        const shouldValidateAvailability: boolean = config.validateAvailability ?? false;
        const hasValidationError: boolean = !hasPurposesSelected || (shouldValidateAvailability && !hasPurposesAvailable);

        if (hasValidationError) {
            if (!getNotification(notificationId)) {
                const error: Notification = new Notification(
                    notificationId,
                    t(`flows:core.validation.fields.${ config.type }Consent.general`),
                    NotificationType.ERROR
                );

                error.addResource(resource);

                if (!hasPurposesSelected) {
                    error.addResourceFieldNotification(
                        "purposes",
                        t(`flows:core.validation.fields.${ config.type }Consent.purposesRequired`)
                    );
                }

                if (shouldValidateAvailability && !hasPurposesAvailable) {
                    error.addResourceFieldNotification(
                        "purposes-available",
                        t(`flows:core.validation.fields.${ config.type }Consent.noPurposesAvailable`)
                    );
                }

                addNotification(error);
            } else {
                const existingError: Notification = cloneDeep(getNotification(notificationId));
                let hasChanges: boolean = false;

                if (!hasPurposesSelected && !existingError.hasResourceFieldNotification("purposes")) {
                    existingError.addResourceFieldNotification(
                        "purposes",
                        t(`flows:core.validation.fields.${ config.type }Consent.purposesRequired`)
                    );
                    hasChanges = true;
                } else if (hasPurposesSelected && existingError.hasResourceFieldNotification("purposes")) {
                    existingError.removeResourceFieldNotification("purposes");
                    hasChanges = true;
                }

                if (shouldValidateAvailability) {
                    if (!hasPurposesAvailable && !existingError.hasResourceFieldNotification("purposes-available")) {
                        existingError.addResourceFieldNotification(
                            "purposes-available",
                            t(`flows:core.validation.fields.${ config.type }Consent.noPurposesAvailable`)
                        );
                        hasChanges = true;
                    } else if (hasPurposesAvailable && existingError.hasResourceFieldNotification("purposes-available")) {
                        existingError.removeResourceFieldNotification("purposes-available");
                        hasChanges = true;
                    }
                }

                if (hasChanges) {
                    addNotification(existingError);
                }
            }
        } else if (getNotification(notificationId)) {
            removeNotification(notificationId);
        }
    }, [ resource, selectedPurposes, allPurposes, config, addNotification, removeNotification, getNotification, t ]);

    useEffect(() => {
        return () => {
            if (resource) {
                removeNotification(`${ resource.id }_${ config.type }-consent-validation`);
            }
        };
    }, [ resource?.id, config.type, removeNotification ]);
};

export default useValidatePurposes;
