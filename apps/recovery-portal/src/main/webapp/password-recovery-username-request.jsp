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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.isEmailUsernameEnabled" %>
<%@ page import="java.io.File" %>

<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));

    String tenantDomain = request.getParameter("tenantDomain");
    boolean isSaaSApp = Boolean.parseBoolean(request.getParameter("isSaaSApp"));

    String emailUsernameEnable = application.getInitParameter("EnableEmailUserName");
    Boolean isEmailUsernameEnabled = false;

    if (StringUtils.isNotBlank(emailUsernameEnable)) {
        isEmailUsernameEnabled = Boolean.valueOf(emailUsernameEnable);
    } else {
        isEmailUsernameEnabled = isEmailUsernameEnabled();
    }
%>

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
        <!--[if lt IE 9]>
        <script src="js/html5shiv.min.js"></script>
        <script src="js/respond.min.js"></script>
        <![endif]-->
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
                    <!-- page content -->
                    <div class="segment-form">
                        <form class="ui large form" action="recoverpassword.do" method="post" id="tenantBasedRecovery">
                            <h2>
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Start.password.recovery")%>
                            </h2>
                            <div class="ui negative message"
                                id="error-msg" hidden="hidden">
                            </div>
                            <% if (error) { %>
                            <div class="ui negative message"
                                id="server-error-msg">
                                <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                            </div>
                            <% } %>
                            <p>
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.your.username.here")%>
                            </p>
                            <div class="field">
                                <label>
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Username")%>
                                </label>
                                <input id="usernameUserInput" name="usernameUserInput" type="text" tabindex="0" required>
                                <input id="username" name="username" type="hidden" required/>
                            </div> 
                            <div class="ui message info">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                    "If.you.do.not.specify.tenant.domain.consider.as.super.tenant")%>
                            </div>
                            <%
                                String callback = Encode.forHtmlAttribute
                                        (request.getParameter("callback"));
                                if (callback != null) {
                            %>
                            <div>
                                <input type="hidden" name="callback" value="<%=callback %>"/>
                            </div>
                            <%
                                }
                            %>
                            <div class="ui divider hidden"></div>
                            <div class="align-right buttons">
                                <a href="javascript:goBack()" class="ui button link-button">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                                </a>
                                <button id="registrationSubmit" class="ui primary button" type="submit">
                                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                                            "Proceed.password.recovery")%>
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

                            var isSaaSApp = JSON.parse("<%= isSaaSApp %>");
                            var tenantDomain = "<%= tenantDomain %>";
                            var isEmailUsernameEnabled = JSON.parse("<%= isEmailUsernameEnabled %>");

                            var userName = document.getElementById("username");
                            var usernameUserInput = document.getElementById("usernameUserInput");
                            var usernameUserInputValue = usernameUserInput.value.trim();

                            if ((tenantDomain !== "null") && !isSaaSApp) {
                                if (!isEmailUsernameEnabled && (usernameUserInputValue.split("@").length >= 2)) {
                                    var errorMessage = document.getElementById("error-msg");

                                    errorMessage.innerHTML = 
                                        "Invalid Username. Username shouldn't have '@' or any other special characters.";
                                    errorMessage.hidden = false;

                                    return;
                                }

                                if (isEmailUsernameEnabled && (usernameUserInputValue.split("@").length <= 1)) {
                                    var errorMessage = document.getElementById("error-msg");

                                    errorMessage.innerHTML = "Invalid Username. Username has to be an email address.";
                                    errorMessage.hidden = false;

                                    return;
                                }
                                
                                userName.value = usernameUserInputValue + "@" + tenantDomain;      
                            } else {
                                userName.value = usernameUserInputValue;
                            }

                            // Mark it so that the next submit can be ignored.
                            $form.data("submitted", true);
                            document.getElementById("tenantBasedRecovery").submit();
                        }
                    });

                    return this;
                };

                $('#tenantBasedRecovery').preventDoubleSubmission();
            });
        </script>

    </body>
</html>
