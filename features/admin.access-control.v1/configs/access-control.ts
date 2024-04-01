/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { PermissionsInterface } from "@wso2is/access-control";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureConfigInterface } from "../../admin.core.v1";
import { AccessControlConstants } from "../constants/access-control";

export class AccessControlUtils {

    public static getPermissions = (
        featureConfig: FeatureConfigInterface,
        allowedScopes: string
    ): PermissionsInterface => {
        return ({
            [ AccessControlConstants.API_RESOURCES ] : hasRequiredScopes(featureConfig?.apiResources,
                featureConfig?.apiResources?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.API_RESOURCES_READ ] : hasRequiredScopes(featureConfig?.apiResources,
                featureConfig?.apiResources?.scopes?.read, allowedScopes),
            [ AccessControlConstants.API_RESOURCES_WRITE ] : hasRequiredScopes(featureConfig?.apiResources,
                featureConfig?.apiResources?.scopes?.create, allowedScopes),
            [ AccessControlConstants.API_RESOURCES_EDIT ] : hasRequiredScopes(featureConfig?.apiResources,
                featureConfig?.apiResources?.scopes?.update, allowedScopes),
            [ AccessControlConstants.API_RESOURCES_DELETE ] : hasRequiredScopes(featureConfig?.apiResources,
                featureConfig?.apiResources?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.APPLICATION ] : hasRequiredScopes(featureConfig?.applications,
                featureConfig?.applications?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.APPLICATION_READ ] : hasRequiredScopes(featureConfig?.applications,
                featureConfig?.applications?.scopes?.read, allowedScopes),
            [ AccessControlConstants.APPLICATION_WRITE ] : hasRequiredScopes(featureConfig?.applications,
                featureConfig?.applications?.scopes?.create, allowedScopes),
            [ AccessControlConstants.APPLICATION_EDIT ] : hasRequiredScopes(featureConfig?.applications,
                featureConfig?.applications?.scopes?.update, allowedScopes),
            [ AccessControlConstants.APPLICATION_DELETE ] : hasRequiredScopes(featureConfig?.applications,
                featureConfig?.applications?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.ATTRIBUTE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.ATTRIBUTE_READ ] : hasRequiredScopes(featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.read, allowedScopes),
            [ AccessControlConstants.ATTRIBUTE_WRITE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.create, allowedScopes),
            [ AccessControlConstants.ATTRIBUTE_EDIT ] : hasRequiredScopes(featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.update, allowedScopes),
            [ AccessControlConstants.ATTRIBUTE_DELETE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.BRANDING ] : hasRequiredScopes(
                featureConfig?.branding,
                featureConfig?.branding?.scopes?.feature,
                allowedScopes),
            [ AccessControlConstants.BRANDING_READ ] : hasRequiredScopes(
                featureConfig?.branding,
                featureConfig?.branding?.scopes?.read,
                allowedScopes),
            [ AccessControlConstants.BRANDING_WRITE ] : hasRequiredScopes(
                featureConfig?.branding,
                featureConfig?.branding?.scopes?.create,
                allowedScopes),
            [ AccessControlConstants.BRANDING_EDIT ] : hasRequiredScopes(
                featureConfig?.branding,
                featureConfig?.branding?.scopes?.update,
                allowedScopes),
            [ AccessControlConstants.BRANDING_DELETE ] : hasRequiredScopes(
                featureConfig?.branding,
                featureConfig?.branding?.scopes?.delete,
                allowedScopes),

            [ AccessControlConstants.EMAIL_TEMPLATES ] : hasRequiredScopes(
                featureConfig?.emailTemplates,
                featureConfig?.emailTemplates?.scopes?.feature,
                allowedScopes),
            [ AccessControlConstants.EMAIL_TEMPLATES_READ ] : hasRequiredScopes(
                featureConfig?.emailTemplates,
                featureConfig?.emailTemplates?.scopes?.read,
                allowedScopes),
            [ AccessControlConstants.EMAIL_TEMPLATES_WRITE ] : hasRequiredScopes(
                featureConfig?.emailTemplates,
                featureConfig?.emailTemplates?.scopes?.create,
                allowedScopes),
            [ AccessControlConstants.EMAIL_TEMPLATES_EDIT ] : hasRequiredScopes(
                featureConfig?.emailTemplates,
                featureConfig?.emailTemplates?.scopes?.update,
                allowedScopes),
            [ AccessControlConstants.EMAIL_TEMPLATES_DELETE ] : hasRequiredScopes(
                featureConfig?.emailTemplates,
                featureConfig?.emailTemplates?.scopes?.delete,
                allowedScopes),

            [ AccessControlConstants.CERTIFICATES ] : hasRequiredScopes(featureConfig?.certificates,
                featureConfig?.certificates?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.CERTIFICATES_READ ] : hasRequiredScopes(featureConfig?.certificates,
                featureConfig?.certificates?.scopes?.read, allowedScopes),
            [ AccessControlConstants.CERTIFICATES_WRITE ] : hasRequiredScopes(featureConfig?.certificates,
                featureConfig?.certificates?.scopes?.create, allowedScopes),
            [ AccessControlConstants.CERTIFICATES_EDIT ] : hasRequiredScopes(featureConfig?.certificates,
                featureConfig?.certificates?.scopes?.update, allowedScopes),
            [ AccessControlConstants.CERTIFICATES_DELETE ] : hasRequiredScopes(featureConfig?.certificates,
                featureConfig?.certificates?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.EVENT_CONFIG_READ ] : hasRequiredScopes(
                featureConfig?.eventConfiguration,
                featureConfig?.eventConfiguration?.scopes?.read,
                allowedScopes),
            [ AccessControlConstants.EVENT_CONFIG_WRITE ] : hasRequiredScopes(
                featureConfig?.eventConfiguration,
                featureConfig?.eventConfiguration?.scopes?.create,
                allowedScopes),
            [ AccessControlConstants.EVENT_CONFIG_EDIT ] : hasRequiredScopes(
                featureConfig?.eventConfiguration,
                featureConfig?.eventConfiguration?.scopes?.update,
                allowedScopes),
            [ AccessControlConstants.EVENT_CONFIG_DELETE ] : hasRequiredScopes(
                featureConfig?.eventConfiguration,
                featureConfig?.eventConfiguration?.scopes?.delete,
                allowedScopes),

            [ AccessControlConstants.NOTIFICATION_SENDERS_READ ] : hasRequiredScopes(
                featureConfig?.notificationChannels,
                featureConfig?.notificationChannels?.scopes?.read,
                allowedScopes),
            [ AccessControlConstants.NOTIFICATION_SENDERS_WRITE ] : hasRequiredScopes(
                featureConfig?.notificationChannels,
                featureConfig?.notificationChannels?.scopes?.create,
                allowedScopes),
            [ AccessControlConstants.NOTIFICATION_SENDERS_EDIT ] : hasRequiredScopes(
                featureConfig?.notificationChannels,
                featureConfig?.notificationChannels?.scopes?.update,
                allowedScopes),
            [ AccessControlConstants.NOTIFICATION_SENDERS_DELETE ] : hasRequiredScopes(
                featureConfig?.notificationChannels,
                featureConfig?.notificationChannels?.scopes?.delete,
                allowedScopes),

            [ AccessControlConstants.GROUP ] : hasRequiredScopes(featureConfig?.groups,
                featureConfig?.groups?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.GROUP_READ ] : hasRequiredScopes(featureConfig?.groups,
                featureConfig?.groups?.scopes?.read, allowedScopes),
            [ AccessControlConstants.GROUP_WRITE ] : hasRequiredScopes(featureConfig?.groups,
                featureConfig?.groups?.scopes?.create, allowedScopes),
            [ AccessControlConstants.GROUP_EDIT ] : hasRequiredScopes(featureConfig?.groups,
                featureConfig?.groups?.scopes?.update, allowedScopes),
            [ AccessControlConstants.GROUP_DELETE ] : hasRequiredScopes(featureConfig?.groups,
                featureConfig?.groups?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.IDP ] : hasRequiredScopes(featureConfig?.identityProviders,
                featureConfig?.identityProviders?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.IDP_READ ] : hasRequiredScopes(featureConfig?.identityProviders,
                featureConfig?.identityProviders?.scopes?.read, allowedScopes),
            [ AccessControlConstants.IDP_WRITE ] : hasRequiredScopes(featureConfig?.identityProviders,
                featureConfig?.identityProviders?.scopes?.create, allowedScopes),
            [ AccessControlConstants.IDP_EDIT ] : hasRequiredScopes(featureConfig?.identityProviders,
                featureConfig?.identityProviders?.scopes?.update, allowedScopes),
            [ AccessControlConstants.PROVIDER_EDIT ] : hasRequiredScopes(featureConfig?.smsProviders,
                featureConfig?.smsProviders?.scopes?.create, allowedScopes),
            [ AccessControlConstants.IDP_DELETE ] : hasRequiredScopes(featureConfig?.identityProviders,
                featureConfig?.identityProviders?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.IDVP_READ ] : hasRequiredScopes(featureConfig?.identityVerificationProviders,
                featureConfig?.identityVerificationProviders?.scopes?.read, allowedScopes),
            [ AccessControlConstants.IDVP_WRITE ] : hasRequiredScopes(featureConfig?.identityVerificationProviders,
                featureConfig?.identityVerificationProviders?.scopes?.create, allowedScopes),
            [ AccessControlConstants.IDVP_EDIT ] : hasRequiredScopes(featureConfig?.identityVerificationProviders,
                featureConfig?.identityVerificationProviders?.scopes?.update, allowedScopes),
            [ AccessControlConstants.IDVP_DELETE ] : hasRequiredScopes(featureConfig?.identityVerificationProviders,
                featureConfig?.identityVerificationProviders?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.ROLE ]: hasRequiredScopes(featureConfig?.userRoles,
                featureConfig?.userRoles?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.ROLE_READ ]: hasRequiredScopes(featureConfig?.userRoles,
                featureConfig?.userRoles?.scopes?.read, allowedScopes),
            [ AccessControlConstants.ROLE_WRITE ]: hasRequiredScopes(featureConfig?.userRoles,
                featureConfig?.userRoles?.scopes?.create, allowedScopes),
            [ AccessControlConstants.ROLE_EDIT ]: hasRequiredScopes(featureConfig?.userRoles,
                featureConfig?.userRoles?.scopes?.update, allowedScopes),
            [ AccessControlConstants.ROLE_DELETE ]: hasRequiredScopes(featureConfig?.userRoles,
                featureConfig?.userRoles?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.SCOPE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                featureConfig?.oidcScopes?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.SCOPE_READ ] : hasRequiredScopes(featureConfig?.oidcScopes,
                featureConfig?.oidcScopes?.scopes?.read, allowedScopes),
            [ AccessControlConstants.SCOPE_WRITE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                featureConfig?.oidcScopes?.scopes?.create, allowedScopes),
            [ AccessControlConstants.SCOPE_EDIT ] : hasRequiredScopes(featureConfig?.oidcScopes,
                featureConfig?.oidcScopes?.scopes?.update, allowedScopes),
            [ AccessControlConstants.SCOPE_DELETE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                featureConfig?.oidcScopes?.scopes?.delete, allowedScopes),

            [AccessControlConstants.SECRET_WRITE]: hasRequiredScopes(
                featureConfig?.secretsManagement,
                featureConfig?.secretsManagement?.scopes?.create,
                allowedScopes
            ),
            [AccessControlConstants.SECRET_READ]: hasRequiredScopes(
                featureConfig?.secretsManagement,
                featureConfig?.secretsManagement?.scopes?.read,
                allowedScopes
            ),
            [AccessControlConstants.SECRET_EDIT]: hasRequiredScopes(
                featureConfig?.secretsManagement,
                featureConfig?.secretsManagement?.scopes?.update,
                allowedScopes
            ),
            [AccessControlConstants.SECRET_DELETE]: hasRequiredScopes(
                featureConfig?.secretsManagement,
                featureConfig?.secretsManagement?.scopes?.delete,
                allowedScopes
            ),

            [ AccessControlConstants.ORGANIZATION ]: hasRequiredScopes(
                featureConfig?.organizations,
                featureConfig?.organizations?.scopes?.feature,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_READ ]: hasRequiredScopes(
                featureConfig?.organizations,
                featureConfig?.organizations?.scopes?.read,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_EDIT ]: hasRequiredScopes(
                featureConfig?.organizations,
                featureConfig?.organizations?.scopes?.update,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_DELETE ]: hasRequiredScopes(
                featureConfig?.organizations,
                featureConfig?.organizations?.scopes?.delete,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_WRITE ]: hasRequiredScopes(
                featureConfig?.organizations,
                featureConfig?.organizations?.scopes?.create,
                allowedScopes
            ),

            [ AccessControlConstants.ORGANIZATION_DISCOVERY ]: hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.feature,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_DISCOVERY_READ ]: hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.read,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_DISCOVERY_EDIT ]: hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.update,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_DISCOVERY_DELETE ]: hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.delete,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_DISCOVERY_WRITE ]: hasRequiredScopes(
                featureConfig?.organizationDiscovery,
                featureConfig?.organizationDiscovery?.scopes?.create,
                allowedScopes
            ),

            [ AccessControlConstants.ORGANIZATION_ROLES ]: hasRequiredScopes(
                featureConfig?.organizationsRoles,
                featureConfig?.organizationsRoles?.scopes?.feature,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_ROLES_READ ]: hasRequiredScopes(
                featureConfig?.organizationsRoles,
                featureConfig?.organizationsRoles?.scopes?.read,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_ROLES_EDIT ]: hasRequiredScopes(
                featureConfig?.organizationsRoles,
                featureConfig?.organizationsRoles?.scopes?.update,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_ROLES_DELETE ]: hasRequiredScopes(
                featureConfig?.organizationsRoles,
                featureConfig?.organizationsRoles?.scopes?.delete,
                allowedScopes
            ),
            [ AccessControlConstants.ORGANIZATION_ROLES_WRITE ]: hasRequiredScopes(
                featureConfig?.organizationsRoles,
                featureConfig?.organizationsRoles?.scopes?.create,
                allowedScopes
            ),

            [ AccessControlConstants.USER ] : hasRequiredScopes(featureConfig?.users,
                featureConfig?.users?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.USER_READ ] : hasRequiredScopes(featureConfig?.users,
                featureConfig?.users?.scopes?.read, allowedScopes),
            [ AccessControlConstants.USER_WRITE ] : hasRequiredScopes(featureConfig?.users,
                featureConfig?.users?.scopes?.create, allowedScopes),
            [ AccessControlConstants.USER_EDIT ] : hasRequiredScopes(featureConfig?.users,
                featureConfig?.users?.scopes?.update, allowedScopes),
            [ AccessControlConstants.USER_DELETE ] : hasRequiredScopes(featureConfig?.users,
                featureConfig?.users?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.USER_STORE ] : hasRequiredScopes(featureConfig?.userStores,
                featureConfig?.userStores?.scopes?.feature, allowedScopes),
            [ AccessControlConstants.USER_STORE_READ ] : hasRequiredScopes(featureConfig?.userStores,
                featureConfig?.userStores?.scopes?.read, allowedScopes),
            [ AccessControlConstants.USER_STORE_WRITE ] : hasRequiredScopes(featureConfig?.userStores,
                featureConfig?.userStores?.scopes?.create, allowedScopes),
            [ AccessControlConstants.USER_STORE_EDIT ] : hasRequiredScopes(featureConfig?.userStores,
                featureConfig?.userStores?.scopes?.update, allowedScopes),
            [ AccessControlConstants.USER_STORE_DELETE ] : hasRequiredScopes(featureConfig?.userStores,
                featureConfig?.userStores?.scopes?.delete, allowedScopes),

            [ AccessControlConstants.RESIDENT_OUTBOUND_PROVISIONING ]: hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.feature,
                allowedScopes
            ),
            [ AccessControlConstants.RESIDENT_OUTBOUND_PROVISIONING_READ ]: hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.read,
                allowedScopes
            ),
            [ AccessControlConstants.RESIDENT_OUTBOUND_PROVISIONING_EDIT ]: hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.update,
                allowedScopes
            ),
            [ AccessControlConstants.RESIDENT_OUTBOUND_PROVISIONING_DELETE ]: hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.delete,
                allowedScopes
            ),
            [ AccessControlConstants.RESIDENT_OUTBOUND_PROVISIONING_WRITE ]: hasRequiredScopes(
                featureConfig?.residentOutboundProvisioning,
                featureConfig?.residentOutboundProvisioning?.scopes?.create,
                allowedScopes
            )
        });
    }
}
