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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.captcha.util.CaptchaUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.InitiateQuestionResponse" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.model.RetryError" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/localize.jsp"/>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    InitiateQuestionResponse initiateQuestionResponse = (InitiateQuestionResponse)
            session.getAttribute("initiateChallengeQuestionResponse");
    RetryError errorResponse = (RetryError) request.getAttribute("errorResponse");
    boolean reCaptchaEnabled = false;
    if (request.getAttribute("reCaptcha") != null && "TRUE".equalsIgnoreCase((String) request.getAttribute("reCaptcha"))) {
        reCaptchaEnabled = true;
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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
    <jsp:include page="includes/header.jsp"/>
    <% } %>

    <%
        if (reCaptchaEnabled) {
            String reCaptchaAPI = CaptchaUtil.reCaptchaAPIURL();
    %>
    <script src='<%=(reCaptchaAPI)%>'></script>
    <%
        }
    %>
</head>
<body class="login-portal layout recovery-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
            <!-- product-title -->
            <%
                File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
                if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-title.jsp"/>
            <% } %>
        </layout:component>
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <!-- page content -->
                <%
                    if (errorResponse != null) {
                %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorResponse.getDescription())%>
                </div>
                <div class="ui divider hidden"></div>

                <%
                    }
                %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" method="post" action="processsecurityquestions.do"
                          id="securityQuestionForm">
                        <div class="field">
                            <label class="control-label"><%=initiateQuestionResponse.getQuestion().getQuestion()%>
                            </label>
                        </div>
                        <div class="field">
                            <input id="securityQuestionAnswer" name="securityQuestionAnswer" type="password"
                                   class="form-control"
                                   tabindex="0" autocomplete="off" required/>
                        </div>
                        <div class="field">
                            <input type="hidden" name="step"
                                   value="<%=Encode.forHtmlAttribute(request.getParameter("step"))%>"/>
                        </div>
                        <div class="ui divider hidden"></div>
                        <%
                            if (reCaptchaEnabled) {
                                String reCaptchaKey = CaptchaUtil.reCaptchaSiteKey();
                        %>
                        <div class="field">
                            <div class="g-recaptcha"
                                    data-size="invisible"
                                    data-callback="onCompleted"
                                    data-action="usernameRecovery"
                                    data-sitekey=
                                            "<%=Encode.forHtmlContent(reCaptchaKey)%>">
                            </div>
                        </div>
                        <%
                            }
                        %>
                        <div class="align-right buttons">
                            <button id="answerSubmit"
                                    class="ui primary button"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Submit")%>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
            <!-- product-footer -->
            <%
                File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
                if (productFooterFile.exists()) {
            %>
            <jsp:include page="extensions/product-footer.jsp"/>
            <% } else { %>
            <jsp:include page="includes/product-footer.jsp"/>
            <% } %>
        </layout:component>
    </layout:main>

    <!-- footer -->
    <%
        File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
        if (footerFile.exists()) {
    %>
    <jsp:include page="extensions/footer.jsp"/>
    <% } else { %>
    <jsp:include page="includes/footer.jsp"/>
    <% } %>

    <script type="text/javascript">
        function onCompleted() {
            $('#securityQuestionForm').submit();
        }
        $(document).ready(function () {
            $("#securityQuestionForm").submit(function (e) {
               <%
                   if (reCaptchaEnabled) {
               %>
               if (!grecaptcha.getResponse()) {
                   e.preventDefault();
                   grecaptcha.execute();
                   return true;
               }
               <%
                   }
               %>
               return true;
            }
        });

    </script>
</body>
</html>
