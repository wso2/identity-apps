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
import { Action } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import Notification, { NotificationType } from "@wso2is/admin.flow-builder-core.v1/models/notification";
import { ExecutionTypes, StepData, StepTypes } from "@wso2is/admin.flow-builder-core.v1/models/steps";
import { RolesV2Interface } from "@wso2is/admin.roles.v2/models/roles";
import { Node, useReactFlow } from "@xyflow/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import OrganizationAttributeConstants from "../constants/organization-attribute-constants";
import RegistrationFlowExecutorConstants from "../constants/registration-flow-executor-constants";
import collectOrganizationAttributeIdentifiers from "../utils/collect-organization-attribute-identifiers";
import { parseOrganizationRoleIds } from "../utils/organization-role-utils";
import useSharedOrganizationRoles from "./use-shared-organization-roles";

const NOTIFICATION_ID: string = "organization-attribute-validation";
const FEDERATION_NOTIFICATION_ID: string = "organization-federation-validation";
const ROLE_NOTIFICATION_ID: string = "organization-role-validation";
const FEDERATED_EXECUTORS: string[] = [
    ExecutionTypes.GoogleFederation,
    ExecutionTypes.AppleFederation,
    ExecutionTypes.FacebookFederation,
    ExecutionTypes.MicrosoftFederation,
    ExecutionTypes.GithubFederation,
    ExecutionTypes.DigitalWalletFederation
];

/**
 * Custom hook that validates organization attribute collection and blocks federated organization onboarding.
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
    const hasFederatedAuthentication: boolean = nodes.some((node: Node): boolean =>
        FEDERATED_EXECUTORS.includes((node.data?.action as Action)?.executor?.name)
    );
    const selectedRoleIds: string[] = nodes.filter((node: Node): boolean => node.type === StepTypes.End)
        .flatMap((node: Node): string[] => parseOrganizationRoleIds(
            (node.data as StepData)?.action?.executor?.meta?.[RegistrationFlowExecutorConstants.ROLE_IDS_KEY]
        ));
    const { roles, sharedRoles, isLoaded, error } = useSharedOrganizationRoles(
        hasOrganizationName && selectedRoleIds.length > 0
    );
    const unavailableRoles: string = isLoaded ? selectedRoleIds.filter((roleId: string): boolean =>
        !sharedRoles.some((role: RolesV2Interface): boolean => role.id === roleId))
        .map((roleId: string): string =>
            roles.find((role: RolesV2Interface) => role.id === roleId)?.displayName ?? roleId)
        .join(", ") : "";

    useEffect(() => {
        if (!unavailableRoles && !error) {
            removeNotification(ROLE_NOTIFICATION_ID);

            return;
        }

        addNotification(new Notification(
            ROLE_NOTIFICATION_ID,
            error ? t("flows:registrationFlow.steps.end.organizationRoles.fetchError") :
                t("flows:registrationFlow.steps.end.organizationRoles.unavailable", { roles: unavailableRoles }),
            NotificationType.WARNING
        ));
    }, [ unavailableRoles, error, t, addNotification, removeNotification ]);

    useEffect(() => {
        if (!hasOrganizationName || !hasFederatedAuthentication) {
            removeNotification(FEDERATION_NOTIFICATION_ID);

            return;
        }

        addNotification(new Notification(
            FEDERATION_NOTIFICATION_ID,
            t("flows:core.validation.organizationAttributes.federatedAuthenticationNotSupported"),
            NotificationType.ERROR
        ));
    }, [ hasOrganizationName, hasFederatedAuthentication, t, addNotification, removeNotification ]);

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
            removeNotification(FEDERATION_NOTIFICATION_ID);
            removeNotification(ROLE_NOTIFICATION_ID);
        };
    }, [ removeNotification ]);
};

export default useOrganizationAttributeValidation;
