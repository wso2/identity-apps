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

<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
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
            return dynamicRegistrationPortalURL;
        }

        String registrationEndpointUrl = accountRegistrationEndpointURL + "?"  + urlParameters;
        if (!StringUtils.isEmpty(urlEncodedURL)) {
            registrationEndpointUrl += "&callback=" + Encode.forHtmlAttribute(urlEncodedURL);
        }

        return registrationEndpointUrl;
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
        PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
        isDynamicPortalEnabled = preferenceRetrievalClient.checkSelfRegistrationEnableDynamicPortal(tenantDomain);
    } catch (PreferenceRetrievalClientException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", AuthenticationEndpointUtil
                .i18n(resourceBundle, "something.went.wrong.contact.admin"));
        IdentityManagementEndpointUtil.addErrorInformation(request, e);
        request.getRequestDispatcher("error.jsp").forward(request, response);

        return;
    }

    if (isDynamicPortalEnabled) {
        dynamicUserRegisterationPortalURL = identityMgtEndpoint + ACCOUNT_RECOVERY_ENDPOINT_REGISTER + "?"  + urlParameters;
    }

    setDynamicPortalValues(isDynamicPortalEnabled, dynamicUserRegisterationPortalURL);
%>
