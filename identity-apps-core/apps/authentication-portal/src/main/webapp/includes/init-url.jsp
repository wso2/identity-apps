<%--
 ~
 ~ Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
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
