<%--
  ~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~  WSO2 Inc. licenses this file to you under the Apache License,
  ~  Version 2.0 (the "License"); you may not use this file except
  ~  in compliance with the License.
  ~  You may obtain a copy of the License at
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
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.mgt.constants.SelfRegistrationStatusCodes" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>

<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));
    boolean skipSignUpEnableCheck = Boolean.parseBoolean(request.getParameter("skipsignupenablecheck"));
    String username = request.getParameter("username");
    String tenantDomain = request.getParameter("tenantDomain");
    User user = IdentityManagementServiceUtil.getInstance().getUser(username);
    Object errorCodeObj = request.getAttribute("errorCode");
    Object errorMsgObj = request.getAttribute("errorMsg");
    String callback = Encode.forHtmlAttribute(request.getParameter("callback"));
    String errorCode = null;
    String errorMsg = null;

    if (errorCodeObj != null) {
        errorCode = errorCodeObj.toString();
    }
    if (SelfRegistrationStatusCodes.ERROR_CODE_INVALID_TENANT.equalsIgnoreCase(errorCode)) {
        errorMsg = "Invalid tenant domain - " + user.getTenantDomain();
    } else if (SelfRegistrationStatusCodes.ERROR_CODE_USER_ALREADY_EXISTS.equalsIgnoreCase(errorCode)) {
        errorMsg = "Username '" + username + "' is already taken. Please pick a different username";
    } else if (SelfRegistrationStatusCodes.ERROR_CODE_SELF_REGISTRATION_DISABLED.equalsIgnoreCase(errorCode)) {
        errorMsg = "Self registration is disabled for tenant - " + user.getTenantDomain();
    } else if (SelfRegistrationStatusCodes.CODE_USER_NAME_INVALID.equalsIgnoreCase(errorCode)) {
        errorMsg = user.getUsername() + " is an invalid user name. Please pick a valid username.";
    } else if (errorMsgObj != null) {
        errorMsg = errorMsgObj.toString();
    }

    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled = false;

    if (StringUtils.isNotBlank(emailUsernameEnable)) {
        isEmailUsernameEnabled = Boolean.valueOf(emailUsernameEnable);
    } else {
        isEmailUsernameEnabled = isEmailUsernameEnabled();
    }
%>

<!doctype html>
<html>
<head>
    <!-- header -->
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
    <main class="center-segment">
        <div class="ui container medium center aligned middle aligned">
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
            <jsp:directive.include file="includes/product-title.jsp"/>
            <% } %>
            <div class="ui segment">
                <h3 class="ui header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Start.signing.up")%>
                </h3>

                <div class="ui negative message" id="error-msg" hidden="hidden"></div>
                <% if (error) { %>
                <div class="ui negative message" id="server-error-msg">
                    <%= IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg) %>
                </div>
                <% } %>
                <!-- validation -->

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" action="signup.do" method="post" id="register">

                        <div class="field">
                            <label for="username">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "Enter.your.username.here")%>
                            </label>
                            <input id="usernameUserInput" name="usernameUserInput" type="text" required>
                            <input id="username" name="username" type="hidden"
                                <% if(skipSignUpEnableCheck) {%> value="<%=Encode.forHtmlAttribute(username)%>" <%}%>>
                        </div>
                        
                        <% if (isSaaSApp) { %>
                        <p class="ui tiny compact info message">
                            <i class="icon info circle"></i>
                            <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "If.you.specify.tenant.domain.you.registered.under.super.tenant")%>
                        </p>
                        <% } %>

                        <input id="callback" name="callback" type="hidden" value="<%=callback%>"
                               class="form-control" required>

                        <% Map<String, String[]> requestMap = request.getParameterMap();
                            for (Map.Entry<String, String[]> entry : requestMap.entrySet()) {
                                String key = Encode.forHtmlAttribute(entry.getKey());
                                String value = Encode.forHtmlAttribute(entry.getValue()[0]); %>
                        <div class="field">
                            <input id="<%= key%>" name="<%= key%>" type="hidden"
                                   value="<%=value%>" class="form-control">
                        </div>
                        <% } %>

                        <div class="ui divider hidden"></div>

                        <div class="align-right buttons">
                            <a href="javascript:goBack()" class="ui button link-button">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </a>
                            <button id="registrationSubmit" class="ui primary button" type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                        "Proceed.to.self.register")%>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <!-- product-footer -->
    <%
        File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
        if (productFooterFile.exists()) {
    %>
    <jsp:include page="extensions/product-footer.jsp"/>
    <% } else { %>
    <jsp:directive.include file="includes/product-footer.jsp"/>
    <% } %>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:directive.include file="includes/footer.jsp"/>
    <% } %>

    <script>
        function goBack() {
            window.history.back();
        }

        // Handle form submission preventing double submission.
        $(document).ready(function(){
            $.fn.preventDoubleSubmission = function() {
                $(this).on("submit", function(e){
                    var $form = $(this);

                    if ($form.data("submitted") === true) {
                        // Previously submitted - don't submit again.
                        e.preventDefault();
                        console.warn("Prevented a possible double submit event");
                    } else {
                        e.preventDefault();
                        
                        var isEmailUsernameEnabled = JSON.parse("<%= isEmailUsernameEnabled %>");
                        var isSaaSApp = JSON.parse("<%= isSaaSApp %>");
                        var tenantName = "<%= tenantDomain %>";

                        var userName = document.getElementById("username");
                        var usernameUserInput = document.getElementById("usernameUserInput");

                        if (usernameUserInput) {
                            var usernameUserInputValue = usernameUserInput.value.trim();

                            if (tenantName !== "null") {

                                if (isEmailUsernameEnabled) {

                                    if (usernameUserInputValue.split("@").length <= 1) {
                                        var errorMessage = document.getElementById("error-msg");

                                        errorMessage.innerHTML = "Invalid Username. Username has to be an email address.";
                                        errorMessage.style.display = "block";

                                        return;
                                    }

                                    if (usernameUserInputValue.split("@").length === 2) {
                                        userName.value = usernameUserInputValue + "@" + tenantName;
                                    }
                                    else {
                                        userName.value = usernameUserInputValue;
                                    }
                                } else {
                                    if (usernameUserInputValue.split("@").length > 1) {
                                        userName.value = usernameUserInputValue;
                                    } else {
                                        userName.value = usernameUserInputValue + "@" + tenantName;
                                    }

                                }
                                
                            } else {
                                userName.value = usernameUserInputValue;
                            }
                        }

                        // Mark it so that the next submit can be ignored.
                        $form.data("submitted", true);
                        document.getElementById("register").submit();
                    }
                });

                return this;
            };

            $('#register').preventDoubleSubmission();
        });
    </script>

</body>
</html>
