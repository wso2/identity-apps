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

import useValidationStatus from "@wso2is/admin.flow-builder-core.v1/hooks/use-validation-status";
import Notification, { NotificationType } from "@wso2is/admin.flow-builder-core.v1/models/notification";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import OrganizationAttributeConstants from "../constants/organization-attribute-constants";
import collectOrganizationAttributeIdentifiers from "../utils/collect-organization-attribute-identifiers";

const NOTIFICATION_ID: string = "organization-attribute-validation";

/**
 * Custom hook that warns when organization attributes are collected but cannot be provisioned.
 *
 * An organization cannot be created without a name, so a flow that collects organization attributes
 * without collecting an organization name silently discards them at runtime. The notification is a
 * warning rather than an error, so the flow still publishes — matching what the runtime does.
 */
const useOrganizationAttributeValidation = (): void => {
    const { t } = useTranslation();
    const { getNodes } = useReactFlow();
    const { addNotification, removeNotification } = useValidationStatus();

    const nodes: Node[] = getNodes();

    const identifiers: string[] = useMemo(() => collectOrganizationAttributeIdentifiers(nodes), [ nodes ]);

    const hasOrganizationAttributes: boolean = identifiers.length > 0;
    const hasOrganizationName: boolean = identifiers.includes(
        OrganizationAttributeConstants.ORGANIZATION_NAME_IDENTIFIER
    );

    useEffect(() => {
        if (!hasOrganizationAttributes || hasOrganizationName) {
            removeNotification(NOTIFICATION_ID);

            return;
        }

        const message:string = t("flows:core.validation.organizationAttributes.missingOrganizationName");

        const notification:Notification = new Notification(
            NOTIFICATION_ID,
            message,
            NotificationType.WARNING
        );

        addNotification(notification);
    }, [ hasOrganizationAttributes, hasOrganizationName, t, addNotification, removeNotification ]);

    useEffect(() => {
        return () => {
            removeNotification(NOTIFICATION_ID);
        };
    }, [ removeNotification ]);
};

export default useOrganizationAttributeValidation;
