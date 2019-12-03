<%--
  ~ Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementServiceUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApiException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.api.ReCaptchaApi" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.ReCaptchaProperties" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.User" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.*" %>
<jsp:directive.include file="includes/localize.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));
    String username = request.getParameter("username");
    String tenantDomain = null;

    if (StringUtils.isNotEmpty(username)) {
        User user = IdentityManagementServiceUtil.getInstance().getUser(username);
        tenantDomain = user.getTenantDomain();
    }
    ReCaptchaApi reCaptchaApi = new ReCaptchaApi();
    try {
        ReCaptchaProperties reCaptchaProperties = reCaptchaApi.getReCaptcha(tenantDomain, true, "ReCaptcha",
                "password-recovery");

        if (reCaptchaProperties.getReCaptchaEnabled()) {
            Map<String, List<String>> headers = new HashMap<>();
            headers.put("reCaptcha", Arrays.asList(String.valueOf(true)));
            headers.put("reCaptchaAPI", Arrays.asList(reCaptchaProperties.getReCaptchaAPI()));
            headers.put("reCaptchaKey", Arrays.asList(reCaptchaProperties.getReCaptchaKey()));
            IdentityManagementEndpointUtil.addReCaptchaHeaders(request, headers);
        }
    } catch (ApiException e) {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", e.getMessage());
        request.getRequestDispatcher("error.jsp").forward(request, response);
        return;
    }

    boolean isEmailNotificationEnabled = false;

    isEmailNotificationEnabled = Boolean.parseBoolean(application.getInitParameter(
            IdentityManagementEndpointConstants.ConfigConstants.ENABLE_EMAIL_NOTIFICATION));
%>
<%
    boolean reCaptchaEnabled = true;
    if (request.getAttribute("reCaptcha") != null &&
            "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
%>

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

    <%
        if (reCaptchaEnabled) {
    %>
    <script src='<%=(request.getAttribute("reCaptchaAPI"))%>'></script>
    <%
        }
    %>
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
                <h2>
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.password")%>
                </h2>
                <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>
                <p>
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Enter.detail.to.recover.pwd")%>
                </p>
                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" method="post" action="verify.do" id="recoverDetailsForm">
                        <%
                            if (StringUtils.isNotEmpty(username) && !error) {
                        %>
                        <div class="field">
                            <input type="hidden" name="username" value="<%=Encode.forHtmlAttribute(username)%>"/>
                        </div>
                        <%
                        } else {
                        %>

                        <div class="field">
                            <input id="username" name="username" type="text" tabindex="0"
                                   placeholder=
                                       <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Username")%> required>
                        </div>

                        <%
                            }
                        %>
                        <%
                            if (isEmailNotificationEnabled) {
                        %>
                        <div class="ui secondary segment" style="text-align: left;">
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="EMAIL" checked/>
                                    <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.with.mail")%>
                                    </label>
                                </div>
                            </div>
                            <div class="field">
                                <div class="ui radio checkbox">
                                    <input type="radio" name="recoveryOption" value="SECURITY_QUESTIONS"/>
                                    <label><%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Recover.with.question")%>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <%
                        } else {
                        %>
                        <div class="field">
                            <input type="hidden" name="recoveryOption" value="SECURITY_QUESTIONS"/>
                        </div>
                        <%
                            }
                        %>

                        <%
                            String callback = request.getParameter("callback");
                            if (callback != null) {
                        %>
                        <div>
                            <input type="hidden" name="callback" value="<%=Encode.forHtmlAttribute(callback) %>"/>
                        </div>
                        <%
                            }
                        %>

                        <%
                            if (reCaptchaEnabled) {
                        %>
                        <div class="field">
                            <div class="g-recaptcha"
                                 data-sitekey=
                                         "<%=Encode.forHtmlContent((String)request.getAttribute("reCaptchaKey"))%>">
                            </div>
                        </div>
                        <%
                            }
                        %>
                        <div class="ui divider hidden"></div>
                        <div class="align-right buttons">
                            <button type="button" id="recoveryCancel"
                                    class="ui button"
                                    onclick="location.href='<%=Encode.forJavaScript(IdentityManagementEndpointUtil.getURLEncodedCallback(callback))%>';">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Cancel")%>
                            </button>
                            <button id="recoverySubmit"
                                    class="ui primary button"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Submit")%>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
    <!-- /content/body -->
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

    <script type="text/javascript">

        $(document).ready(function () {

            $("#recoverDetailsForm").submit(function (e) {
                var errorMessage = $("#error-msg");
                errorMessage.hide();

                var firstName = $("#username").val();
                if (firstName == '') {
                    errorMessage.text("Please fill the first name.");
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, 'slow');
                    return false;
                }

                <%
                if (reCaptchaEnabled) {
                %>
                var reCaptchaResponse = $("[name='g-recaptcha-response']")[0].value;
                if (reCaptchaResponse.trim() == '') {
                    errorMessage.text("Please select reCaptcha.");
                    errorMessage.show();
                    $("html, body").animate({scrollTop: errorMessage.offset().top}, 'slow');
                    return false;
                }
                <%
                }
                %>

                return true;
            });
        });

    </script>
</body>
</html>
