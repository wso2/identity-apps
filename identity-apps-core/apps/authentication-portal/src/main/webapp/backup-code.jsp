<%--
  ~ Copyright (c) 2022-2026, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.framework.util.FrameworkConstants" %>
<%@ page import="org.wso2.carbon.identity.application.authenticator.backupcode.constants.BackupCodeAuthenticatorConstants" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityCoreConstants" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS" %>
<%@ page import="static org.wso2.carbon.identity.application.authentication.endpoint.util.Constants.STATUS_MSG" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    request.getSession().invalidate();
    int otpLength = 6;
    String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
    String authenticationFailed = "false";
    if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
        authenticationFailed = "true";
        boolean isErrorMessageFromErrorCodeAdded = false;
        String errorCode = request.getParameter(FrameworkConstants.ERROR_CODE);
        if (errorCode != null) {
            if (errorCode.equals(IdentityCoreConstants.USER_ACCOUNT_LOCKED_ERROR_CODE)) {
                String lockedReason = request.getParameter(FrameworkConstants.LOCK_REASON);
                if (lockedReason != null) {
                    if (lockedReason.equals(BackupCodeAuthenticatorConstants.MAX_ATTEMPTS_EXCEEDED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.incorrect.login.attempts");
                        isErrorMessageFromErrorCodeAdded = true;
                    } else if (lockedReason.equals(BackupCodeAuthenticatorConstants.ADMIN_INITIATED)) {
                        errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.user.account.locked.admin.initiated");
                        isErrorMessageFromErrorCodeAdded = true;
                    }
                }
            }
        }
        if (!isErrorMessageFromErrorCodeAdded && request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
            String error = Encode.forHtmlAttribute(request.getParameter(Constants.AUTH_FAILURE_MSG));
             if (error.equalsIgnoreCase("authentication.fail.message") ||
                     error.equalsIgnoreCase("login.fail.message")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
            } else if (!error.equalsIgnoreCase(AuthenticationEndpointUtil.i18n(resourceBundle, error))) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, error);
            }
        }
    }
%>

<% request.setAttribute("pageName","backup-code"); %>

<html>
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

        <%-- analytics --%>
        <%
            File analyticsFile = new File(getServletContext().getRealPath("extensions/analytics.jsp"));
            if (analyticsFile.exists()) {
        %>
            <jsp:include page="extensions/analytics.jsp"/>
        <% } else { %>
            <jsp:include page="includes/analytics.jsp"/>
        <% } %>

        <script src="js/scripts.js"></script>
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->

        <script>
            var isBackupCodeSubmitting = false;

            // Handle form submission via a single guarded path.
            $(document).ready(function(){
                $('#backupCodeForm').on('submit', function (e) {
                    if (isBackupCodeSubmitting) {
                        e.preventDefault();
                        return false;
                    }
                    var backupInput = document.getElementById('backupOTPInput');
                    var backupCodeField = document.getElementById('BackupCode');
                    if (backupInput && backupCodeField) backupCodeField.value = backupInput.value;
                    isBackupCodeSubmitting = true;
                    $('#subButton').attr('disabled', true);
                    $('#subButton').addClass('loading');
                    trackEvent("authentication-portal-backup-code-click-continue", {
                        "tenant": insightsTenantIdentifier != "null" ? insightsTenantIdentifier : ""
                    });
                });
            });
        </script>
        <script type="text/javascript">
            function generateInstruction() {
                var backupCodeText = '<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.backup.code")%>';
                var text = backupCodeText
                $("#instruction").empty().append(text);
            }
            $(document).ready(function() {
                generateInstruction();
            })
        </script>
    </head>

    <body class="login-portal layout backup-code-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
        <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
            <jsp:include page="extensions/timeout.jsp"/>
        <% } else { %>
            <jsp:include page="util/timeout.jsp"/>
        <% } %>

        <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
            <layout:component componentName="ProductHeader">
                <%-- product-title --%>
                <%
                    File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                    if (productTitleFile.exists()) {
                %>
                    <jsp:include page="extensions/product-title.jsp"/>
                <% } else { %>
                    <jsp:include page="includes/product-title.jsp"/>
                <% } %>
            </layout:component>
            <layout:component componentName="MainSection">
                <div class="ui segment">
                    <%-- page content --%>
                    <h3 class="ui header text-center">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "backup.code.heading")%>
                    </h3>

                    <%
                        if ("true".equals(authenticationFailed)) {
                    %>
                            <div class="ui negative message" id="failed-msg"><%=errorMessage%></div>
                            <div class="ui divider hidden"></div>
                    <% } %>

                    <div class="segment-form">
                        <form action="<%=commonauthURL%>" method="post" id="backupCodeForm" class="ui large form otp-form">
                            <p class="text-center" id="instruction"></p>
                            <div class="field">
                                <input hidden type="text"  id="BackupCode" name="BackupCode" class="form-control">
                            </div>

                            <div class="equal width fields segmented-otp-field">
                                <input
                                    type="text"
                                    id="backupOTPInput"
                                    class="segmented-otp-input"
                                    maxlength="<%= otpLength %>"
                                    autocomplete="one-time-code"
                                    autocorrect="off"
                                    autocapitalize="off"
                                    spellcheck="false"
                                    autofocus
                                    aria-label="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "enter.backup.code")%>"
                                >
                                <% for (int i = 1; i <= otpLength; i++) { %>
                                <div class="field mt-5">
                                    <div class="text-center p-1 pb-3 pt-3" id="pincode-<%=i%>" aria-hidden="true">·</div>
                                </div>
                                <% } %>
                            </div>

                            <input id="sessionDataKey" type="hidden" name="sessionDataKey"
                                    value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>' />
                            <div class="ui divider hidden"></div>
                            <div>
                                <button
                                    type="submit"
                                    id="subButton"
                                    class="ui primary fluid large button"
                                >
                                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "authenticate")%>
                                </button>
                            </div>
                            <div class="ui divider hidden"></div>
                            <div class="text-center mt-1">
                                <% String multiOptionURI = request.getParameter("multiOptionURI");
                                    if (multiOptionURI != null &&
                                        AuthenticationEndpointUtil.isValidMultiOptionURI(multiOptionURI)) {
                                %>
                                    <a
                                        onclick="window.location.href='<%=Encode.forHtmlAttribute(multiOptionURI)%>';"
                                        target="_blank"
                                        class="ui primary basic button link-button"
                                        rel="noopener noreferrer"
                                        data-testid="login-page-backup-code-link"
                                    >
                                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "choose.other.option")%>
                                    </a>
                                <% } %>
                            </div>
                            <input id="multiOptionURI" type="hidden" name="multiOptionURI"
                                    value='<%=Encode.forHtmlAttribute(request.getParameter("multiOptionURI"))%>' />
                        </form>
                    </div>
                </div>
            </layout:component>
            <layout:component componentName="ProductFooter">
                <%-- product-footer --%>
                <%
                    File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                    if (productFooterFile.exists()) {
                %>
                    <jsp:include page="extensions/product-footer.jsp"/>
                <% } else { %>
                    <jsp:include page="includes/product-footer.jsp"/>
                <% } %>
            </layout:component>
            <layout:dynamicComponent filePathStoringVariableName="pathOfDynamicComponent">
                <jsp:include page="${pathOfDynamicComponent}" />
            </layout:dynamicComponent>
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

        <script type="text/javascript">
            var insightsTenantIdentifier = "<%=userTenant%>";

            function updateBackupDigitBoxes(value) {
                for (var i = 1; i <= <%= otpLength %>; i++) {
                    var box = document.getElementById('pincode-' + i);
                    if (box) box.textContent = (value.length >= i) ? value[i - 1] : '·';
                }
            }

            var backupInput = document.getElementById('backupOTPInput');
            var backupCodeField = document.getElementById('BackupCode');
            var submitBtn = document.getElementById('subButton');

            function updateBackupCursor(value) {
                for (var i = 1; i <= <%= otpLength %>; i++) {
                    var box = document.getElementById('pincode-' + i);
                    if (box) box.classList.remove('active-pincode');
                }
                if (value.length < <%= otpLength %>) {
                    var activeBox = document.getElementById('pincode-' + (value.length + 1));
                    if (activeBox) activeBox.classList.add('active-pincode');
                }
            }

            function handlePaste(e) {
                e.preventDefault();
                var pasted = (e.clipboardData || window.clipboardData).getData('Text').replace(/\s/g, '');
                if (!/^\d+$/.test(pasted)) return;
                backupInput.value = pasted.slice(0, <%= otpLength %>);
                backupInput.dispatchEvent(new InputEvent('input', { bubbles: true }));
            }

            function handleInput() {
                var sanitized = backupInput.value.replace(/\s/g, '');
                if (sanitized !== backupInput.value) backupInput.value = sanitized;
                backupCodeField.value = sanitized;
                updateBackupDigitBoxes(sanitized);
                updateBackupCursor(sanitized);
                submitBtn.disabled = sanitized.length !== <%= otpLength %>;
            }

            if (backupInput) {
                document.addEventListener('selectionchange', function () {
                    if (document.activeElement === backupInput) {
                        backupInput.selectionStart = backupInput.selectionEnd = backupInput.value.length;
                    }
                });
                backupInput.addEventListener('copy', function (e) { e.preventDefault(); });
                backupInput.addEventListener('cut', function (e) { e.preventDefault(); });
                backupInput.addEventListener('focus', function () { updateBackupCursor(this.value); });
                backupInput.addEventListener('blur', function () { updateBackupCursor('x'.repeat(<%= otpLength %>)); });
                backupInput.addEventListener('paste', handlePaste);
                backupInput.addEventListener('input', handleInput);
                updateBackupCursor(backupInput.value);
            }

            submitBtn.disabled = true;
        </script>
    </body>
</html>
