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

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.service.component.annotations.ReferenceCardinality;
import org.osgi.service.component.annotations.ReferencePolicy;
import org.wso2.carbon.context.PrivilegedCarbonContext;
import org.wso2.carbon.identity.application.common.IdentityApplicationManagementException;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationConfig;
import org.wso2.carbon.identity.application.common.model.InboundAuthenticationRequestConfig;
import org.wso2.carbon.identity.application.common.model.Property;
import org.wso2.carbon.identity.application.common.model.ServiceProvider;
import org.wso2.carbon.identity.application.mgt.ApplicationManagementService;
import org.wso2.carbon.identity.core.util.IdentityCoreInitializedEvent;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.OAuthAdminService;
import org.wso2.carbon.identity.oauth.OAuthUtil;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.registry.core.exceptions.RegistryException;
import org.wso2.carbon.registry.core.service.RegistryService;
import org.wso2.carbon.user.core.UserRealm;
import org.wso2.carbon.user.core.UserStoreException;
import org.wso2.identity.apps.common.util.AppPortalConstants;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.AUTHORIZATION_CODE;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.GrantTypes.REFRESH_TOKEN;
import static org.wso2.carbon.identity.oauth.common.OAuthConstants.OAuthVersions.VERSION_2;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_DOMAIN_NAME;
import static org.wso2.carbon.utils.multitenancy.MultitenantConstants.SUPER_TENANT_ID;
import static org.wso2.identity.apps.common.util.AppPortalConstants.INBOUND_AUTH2_TYPE;

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
            initiatePortals();
            log.info("Identity apps common service component activated successfully.");
        } catch (Throwable e) {
            log.error("Failed to activate identity apps common service component.", e);
        }
    }

    @Reference(name = "registry.service",
               service = RegistryService.class,
               cardinality = ReferenceCardinality.MANDATORY,
               policy = ReferencePolicy.DYNAMIC,
               unbind = "unsetRegistryService")
    protected void setRegistryService(RegistryService registryService) {

        if (log.isDebugEnabled()) {
            log.debug("Setting the Registry Service.");
        }
        AppsCommonDataHolder.getInstance().setRegistryService(registryService);
    }

    protected void unsetRegistryService(RegistryService registryService) {

        if (log.isDebugEnabled()) {
            log.debug("Un-setting the Registry Service.");
        }
        AppsCommonDataHolder.getInstance().setRegistryService(null);
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

    /**
     * Initiate portal applications.
     *
     * @throws IdentityApplicationManagementException IdentityApplicationManagementException.
     * @throws IdentityOAuthAdminException            IdentityOAuthAdminException.
     */
    private void initiatePortals()
            throws IdentityApplicationManagementException, IdentityOAuthAdminException, RegistryException,
            UserStoreException {

        ApplicationManagementService applicationMgtService = AppsCommonDataHolder.getInstance()
                .getApplicationManagementService();
        OAuthAdminService oAuthAdminService = new OAuthAdminService();

        UserRealm userRealm = AppsCommonDataHolder.getInstance().getRegistryService().getUserRealm(SUPER_TENANT_ID);
        String adminUsername = userRealm.getRealmConfiguration().getAdminUserName();

        for (AppPortalConstants.AppPortal appPortal : AppPortalConstants.AppPortal.values()) {
            if (applicationMgtService.getApplicationExcludingFileBasedSPs(appPortal.getName(), SUPER_TENANT_DOMAIN_NAME)
                    == null) {
                // Initiate portal
                String consumerSecret = OAuthUtil.getRandomNumber();
                createOAuth2Application(oAuthAdminService, appPortal.getName(), appPortal.getPath(),
                        appPortal.getConsumerKey(), consumerSecret, adminUsername);
                createApplication(applicationMgtService, appPortal.getName(), adminUsername, appPortal.getDescription(),
                        appPortal.getConsumerKey(), consumerSecret);
            }
        }
    }

    /**
     * Create portal application.
     *
     * @param applicationMgtService Application management service instant.
     * @param appName               Application name.
     * @param appOwner              Application owner.
     * @param appDescription        Application description.
     * @param consumerKey           Consumer key.
     * @param consumerSecret        Consumer secret.
     * @throws IdentityApplicationManagementException IdentityApplicationManagementException.
     */
    private void createApplication(ApplicationManagementService applicationMgtService, String appName, String appOwner,
            String appDescription, String consumerKey, String consumerSecret)
            throws IdentityApplicationManagementException {

        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setApplicationName(appName);
        serviceProvider.setDescription(appDescription);
        applicationMgtService.createApplicationWithTemplate(serviceProvider, SUPER_TENANT_DOMAIN_NAME, appOwner, null);

        InboundAuthenticationRequestConfig inboundAuthenticationRequestConfig = new
                InboundAuthenticationRequestConfig();
        inboundAuthenticationRequestConfig.setInboundAuthKey(consumerKey);
        inboundAuthenticationRequestConfig.setInboundAuthType(INBOUND_AUTH2_TYPE);
        Property property = new Property();
        property.setName("oauthConsumerSecret");
        property.setValue(consumerSecret);
        Property[] properties = { property };
        inboundAuthenticationRequestConfig.setProperties(properties);

        serviceProvider = applicationMgtService.getApplicationExcludingFileBasedSPs(appName, SUPER_TENANT_DOMAIN_NAME);
        InboundAuthenticationConfig inboundAuthenticationConfig = serviceProvider.getInboundAuthenticationConfig();

        List<InboundAuthenticationRequestConfig> inboundAuthenticationRequestConfigs = new ArrayList<>();
        if (inboundAuthenticationConfig.getInboundAuthenticationRequestConfigs() != null
                && inboundAuthenticationConfig.getInboundAuthenticationRequestConfigs().length > 0) {
            inboundAuthenticationRequestConfigs
                    .addAll(Arrays.asList(inboundAuthenticationConfig.getInboundAuthenticationRequestConfigs()));
        }
        inboundAuthenticationRequestConfigs.add(inboundAuthenticationRequestConfig);
        inboundAuthenticationConfig.setInboundAuthenticationRequestConfigs(
                inboundAuthenticationRequestConfigs.toArray(new InboundAuthenticationRequestConfig[0]));

        applicationMgtService.updateApplication(serviceProvider, SUPER_TENANT_DOMAIN_NAME, appOwner);
    }

    /**
     * Create OAuth2 application.
     *
     * @param oAuthAdminService OAuthAdminService instance.
     * @param applicationName   Application name.
     * @param portalPath        Portal path.
     * @param consumerKey       Consumer key.
     * @throws IdentityOAuthAdminException IdentityOAuthAdminException.
     */
    private void createOAuth2Application(OAuthAdminService oAuthAdminService, String applicationName, String portalPath,
            String consumerKey, String consumerSecret, String appOwner) throws IdentityOAuthAdminException {

        OAuthConsumerAppDTO oAuthConsumerAppDTO = new OAuthConsumerAppDTO();
        oAuthConsumerAppDTO.setApplicationName(applicationName);
        oAuthConsumerAppDTO.setOAuthVersion(VERSION_2);
        oAuthConsumerAppDTO.setOauthConsumerKey(consumerKey);
        oAuthConsumerAppDTO.setOauthConsumerSecret(consumerSecret);
        oAuthConsumerAppDTO.setCallbackUrl(IdentityUtil.getServerURL(portalPath, false, true));
        oAuthConsumerAppDTO.setBypassClientCredentials(true);
        oAuthConsumerAppDTO.setGrantTypes(AUTHORIZATION_CODE + " " + REFRESH_TOKEN);

        try {
            PrivilegedCarbonContext.startTenantFlow();
            PrivilegedCarbonContext privilegedCarbonContext = PrivilegedCarbonContext.getThreadLocalCarbonContext();
            privilegedCarbonContext.setTenantId(SUPER_TENANT_ID);
            privilegedCarbonContext.setTenantDomain(SUPER_TENANT_DOMAIN_NAME);
            privilegedCarbonContext.setUsername(appOwner);
            oAuthAdminService.registerOAuthApplicationData(oAuthConsumerAppDTO);
        } finally {
            PrivilegedCarbonContext.endTenantFlow();
        }
    }
}
