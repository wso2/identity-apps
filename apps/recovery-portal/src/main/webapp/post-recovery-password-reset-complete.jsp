<%--
  ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
  ~ Version 2.0 (the "License"); you may not use this file except
  ~ in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~ http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing,
  ~ software distributed under the License is distributed on an
  ~ "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.*" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.PasswordRecoveryApiV1" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.passwordrecovery.v1.ResetRequest" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.Error" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="java.util.Base64" %>
<%@ page import="org.json.simple.JSONObject" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="org.wso2.carbon.core.util.SignatureUtil" %>
<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%
    String ERROR_MESSAGE = "errorMsg";
    String ERROR_CODE = "errorCode";
    String PASSWORD_RESET_PAGE = "post-recovery-password-reset.jsp";
    String AUTO_LOGIN_COOKIE_NAME = "ALOR";
    String passwordPolicyViolationErrorCode = "PWR-10004";
    String confirmationKey =
            IdentityManagementEndpointUtil.getStringValue(request.getSession().getAttribute("confirmationKey"));
    String newPassword = request.getParameter("reset-password");
    String callback = request.getParameter("callback");
    String sessionDataKey = request.getParameter("sessionDataKey");
    String username = request.getParameter("username");
    boolean isAutoLoginEnable = Boolean.parseBoolean(Utils.getConnectorConfig("Recovery.AutoLogin.Enable",
            tenantDomain));

    if (StringUtils.isBlank(callback)) {
        callback = IdentityManagementEndpointUtil.getUserPortalUrl(
                application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL));
    }

    if (StringUtils.isNotBlank(newPassword)) {
        PasswordRecoveryApiV1 passwordRecoveryApiV1 = new PasswordRecoveryApiV1();
        ResetRequest resetRequest = new ResetRequest();

        List<Property> properties = new ArrayList<Property>();
        Property property = new Property();
        property.setKey("callback");
        property.setValue(URLEncoder.encode(callback, "UTF-8"));
        properties.add(property);

        Property tenantProperty = new Property();
        tenantProperty.setKey(IdentityManagementEndpointConstants.TENANT_DOMAIN);
        if (tenantDomain == null) {
            tenantDomain = IdentityManagementEndpointConstants.SUPER_TENANT;
        }
        tenantProperty.setValue(URLEncoder.encode(tenantDomain, "UTF-8"));
        properties.add(tenantProperty);

        resetRequest.setResetCode(confirmationKey);
        resetRequest.setPassword(newPassword);
        resetRequest.setProperties(properties);
    
        try {
            passwordRecoveryApiV1.resetPassword(resetRequest, tenantDomain);

            if (isAutoLoginEnable) {
                String signature = Base64.getEncoder().encodeToString(SignatureUtil.doSignature(username));
                JSONObject cookieValueInJson = new JSONObject();
                cookieValueInJson.put("username", username);
                cookieValueInJson.put("signature", signature);
                Cookie cookie = new Cookie(AUTO_LOGIN_COOKIE_NAME,
                        Base64.getEncoder().encodeToString(cookieValueInJson.toString().getBytes()));
                cookie.setPath("/");
                cookie.setSecure(true);
                cookie.setMaxAge(300);
                response.addCookie(cookie);
            }
        } catch (ApiException e) {
//  TODO :          request.setAttribute("tenantDomain", tenantDomain);
//            request.setAttribute("callback", callback);

            Error error = IdentityManagementEndpointUtil.buildError(e);
            IdentityManagementEndpointUtil.addErrorInformation(request, error);
            if (error != null) {
                request.setAttribute(ERROR_MESSAGE, error.getDescription());
                request.setAttribute(ERROR_CODE, error.getCode());
                if (passwordPolicyViolationErrorCode.equals(error.getCode())) {
                    String i18Resource = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, error.getCode());
                    if (!i18Resource.equals(error.getCode())) {
                        request.setAttribute(ERROR_MESSAGE, i18Resource);
                    }
                    request.setAttribute(IdentityManagementEndpointConstants.TENANT_DOMAIN, tenantDomain);
                    request.setAttribute(IdentityManagementEndpointConstants.CALLBACK, callback);
                    request.getRequestDispatcher(PASSWORD_RESET_PAGE).forward(request, response);
                    return;
                }
            }
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }
    } else {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Password.cannot.be.empty"));
        request.getRequestDispatcher("post-recovery-password-reset.jsp").forward(request, response);
        return;
    }
    session.invalidate();
%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<!doctype html>
<html>
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:directive.include file="includes/header.jsp"/>
    <% } %>
</head>
<body>
<div class="ui tiny modal notify">
    <div class="header">
        <h4>
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Information")%>
        </h4>
    </div>
    <div class="content">
        <p class="ui success message">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Updated.the.password.successfully")%>
        </p>
    </div>
    <div class="actions">
        <div id="closeButton" class="ui primary button cancel">
            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Close")%>
        </div>
    </div>
</div>

<form id="callbackForm" name="callbackForm" method="post" action="/commonauth">
    <%
        if (username != null) {
    %>
    <div>
        <input type="hidden" name="username"
               value="<%=Encode.forHtmlAttribute(username)%>"/>
    </div>
    <%
        }
    %>
    <%
        if (sessionDataKey != null) {
    %>
    <div>
        <input type="hidden" name="sessionDataKey"
               value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
    </div>
    <%
        }
    %>
</form>

<!-- footer -->
<%
    File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
    if (footerFile.exists()) {
%>
<jsp:include page="extensions/footer.jsp"/>
<% } else { %>
<jsp:directive.include file="includes/footer.jsp"/>
<% } %>

<script type="application/javascript">
    $(document).ready(function () {

        $('.notify').modal({
            onHide: function () {
                <%
                   try {
                       if(isAutoLoginEnable) {
            %>
                document.callbackForm.submit();
                <%
                       } else {
                %>
                location.href = "<%= IdentityManagementEndpointUtil.getURLEncodedCallback(callback)%>";
                <%
                }
                } catch (URISyntaxException e) {
                    request.setAttribute("error", true);
                    request.setAttribute("errorMsg", "Invalid callback URL found in the request.");
                    request.getRequestDispatcher("error.jsp").forward(request, response);
                    return;
                }
                %>
            },
            blurring: true,
            detachable:true,
            closable: false,
            centered: true,
        }).modal("show");

    });
</script>
</body>
</html>