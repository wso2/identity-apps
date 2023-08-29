<%--
  ~ Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com).
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
    if (IdentityTenantUtil.isTenantQualifiedUrlsEnabled()) {
        tenantDomain = IdentityTenantUtil.getTenantDomainFromContext();
        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;
        spAppName = request.getParameter("sp");
        String tenantDomainFromURL = request.getParameter("t");
        String tenantDomainOfUser = request.getParameter("ut");
        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, "Console")) {
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
            if (StringUtils.equals(spAppName, "My Account")
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    } else {
        tenantDomain = request.getParameter("tenantDomain");
        String tenantDomainFromURL = request.getParameter("t");
        String tenantDomainOfUser = request.getParameter("ut");
        spAppName = request.getParameter("sp");

        if (StringUtils.isBlank(tenantDomain)) {
            tenantDomain = request.getParameter(IdentityManagementEndpointConstants.TENANT_DOMAIN);
        }

        if (!StringUtils.isBlank(tenantDomainFromURL)) {
            tenantDomain = tenantDomainFromURL;
        }

        tenantForTheming = tenantDomain;
        userTenant = tenantDomain;
        userTenantDomain = tenantDomainOfUser;

        if (StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)
            && StringUtils.equals(spAppName, "Console")) {
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
            if (StringUtils.equals(spAppName, "My Account")
                && StringUtils.equals(tenantDomain, IdentityManagementEndpointConstants.SUPER_TENANT)) {
                tenantForTheming = userTenantDomain;
                userTenant = userTenantDomain;
            }
        }
    }

    if (!StringUtils.equals(tenantDomain, "carbon.super")) {
        identityServerEndpointContextParam = ServiceURLBuilder.create().setTenant(tenantDomain).build()
                .getAbsolutePublicURL();
    }

    // If `tenantForTheming` is null, fallback to super tenant.
    if (StringUtils.isBlank(tenantForTheming)) {
        tenantForTheming = IdentityManagementEndpointConstants.SUPER_TENANT;
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
