<%--
  ~ Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.CommonDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.CommonDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL" %>

<%!
    private static boolean dynamicPortalEnabled;
    private static String dynamicRegistrationPortalURL;
    private static final String REGISTRATION_FLOW_ENDPOINT = "/api/server/v1/flow/config?flowType=REGISTRATION";
    private static final String REGISTRATION_ENABLED_PROPERTY = "isEnabled";

    /**
     * Initialize them from a scriptlet (or via a setter).
     */
    public static void setDynamicPortalValues(boolean portalEnabled, String regURL) {
        dynamicPortalEnabled = portalEnabled;
        dynamicRegistrationPortalURL = regURL;
    }

    /**
     * Returns the full self-registration portal URL, appending callback etc.
     * 
     * @param accountRegistrationEndpointURL The fallback endpoint URL.
     * @param urlEncodedURL                 The encoded callback URL.
     * @param urlParameters                 Additional URL query parameters.
     * @return The final registration portal URL.
     */
    public static String getRegistrationPortalUrl(String accountRegistrationEndpointURL, String urlEncodedURL,
            String urlParameters) {
    
        if (dynamicPortalEnabled) {
            return dynamicRegistrationPortalURL + "?" + urlParameters;
        }

        String registrationEndpointUrl = accountRegistrationEndpointURL + "?" + urlParameters;
        if (!StringUtils.isEmpty(urlEncodedURL)) {
            registrationEndpointUrl += "&callback=" + Encode.forHtmlAttribute(urlEncodedURL);
        }

        return registrationEndpointUrl;
    }

    /**
     * Returns the recovery portal URL.
     * 
     * @param passwordRecoveryOverrideURL The password recovery endpoint URL.
     * @param recoveryPortalOverrideURL   The recovery portal URL.
     * @param localeString                The locale string to append.
     * @return The final recovery portal URL.
     */
     public static String getRecoveryPortalUrl(String passwordRecoveryOverrideURL, String recoveryPortalOverrideURL, 
        String localeString) {

        String baseURL = passwordRecoveryOverrideURL;

        if (dynamicPortalEnabled && StringUtils.isNotBlank(recoveryPortalOverrideURL)) {
            baseURL = recoveryPortalOverrideURL;
        }

        if (StringUtils.isNotBlank(baseURL) && StringUtils.isNotBlank(localeString)) {
            String separator = baseURL.contains("?") ? "&" : "?";
            baseURL = baseURL + separator + "ui_locales=" + localeString;
        }
        return baseURL;
    }
%>

<%
    String identityMgtEndpoint = "";
    Boolean isDynamicPortalEnabled = false;
    String dynamicUserRegisterationPortalURL = "";
    String authenticationEndpoint = "/authenticationendpoint";

    if (StringUtils.isBlank(identityMgtEndpoint)) {
        try {
            identityMgtEndpoint = ServiceURLBuilder.create().addPath(authenticationEndpoint).build()
                    .getAbsolutePublicURL();
        } catch (URLBuilderException e) {
            request.setAttribute(STATUS, AuthenticationEndpointUtil.i18n(resourceBundle, CONFIGURATION_ERROR));
            request.setAttribute(STATUS_MSG, AuthenticationEndpointUtil
                    .i18n(resourceBundle, ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL));
            request.getRequestDispatcher("error.do").forward(request, response);
            return;
        }
    }

    try {
        CommonDataRetrievalClient commonDataRetrievalClient = new CommonDataRetrievalClient();
        isDynamicPortalEnabled = commonDataRetrievalClient.checkBooleanProperty(REGISTRATION_FLOW_ENDPOINT, tenantDomain, REGISTRATION_ENABLED_PROPERTY, false, true);
    } catch (CommonDataRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", AuthenticationEndpointUtil
                .i18n(resourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);

        return;
    }

    if (isDynamicPortalEnabled) {
        dynamicUserRegisterationPortalURL = identityMgtEndpoint + ACCOUNT_RECOVERY_ENDPOINT_REGISTER;
    }

    setDynamicPortalValues(isDynamicPortalEnabled, dynamicUserRegisterationPortalURL);
%>
