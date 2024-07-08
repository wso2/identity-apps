<%--
  ~ Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~    http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
--%>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityTenantUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%
    final String CONSOLE = "Console";
    final String MY_ACCOUNT = "My Account";
    
    String TENANT_DOMAIN_KEY = "tenantDomain";
    String TENANT_DOMAIN_SHORT = "t";
    String USER_TENANT_DOMAIN_SHORT = "ut";
    String SERVICE_PROVIDER_NAME_SHORT = "sp";
    String SERVICE_PROVIDER_ID_SHORT = "spId";

    String identityServerEndpointContextParam = application.getInitParameter("IdentityServerEndpointContextURL");
    String samlssoURL = "../samlsso";
    String commonauthURL = "../commonauth";
    String oauth2AuthorizeURL = "../oauth2/authorize";
    String oidcLogoutURL = "../oidc/logout";
    String openidServerURL = "../openidserver";
    String logincontextURL = "../logincontext";
    String longwaitstatusURL = "/longwaitstatus";

    String tenantDomain;
    String userTenantDomain;
    String tenantForTheming;
    String userTenant;
    String spAppName;
    String spAppId;

    if (IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
        tenantDomain = IdentityTenantUtil.resolveTenantDomain();
        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;

        spAppName = request.getParameter(SERVICE_PROVIDER_NAME_SHORT);
        if (StringUtils.isBlank(spAppName) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT))) {
            spAppName = (String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT);
        }

        spAppId = request.getParameter(SERVICE_PROVIDER_ID_SHORT);
        if (StringUtils.isBlank(spAppId) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_ID_SHORT))) {
            spAppId = (String) request.getAttribute(SERVICE_PROVIDER_ID_SHORT);
        }

        String tenantDomainFromURL = request.getParameter(TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainFromURL) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN_SHORT))) {
            tenantDomainFromURL = (String) request.getAttribute(TENANT_DOMAIN_SHORT);
        }

        String tenantDomainOfUser = request.getParameter(USER_TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainOfUser) && StringUtils.isNotBlank((String) request.getAttribute(USER_TENANT_DOMAIN_SHORT))) {
            tenantDomainOfUser = (String) request.getAttribute(USER_TENANT_DOMAIN_SHORT);
        }

        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, CONSOLE)) {
            tenantForTheming = IdentityManagementEndpointConstants.SUPER_TENANT;
        } else {
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomainFromURL;
            }
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomain;
            }
            if (StringUtils.isNotBlank(tenantDomainOfUser)) {
                tenantForTheming = tenantDomainOfUser;
            }
            if (StringUtils.equals(spAppName, MY_ACCOUNT)
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    } else {
        tenantDomain = request.getParameter(TENANT_DOMAIN_KEY);
        if (StringUtils.isBlank(tenantDomain) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN_KEY))) {
            tenantDomain = (String) request.getAttribute(TENANT_DOMAIN_KEY);
        }

        String tenantDomainFromURL = request.getParameter(TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainFromURL) && StringUtils.isNotBlank((String) request.getAttribute(TENANT_DOMAIN_SHORT))) {
            tenantDomainFromURL = (String) request.getAttribute(TENANT_DOMAIN_SHORT);
        }

        String tenantDomainOfUser = request.getParameter(USER_TENANT_DOMAIN_SHORT);
        if (StringUtils.isBlank(tenantDomainOfUser) && StringUtils.isNotBlank((String) request.getAttribute(USER_TENANT_DOMAIN_SHORT))) {
            tenantDomainOfUser = (String) request.getAttribute(USER_TENANT_DOMAIN_SHORT);
        }

        spAppName = request.getParameter(SERVICE_PROVIDER_NAME_SHORT);
        if (StringUtils.isBlank(spAppName) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT))) {
            spAppName = (String) request.getAttribute(SERVICE_PROVIDER_NAME_SHORT);
        }

        spAppId = request.getParameter(SERVICE_PROVIDER_ID_SHORT);
        if (StringUtils.isBlank(spAppId) && StringUtils.isNotBlank((String) request.getAttribute(SERVICE_PROVIDER_ID_SHORT))) {
            spAppId = (String) request.getAttribute(SERVICE_PROVIDER_ID_SHORT);
        }

        if (StringUtils.isBlank(tenantDomain)) {
            tenantDomain = request.getParameter(IdentityManagementEndpointConstants.TENANT_DOMAIN);
            if (StringUtils.isBlank(tenantDomain) && StringUtils.isNotBlank((String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN))) {
                tenantDomain = (String) request.getAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN);
            }
        }

        if (!StringUtils.isBlank(tenantDomainFromURL)) {
            tenantDomain = tenantDomainFromURL;
        }

        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;
        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, CONSOLE)) {
            tenantForTheming = IdentityManagementEndpointConstants.SUPER_TENANT;
        } else {
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomainFromURL;
            }
            if (StringUtils.isBlank(userTenantDomain)) {
                userTenantDomain = tenantDomain;
            }
            if (StringUtils.isNotBlank(tenantDomainOfUser)) {
                tenantForTheming = tenantDomainOfUser;
            }
            if (StringUtils.equals(spAppName, MY_ACCOUNT)
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    }

    if (Boolean.parseBoolean(application.getInitParameter("IsHostedExternally"))) {
        identityServerEndpointContextParam = application.getInitParameter("IdentityServerEndpointContextURL");
    } else {
        identityServerEndpointContextParam = ServiceURLBuilder.create().setTenant(tenantDomain).build().getAbsolutePublicURL();
    }

    if (StringUtils.isNotBlank(identityServerEndpointContextParam)) {
        samlssoURL = identityServerEndpointContextParam + "/samlsso";
        commonauthURL = identityServerEndpointContextParam + "/commonauth";
        oauth2AuthorizeURL = identityServerEndpointContextParam + "/oauth2/authorize";
        oidcLogoutURL = identityServerEndpointContextParam + "/oidc/logout";
        openidServerURL = identityServerEndpointContextParam + "/oidc/logout";
        logincontextURL = identityServerEndpointContextParam + "/logincontext";
        longwaitstatusURL = identityServerEndpointContextParam + "/longwaitstatus";
    }
%>
