<%--
  ~ Copyright (c) 2016-2023, WSO2 LLC. (https://www.wso2.com).
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

<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%@ page isErrorPage="true" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.event.IdentityEventException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.recovery.IdentityRecoveryConstants" %>
<%@ page import="org.wso2.carbon.identity.recovery.util.Utils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page import="java.net.URISyntaxException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.PreferenceRetrievalClientException" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String errorCode = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorCode"));
    String invalidConfirmationErrorCode = IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_INVALID_CODE.getCode();
    String callback = request.getParameter("callback");
    boolean isValidCallback = true;

    if (invalidConfirmationErrorCode.equals(errorCode)) {
        tenantDomain = StringUtils.EMPTY;
        if (StringUtils.isNotBlank(request.getParameter("tenantdomain"))){
            tenantDomain = request.getParameter("tenantdomain").trim();
        } else if (StringUtils.isNotBlank(request.getParameter("tenantDomain"))){
            tenantDomain = request.getParameter("tenantDomain").trim();
        }

        Boolean isValidCallBackURL = false;
        try {
            if (StringUtils.isNotBlank(callback)) {
                PreferenceRetrievalClient preferenceRetrievalClient = new PreferenceRetrievalClient();
                isValidCallBackURL = preferenceRetrievalClient.checkIfRecoveryCallbackURLValid(tenantDomain, callback);
            }
        } catch (PreferenceRetrievalClientException e) {
            request.setAttribute("error", true);
            request.setAttribute("errorMsg", IdentityManagementEndpointUtil
                .i18n(recoveryResourceBundle, "something.went.wrong.contact.admin"));
            IdentityManagementEndpointUtil.addErrorInformation(request, e);
            request.getRequestDispatcher("error.jsp").forward(request, response);
            return;
        }

        if (StringUtils.isNotBlank(callback) && !isValidCallBackURL) {
                    isValidCallback = false;
        }
    }

    try {
        IdentityManagementEndpointUtil.getURLEncodedCallback(callback);
    } catch (URISyntaxException e) {
        isValidCallback = false;
    }
    if (StringUtils.isBlank(errorMsg)) {
        errorMsg = IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Server.failed.to.respond");
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "large");
%>

<!doctype html>
<html lang="en-US">
<head>
    <%-- header --%>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
    <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
    <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout recovery-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <div class="segment-form">
                    <div class="ui visible negative message" id="server-error-code">
                        <div class="header"><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "error")%>!</div>
                        <%
                            if (IdentityRecoveryConstants.ErrorMessages.ERROR_CODE_INVALID_CODE.getCode()
                                    .equals(errorCode)) {
                        %>
                        <p><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Invalid.reset.link")%></p>
                        <%
                        } else {
                        %>
                        <p><%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%></p>
                        <%
                            }
                        %>
                    </div>

                    <div id="action-buttons" class="buttons">
                        <a id = "go-back-button" href="javascript:goBack()" class="ui button primary button">
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Go back")%>
                        </a>
                    </div>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
        </layout:component>
    </layout:main>

    <%-- footer --%>
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script>
        $(document).ready(function () {
            // Checks if the `callback` URL param is present, and if not, hides the `Go Back` button.
            if ("<%=StringUtils.isEmpty(callback)%>" === "true") {
                $("#action-buttons").hide();
            }
            if ("<%=isValidCallback%>" === "false") {
                $("#go-back-button").addClass("disabled");
                $("#action-buttons").attr("title", "<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "request.has.an.invalid.callback.URL")%>.");
            }
        });

        <% if (isValidCallback) { %>
        function goBack() {

            var errorCodeFromParams = "<%=errorCode%>";
            var invalidConfirmationErrorCode = "<%=invalidConfirmationErrorCode%>";

            // Check if the error is related to the confirmation code being invalid.
            // If so, navigate the users to the URL defined in `callback` URL param.
            if (errorCodeFromParams === invalidConfirmationErrorCode) {
                window.location.href = "<%=Encode.forHtmlAttribute(callback)%>";

                return;
            }

            window.history.back();
        }
        <% } %>
    </script>
</body>
</html>
