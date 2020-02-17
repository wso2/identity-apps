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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.io.File" %>
<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
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
                    <h2></h2>
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
                                <input id="username" name="username" type="text" required/>
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
                                <a href="<%=Encode.forHtmlAttribute(IdentityManagementEndpointUtil.getUserPortalUrl(
                                            application.getInitParameter(IdentityManagementEndpointConstants.ConfigConstants.USER_PORTAL_URL)))%>"
                                    class="ui button link-button">
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
    </body>
</html>
