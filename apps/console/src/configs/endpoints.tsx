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

import { getActionsResourceEndpoints } from "@wso2is/admin.actions.v1/configs/endpoints";
import { getAdministratorsResourceEndpoints } from "@wso2is/admin.administrators.v1/config/endpoints";
import { getAPIResourceEndpoints } from "@wso2is/admin.api-resources.v2/configs/endpoint";
import { getApplicationTemplatesResourcesEndpoints } from "@wso2is/admin.application-templates.v1/configs/endpoints";
import { getApplicationsResourceEndpoints } from "@wso2is/admin.applications.v1/configs/endpoints";
import { getBrandingResourceEndpoints } from "@wso2is/admin.branding.v1/configs/endpoints";
import { getCertificatesResourceEndpoints } from "@wso2is/admin.certificates.v1/configs/endpoints";
import { getClaimResourceEndpoints } from "@wso2is/admin.claims.v1/configs/endpoints";
import { getConnectionResourceEndpoints } from "@wso2is/admin.connections.v1/configs/endpoints";
import { DeploymentConfigInterface, ServiceResourceEndpointsInterface } from "@wso2is/admin.core.v1/models/config";
import { store } from "@wso2is/admin.core.v1/store";
import { getEmailTemplatesResourceEndpoints } from "@wso2is/admin.email-templates.v1/configs/endpoints";
import { getExtendedFeatureResourceEndpoints } from "@wso2is/admin.extensions.v1/configs/endpoints";
import { getFeatureGateResourceEndpoints } from "@wso2is/admin.feature-gate.v1/configs/endpoints";
import { getGroupsResourceEndpoints } from "@wso2is/admin.groups.v1/configs/endpoints";
import { getIDVPResourceEndpoints } from "@wso2is/admin.identity-verification-providers.v1/configs/endpoints";
import { getRemoteLoggingEndpoints } from "@wso2is/admin.logs.v1/configs/endpoints";
import { getScopesResourceEndpoints } from "@wso2is/admin.oidc-scopes.v1/configs/endpoints";
import { getInsightsResourceEndpoints } from "@wso2is/admin.org-insights.v1/config/org-insights";
import { getOrganizationsResourceEndpoints } from "@wso2is/admin.organizations.v1/configs/endpoints";
import { OrganizationUtils } from "@wso2is/admin.organizations.v1/utils/organization";
import { getPolicyAdministrationResourceEndpoints } from "@wso2is/admin.policy-administration.v1/configs/endpoints";
import {
    getPushProviderResourceEndpoints,
    getPushProviderTemplateEndpoints
} from "@wso2is/admin.push-providers.v1/configs/endpoints";
import {
    getRegistrationFlowBuilderResourceEndpoints
} from "@wso2is/admin.registration-flow-builder.v1/config/endpoints";
import {
    getRemoteFetchConfigResourceEndpoints
} from "@wso2is/admin.remote-repository-configuration.v1/configs/endpoints";
import { getRolesResourceEndpoints } from "@wso2is/admin.roles.v2/configs/endpoints";
import { getRulesEndpoints } from "@wso2is/admin.rules.v1/configs/endpoints";
import { getSecretsManagementEndpoints } from "@wso2is/admin.secrets.v1/configs/endpoints";
import { getServerConfigurationsResourceEndpoints } from "@wso2is/admin.server-configurations.v1/configs/endpoints";
import { getSmsTemplateResourceEndpoints } from "@wso2is/admin.sms-templates.v1/configs/endpoints";
import { getExtensionTemplatesEndpoints } from "@wso2is/admin.template-core.v1/configs/endpoints";
import { getTenantResourceEndpoints } from "@wso2is/admin.tenants.v1/configs/endpoints";
import { getUsersResourceEndpoints } from "@wso2is/admin.users.v1/configs/endpoints";
import { getUserstoreResourceEndpoints } from "@wso2is/admin.userstores.v1/configs/endpoints";
import { getValidationServiceEndpoints } from "@wso2is/admin.validation.v1/configs/endpoints";
import { getApprovalsResourceEndpoints } from "@wso2is/admin.workflow-approvals.v1/configs/endpoints";

// TODO: Revisit and clean the util functions.

/**
 * Get the deployment config.
 *
 * @returns Deployment config object.
 */
const getDeploymentConfig = (): DeploymentConfigInterface => {
    return {
        __experimental__platformIdP: window[ "AppUtils" ]?.getConfig()?.__experimental__platformIdP,
        accountApp: window[ "AppUtils" ]?.getConfig()?.accountApp,
        adminApp: window[ "AppUtils" ]?.getConfig()?.adminApp,
        allowMultipleAppProtocols: window[ "AppUtils" ]?.getConfig()?.allowMultipleAppProtocols,
        appBaseName: window[ "AppUtils" ]?.getConfig()?.appBaseWithTenant,
        appBaseNameWithoutTenant: window[ "AppUtils" ]?.getConfig()?.appBase,
        appHomePath: window[ "AppUtils" ]?.getConfig()?.routes?.home,
        appLoginPath: window[ "AppUtils" ]?.getConfig()?.routes?.login,
        appLogoutPath: window[ "AppUtils" ]?.getConfig()?.routes?.logout,
        centralDeploymentEnabled: window[ "AppUtils" ]?.getConfig()?.centralDeploymentEnabled,
        clientHost: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
        clientID: window[ "AppUtils" ]?.getConfig()?.clientID,
        clientOrigin: window[ "AppUtils" ]?.getConfig()?.clientOrigin,
        clientOriginWithTenant: window[ "AppUtils" ]?.getConfig()?.clientOriginWithTenant,
        customServerHost: window[ "AppUtils" ]?.getConfig()?.customServerHost,
        developerApp: window[ "AppUtils" ]?.getConfig()?.developerApp,
        docSiteURL: window[ "AppUtils" ]?.getConfig()?.docSiteUrl,
        extensions: window[ "AppUtils" ]?.getConfig()?.extensions,
        idpConfigs: window[ "AppUtils" ]?.getConfig()?.idpConfigs,
        loginCallbackUrl: window[ "AppUtils" ]?.getConfig()?.loginCallbackURL,
        organizationPrefix: window["AppUtils"]?.getConfig()?.organizationPrefix,
        serverHost: window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant,
        serverOrigin: window[ "AppUtils" ]?.getConfig()?.serverOrigin,
        superTenant: window[ "AppUtils" ]?.getConfig()?.superTenant,
        tenant: window[ "AppUtils" ]?.getConfig()?.tenant,
        tenantPath: window[ "AppUtils" ]?.getConfig()?.tenantPath,
        tenantPrefix: window[ "AppUtils" ]?.getConfig()?.tenantPrefix
    };
};

/**
 * This method adds organization path to the server host if an organization is selected.
 *
 * @returns Server host.
 */
const resolveServerHost = (skipAuthzRuntimePath?: boolean): string => {
    const serverOriginWithTenant: string = window["AppUtils"]?.getConfig()?.serverOriginWithTenant;

    if (skipAuthzRuntimePath && serverOriginWithTenant?.slice(-2) === "/o") {
        return serverOriginWithTenant.substring(0, serverOriginWithTenant.lastIndexOf("/o"));
    }

    return window["AppUtils"]?.getConfig()?.serverOriginWithTenant;
};

/**
 * This method adds organization path (t/org_uuid) to the server host if a sub-org is selected.
 *
 * @returns Server host.
 */
const resolveServerHostforFG = (): string => {
    if ((OrganizationUtils.isSuperOrganization(store.getState().organization.organization)
            || store.getState().organization.isFirstLevelOrganization)) {
        return window[ "AppUtils" ]?.getConfig()?.serverOriginWithTenant;
    } else {
        return `${
            window[ "AppUtils" ]?.getConfig()?.serverOrigin }/t/${ store.getState().organization.organization.id
        }`;
    }
};

/**
 * Get the the list of service resource endpoints.
 *
 * @returns Service resource endpoints as an object.
 */
export const getServiceResourceEndpoints = (): ServiceResourceEndpointsInterface => {
    const serviceResourceEndpoints: ServiceResourceEndpointsInterface = {
        ...getAPIResourceEndpoints(resolveServerHost()),
        ...getAdministratorsResourceEndpoints(resolveServerHost()),
        ...getApplicationsResourceEndpoints(resolveServerHost()),
        ...getApprovalsResourceEndpoints(getDeploymentConfig()?.serverHost),
        ...getBrandingResourceEndpoints(resolveServerHost()),
        ...getClaimResourceEndpoints(getDeploymentConfig()?.serverHost, resolveServerHost()),
        ...getCertificatesResourceEndpoints(getDeploymentConfig()?.serverHost),
        ...getIDVPResourceEndpoints(resolveServerHost()),
        ...getEmailTemplatesResourceEndpoints(resolveServerHost()),
        ...getConnectionResourceEndpoints(resolveServerHost()),
        ...getRolesResourceEndpoints(resolveServerHost(), getDeploymentConfig().serverHost),
        ...getServerConfigurationsResourceEndpoints(resolveServerHost()),
        ...getUsersResourceEndpoints(resolveServerHost()),
        ...getUserstoreResourceEndpoints(resolveServerHost()),
        ...getScopesResourceEndpoints(getDeploymentConfig()?.serverHost),
        ...getGroupsResourceEndpoints(resolveServerHost()),
        ...getValidationServiceEndpoints(resolveServerHost()),
        ...getRemoteFetchConfigResourceEndpoints(getDeploymentConfig()?.serverHost),
        ...getSecretsManagementEndpoints(getDeploymentConfig()?.serverHost),
        ...getExtendedFeatureResourceEndpoints(resolveServerHost(), getDeploymentConfig()),
        ...getOrganizationsResourceEndpoints(resolveServerHost(), getDeploymentConfig().serverHost),
        ...getTenantResourceEndpoints(getDeploymentConfig().serverOrigin),
        ...getFeatureGateResourceEndpoints(resolveServerHostforFG()),
        ...getInsightsResourceEndpoints(getDeploymentConfig()?.serverHost),
        ...getExtensionTemplatesEndpoints(resolveServerHost()),
        ...getApplicationTemplatesResourcesEndpoints(resolveServerHost()),
        ...getActionsResourceEndpoints(resolveServerHost()),
        ...getRulesEndpoints(resolveServerHost()),
        ...getSmsTemplateResourceEndpoints(resolveServerHost()),
        ...getPolicyAdministrationResourceEndpoints(resolveServerHost()),
        ...getPushProviderResourceEndpoints(resolveServerHost()),
        ...getPushProviderTemplateEndpoints(resolveServerHost()),
        ...getRemoteLoggingEndpoints(resolveServerHost()),
        ...getRegistrationFlowBuilderResourceEndpoints(resolveServerHost()),
        CORSOrigins: `${getDeploymentConfig()?.serverHost}/api/server/v1/cors/origins`,
        // TODO: Remove this endpoint and use ID token to get the details
        me: `${getDeploymentConfig()?.serverHost}/scim2/Me`,
        saml2Meta: `${resolveServerHost(true)}/identity/metadata/saml2`,
        wellKnown: `${resolveServerHost(true)}/oauth2/token/.well-known/openid-configuration`
    };

    return serviceResourceEndpoints;
};
