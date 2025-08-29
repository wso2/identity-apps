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
<%@ page import="org.wso2.carbon.identity.core.URLBuilderException" %>
<%@ page import="javax.servlet.http.HttpServletRequest" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.CONFIGURATION_ERROR" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.ERROR_WHILE_BUILDING_THE_ACCOUNT_RECOVERY_ENDPOINT_URL" %>

<%!
    private static boolean dynamicPortalPWEnabled;
    private static boolean dynamicPortalSREnabled;
    private static String dynamicRegistrationPortalURL;
    private static String dynamicPasswordRecoveryPortalURL;
    private static final String PASSWORD_RECOVERY_FLOW_ENDPOINT = "/api/server/v1/flow/config?flowType=PASSWORD_RECOVERY";
    private static final String SELF_SIGNUP_FLOW_ENDPOINT = "/api/server/v1/flow/config?flowType=REGISTRATION";
    private static final String IS_ENABLED_PROPERTY = "isEnabled";
    private static final String ACCOUNTS_ENDPOINT = "/accounts";

    /**
     * Initialize them from a scriptlet (or via a setter).
     */
    public static void setDynamicPortalValues(boolean pwEnabled, boolean srEnabled, String accountsEndpoint) {
        dynamicPortalPWEnabled = pwEnabled;
        dynamicPortalSREnabled = srEnabled;
        if (srEnabled) {
            dynamicRegistrationPortalURL = accountsEndpoint + "/register?flowType=REGISTRATION";
        }
        if (pwEnabled) {
            dynamicPasswordRecoveryPortalURL = accountsEndpoint + "/recovery?flowType=PASSWORD_RECOVERY";
        }
    }

    public static String getDynamicPasswordRecoveryUrl(String spId) {
        if (dynamicPasswordRecoveryPortalURL == null) {
            return "";
        }
        if (StringUtils.isNotBlank(spId)) {
            return dynamicPasswordRecoveryPortalURL + "&spId=" + Encode.forUriComponent(spId);
        }
        return dynamicPasswordRecoveryPortalURL;
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

        String sp = null;

        try {
            if (urlParameters != null && !urlParameters.isEmpty()) {
                String[] params = urlParameters.split("&");

                for (String param : params) {
                    int idx = param.indexOf('=');

                    if (idx > 0) {
                        String key = param.substring(0, idx);
                        String value = param.substring(idx + 1);

                        if ("sp".equals(key)) {
                            sp = value;

                            break;
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Gracefully, exit.
        }

        // Console is currently skipped from self-registration.
        // Tracker: https://github.com/wso2/product-is/issues/25484
        if (dynamicPortalSREnabled && StringUtils.isNotBlank(dynamicRegistrationPortalURL) && !sp.equals(CONSOLE)) {
            return dynamicRegistrationPortalURL + "&" + urlParameters;
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
        String localeString, String urlParameters) {

        String baseURL = passwordRecoveryOverrideURL;

        if (dynamicPortalPWEnabled) {
            if (StringUtils.isNotBlank(recoveryPortalOverrideURL)) {
                baseURL = recoveryPortalOverrideURL;
            } else if (StringUtils.isNotBlank(dynamicPasswordRecoveryPortalURL)) {
                baseURL = dynamicPasswordRecoveryPortalURL;
            }
        }

        if (StringUtils.isNotBlank(baseURL) && StringUtils.isNotBlank(localeString)) {
            String separator = baseURL.contains("?") ? "&" : "?";
            baseURL = baseURL + separator + "ui_locales=" + localeString + "&" + urlParameters;
        }
        return baseURL;
    }
%>

<%
    String accountsEndpoint = "";
    Boolean isDynamicPWEnabled = false;
    Boolean isDynamicSREnabled = false;

    if (StringUtils.isBlank(accountsEndpoint)) {
        try {
            accountsEndpoint = ServiceURLBuilder.create().addPath(ACCOUNTS_ENDPOINT).build()
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
        isDynamicPWEnabled = commonDataRetrievalClient.checkBooleanProperty(
                PASSWORD_RECOVERY_FLOW_ENDPOINT, tenantDomain, IS_ENABLED_PROPERTY, false, true);
        isDynamicSREnabled = commonDataRetrievalClient.checkBooleanProperty(
                SELF_SIGNUP_FLOW_ENDPOINT, tenantDomain, IS_ENABLED_PROPERTY, false, true);
    } catch (CommonDataRetrievalClientException e) {
        // Ignored and fallback to default recovery portal.
    }

    setDynamicPortalValues(isDynamicPWEnabled, isDynamicSREnabled, accountsEndpoint);
%>
