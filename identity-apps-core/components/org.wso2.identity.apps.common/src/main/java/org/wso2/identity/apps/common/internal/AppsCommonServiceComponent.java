/*
 *  Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package org.wso2.identity.apps.common.internal;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.core.ServerStartupObserver;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.application.mgt.listener.ApplicationMgtListener;
import org.wso2.carbon.identity.core.util.IdentityCoreInitializedEvent;
import org.wso2.carbon.identity.oauth.OAuthAdminServiceImpl;
import org.wso2.carbon.identity.oauth.listener.OAuthApplicationMgtListener;
import org.wso2.carbon.identity.organization.management.service.OrganizationManagementInitialize;
import org.wso2.identity.apps.common.listner.AppPortalApplicationMgtListener;
import org.wso2.identity.apps.common.listner.AppPortalOAuthAppMgtListener;
import org.wso2.identity.apps.common.util.AppPortalUtils;

import java.util.HashSet;
import java.util.Set;

import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_ID;
import static org.wso2.identity.apps.common.util.AppPortalConstants.SYSTEM_PROP_SKIP_SERVER_INITIALIZATION;
import static org.wso2.identity.apps.common.util.AppPortalUtils.getOAuthInboundAuthenticationRequestConfig;

/***
 * OSGi service component which configure the service providers for portals.
 */
@Component(name = "org.wso2.identity.apps.common.AppsCommonServiceComponent",
           immediate = true,
           property = {
                   "componentName=identity-apps-common"
           })
public class AppsCommonServiceComponent {

    private static Log log = LogFactory.getLog(AppsCommonServiceComponent.class);

    @Activate
    protected void activate(BundleContext bundleContext) {

        try {
            // Initialize portal applications.
            if (skipPortalInitialization()) {
                if (log.isDebugEnabled()) {
                    log.debug("Portal application initialization is skipped.");
                }
            } else {
                // Initialize portal applications.
                AppPortalUtils.initiatePortals(SUPER_TENANT_DOMAIN_NAME, SUPER_TENANT_ID);
            }

            Set<String> systemApplications = getSystemApplications();
            if (!systemApplications.isEmpty()) {
                AppsCommonDataHolder.getInstance().setSystemApplications(systemApplications);

                Set<String> systemAppConsumerKeys = getSystemAppConsumerKeys(systemApplications);
                if (!systemAppConsumerKeys.isEmpty()) {
                    AppsCommonDataHolder.getInstance().setSystemAppConsumerKeys(systemAppConsumerKeys);
                }

                OAuthApplicationMgtListener oAuthApplicationMgtListener = new AppPortalOAuthAppMgtListener(true);
                bundleContext.registerService(OAuthApplicationMgtListener.class.getName(), oAuthApplicationMgtListener,
                        null);

                if (log.isDebugEnabled()) {
                    log.debug("AppPortalOAuthAppMgtListener registered successfully.");
                }

                ApplicationMgtListener applicationMgtListener = new AppPortalApplicationMgtListener(true);
                bundleContext.registerService(ApplicationMgtListener.class.getName(), applicationMgtListener, null);

                if (log.isDebugEnabled()) {
                    log.debug("AppPortalApplicationMgtListener registered successfully.");
                }
            }

            // AppsCommonServiceStartupObserver will wait until server startup is completed
            bundleContext.registerService(ServerStartupObserver.class.getName(),
                new AppsCommonServiceStartupObserver(), null);
        } catch (Throwable e) {
            log.error("Failed to activate identity apps common service component.", e);
        }
    }

    @Reference(name = "application.mgt.service",
               service = ApplicationManagementService.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetApplicationManagementService")
    protected void setApplicationManagementService(ApplicationManagementService applicationManagementService) {

        if (log.isDebugEnabled()) {
            log.debug("Setting the Application Management Service.");
        }
        AppsCommonDataHolder.getInstance().setApplicationManagementService(applicationManagementService);
    }

    protected void unsetApplicationManagementService(ApplicationManagementService applicationManagementService) {

        if (log.isDebugEnabled()) {
            log.debug("Un-setting the Application Management Service.");
        }
        AppsCommonDataHolder.getInstance().setApplicationManagementService(null);
    }

    @Reference(name = "oauth.admin.service",
               service = OAuthAdminServiceImpl.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetOAuthAdminService")
    protected void setOAuthAdminService(OAuthAdminServiceImpl oAuthAdminService) {

        if (log.isDebugEnabled()) {
            log.debug("Setting the OAuth Admin Service.");
        }
        AppsCommonDataHolder.getInstance().setOAuthAdminService(oAuthAdminService);
    }

    protected void unsetOAuthAdminService(OAuthAdminServiceImpl oAuthAdminService) {

        if (log.isDebugEnabled()) {
            log.debug("Un-setting the OAuth Admin Service.");
        }
        AppsCommonDataHolder.getInstance().setOAuthAdminService(null);
    }

    @Reference(name = "identity.core.init.event.service",
               service = IdentityCoreInitializedEvent.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetIdentityCoreInitializedEventService")
    protected void setIdentityCoreInitializedEventService(IdentityCoreInitializedEvent identityCoreInitializedEvent) {

        // Reference IdentityCoreInitializedEvent service to guarantee that this component will wait until identity core
        // is started.
    }

    protected void unsetIdentityCoreInitializedEventService(IdentityCoreInitializedEvent identityCoreInitializedEvent) {

    }

    @Reference(
            name = "organization.mgt.initialize.service",
            service = OrganizationManagementInitialize.class,
            cardinality = ReferenceCardinality.OPTIONAL,
            policy = ReferencePolicy.DYNAMIC,
            unbind = "unsetOrganizationManagementEnablingService"
    )
    protected void setOrganizationManagementEnablingService(
            OrganizationManagementInitialize organizationManagementInitializeService) {

        AppsCommonDataHolder.getInstance()
                .setOrganizationManagementEnabled(organizationManagementInitializeService);
    }

    protected void unsetOrganizationManagementEnablingService(
            OrganizationManagementInitialize organizationManagementInitializeInstance) {

        AppsCommonDataHolder.getInstance().setOrganizationManagementEnabled(null);
    }

    private boolean skipPortalInitialization() {

        return System.getProperty(SYSTEM_PROP_SKIP_SERVER_INITIALIZATION) != null;
    }

    private Set<String> getSystemApplications() {

        return AppsCommonDataHolder.getInstance().getApplicationManagementService().getSystemApplications();
    }

    private Set<String> getSystemAppConsumerKeys(Set<String> systemApplications)
            throws IdentityApplicationManagementException {

        Set<String> systemAppConsumerKeys = new HashSet<>();
        for (String applicationName : systemApplications) {
            ServiceProvider systemApplication = AppsCommonDataHolder.getInstance().getApplicationManagementService()
                    .getApplicationExcludingFileBasedSPs(applicationName, SUPER_TENANT_DOMAIN_NAME);
            if (systemApplication == null) {
                continue;
            }

            InboundAuthenticationRequestConfig inboundAuthenticationRequestConfig =
                    getOAuthInboundAuthenticationRequestConfig(systemApplication);
            if (inboundAuthenticationRequestConfig != null && StringUtils
                    .isNotBlank(inboundAuthenticationRequestConfig.getInboundAuthKey())) {
                systemAppConsumerKeys.add(inboundAuthenticationRequestConfig.getInboundAuthKey());
            }
        }
        return systemAppConsumerKeys;
    }
}
