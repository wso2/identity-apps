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
import { PolicyConfigItemInterface } from "../models/policies";
import { Resource } from "../models/resources";

/**
 * Custom hook to validate policy consent configuration.
 *
 * @param resource - The policy consent element resource.
 * @param selectedPolicies - Array of selected policy config items.
 * @param allPolicies - Array of available policies.
 */
const useValidatePolicyConsent = (
    resource: Resource,
    selectedPolicies: PolicyConfigItemInterface[],
    allPolicies: ConsentListItemInterface[] | undefined
): void => {
    const { t } = useTranslation();
    const { addNotification, removeNotification, getNotification } = useValidationStatus();

    useEffect(() => {
        if (!resource) {
            return;
        }

        const notificationId: string = `${ resource.id }_policy-consent-validation`;

        // Skip validation while policies are still loading (undefined means not yet fetched).
        if (allPolicies === undefined) {
            return;
        }

        const hasPoliciesSelected: boolean = selectedPolicies && selectedPolicies.length > 0;
        const hasPoliciesAvailable: boolean = allPolicies.length > 0;

        if (!hasPoliciesSelected || !hasPoliciesAvailable) {
            if (!getNotification(notificationId)) {
                const error: Notification = new Notification(
                    notificationId,
                    t("flows:core.validation.fields.policyConsent.general"),
                    NotificationType.ERROR
                );

                error.addResource(resource);

                if (!hasPoliciesSelected) {
                    error.addResourceFieldNotification(
                        "policies",
                        t("flows:core.validation.fields.policyConsent.policiesRequired")
                    );
                }

                if (!hasPoliciesAvailable) {
                    error.addResourceFieldNotification(
                        "policies-available",
                        t("flows:core.validation.fields.policyConsent.noPoliciesAvailable")
                    );
                }

                addNotification(error);
            } else {
                const existingError: Notification = cloneDeep(getNotification(notificationId));
                let hasChanges: boolean = false;

                if (!hasPoliciesSelected && !existingError.hasResourceFieldNotification("policies")) {
                    existingError.addResourceFieldNotification(
                        "policies",
                        t("flows:core.validation.fields.policyConsent.policiesRequired")
                    );
                    hasChanges = true;
                } else if (hasPoliciesSelected && existingError.hasResourceFieldNotification("policies")) {
                    existingError.removeResourceFieldNotification("policies");
                    hasChanges = true;
                }

                if (!hasPoliciesAvailable && !existingError.hasResourceFieldNotification("policies-available")) {
                    existingError.addResourceFieldNotification(
                        "policies-available",
                        t("flows:core.validation.fields.policyConsent.noPoliciesAvailable")
                    );
                    hasChanges = true;
                } else if (hasPoliciesAvailable && existingError.hasResourceFieldNotification("policies-available")) {
                    existingError.removeResourceFieldNotification("policies-available");
                    hasChanges = true;
                }

                if (hasChanges) {
                    addNotification(existingError);
                }
            }
        } else if (getNotification(notificationId)) {
            removeNotification(notificationId);
        }
    }, [ resource, selectedPolicies, allPolicies, addNotification, removeNotification, getNotification, t ]);

    useEffect(() => {
        return () => {
            if (resource) {
                removeNotification(`${ resource.id }_policy-consent-validation`);
            }
        };
    }, []);
};

export default useValidatePolicyConsent;
