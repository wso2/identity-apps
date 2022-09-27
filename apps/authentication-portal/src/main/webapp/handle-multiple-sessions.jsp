<%--
  ~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
  ~ KIND, either express or implied. See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthContextAPIClient" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="org.wso2.carbon.identity.core.util.IdentityUtil" %>
<%@ page import="java.net.URLEncoder" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>
<jsp:directive.include file="includes/template-mapper.jsp"/>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%@ taglib prefix="e" uri="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%
    String promptId = request.getParameter("promptId");
    String authAPIURL = application.getInitParameter(Constants.AUTHENTICATION_REST_ENDPOINT_URL);

    if (StringUtils.isBlank(authAPIURL)) {
        authAPIURL = IdentityUtil.getServerURL("/api/identity/auth/v1.1/", true, true);
    } else {
        // Resolve tenant domain for the authentication API URl
        authAPIURL = AuthenticationEndpointUtil.resolveTenantDomain(authAPIURL);
    }
    if (!authAPIURL.endsWith("/")) {
        authAPIURL += "/";
    }
    authAPIURL += "context/" + request.getParameter("promptId");
    String contextProperties = AuthContextAPIClient.getContextProperties(authAPIURL);

    Gson gson = new Gson();
    Map data = gson.fromJson(contextProperties, Map.class);
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

<!doctype html>
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
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader" >
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
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <div class="segment-form">
                    <c:set var="data" value="<%=data%>" scope="request"/>
                    <c:set var="promptId" value="<%=URLEncoder.encode(promptId, StandardCharsets.UTF_8.name())%>"
                            scope="request"/>

                    <h3 class="ui header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "multiple.active.sessions.found")%>
                    </h3>

                    <form class="segment-form" name="sessionsForm" action="<%=commonauthURL%>" method="POST"
                            onsubmit="return validateForm(this.submitted)">

                        <h4>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.currently.have.x.active.sessions.1")%> <fmt:formatNumber><e:forHtmlContent value='${fn:length(requestScope.data["sessions"])}'/></fmt:formatNumber>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.currently.have.x.active.sessions.2")%>. <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.currently.have.x.active.sessions.3")%>
                            <fmt:formatNumber><e:forHtmlContent value='${requestScope.data["MaxSessionCount"]}'/></fmt:formatNumber> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.currently.have.x.active.sessions.2")%>.
                        </h4>

                        <table class="ui celled table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "browser")%></th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "platform")%></th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "last.accessed")%></th>
                                    <th><input type="checkbox" onchange="toggleSessionCheckboxes()" id="masterCheckbox" checked></th>
                                </tr>
                            </thead>
                            <tbody>
                                <c:forEach items='${requestScope.data["sessions"]}' var="session" varStatus="loop">
                                    <tr>
                                        <td><e:forHtmlContent value="${loop.index + 1}"/></td>
                                        <td><e:forHtmlContent value="${session[2]}"/></td>
                                        <td><e:forHtmlContent value="${session[3]}"/></td>
                                        <td id="<e:forHtmlAttribute value="${session[1]}"/>">
                                            <script>getDateFromTimestamp(<e:forJavaScript value="${session[1]}"/>);</script>
                                        </td>
                                        <td><input type="checkbox" onchange="toggleMasterCheckbox()"
                                                    value="<e:forHtmlAttribute value="${session[0]}"/>"
                                                    name="sessionsToTerminate" checked></td>
                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>

                        <h4>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "terminate.unwanted.sessions.message.1")%>.
                            <br>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "terminate.unwanted.sessions.message.2")%>.
                        </h4>

                        <input type="hidden" name="promptResp" value="true">
                        <input type="hidden" name="promptId" value="<e:forHtmlAttribute value="${requestScope.promptId}"/>">

                        <div class="align-right buttons">
                            <input name="terminateActiveSessionsAction" type="submit"
                                    onclick="this.form.submitted='terminateActiveSessionsAction';"
                                    class="ui large button"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "terminate.selected.active.sessions.and.proceed")%>">

                            <input name="denyLimitActiveSessionsAction" type="submit"
                                    onclick="this.form.submitted='denyLimitActiveSessionsAction';"
                                    class="ui large button"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "deny.login")%>">

                            <input name="refreshActiveSessionsAction" type="submit"
                                    onclick="this.form.submitted='refreshActiveSessionsAction';"
                                    class="ui large primary button"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "refresh.sessions")%>">

                            <input id="ActiveSessionsLimitAction" type="hidden" name="ActiveSessionsLimitAction"/>
                        </div>
                    </form>
                </div>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter" >
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
    </layout:main>

    <div class="ui modal mini" id="selected_sessions_validation" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel">
        <div class="header">
            <h4 class="modal-title"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "no.sessions.selected")%></h4>
        </div>
        <div class="content">
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.sessions.warning.msg.1")%>
            <span id="minimumSessionsElement" class="mandatory-msg"> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.sessions.warning.msg.2")%> </span>
            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "mandatory.sessions.warning.msg.3")%>.
        </div>
        <div class="actions">
            <button type="button" class="ui primary button"  onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>

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
        function hideModal(elem) {
            $(elem).closest('.modal').modal('hide');
        }

        function getDateFromTimestamp(timestamp) {
            var date = new Date(Number(timestamp));
            var options = {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            document.getElementById(timestamp).innerText = date.toLocaleDateString(undefined, options);
        }

        function toggleSessionCheckboxes() {
            var isMasterCheckboxChecked = document.getElementById("masterCheckbox").checked;
            var checkboxes = document.sessionsForm.sessionsToTerminate;

            if (checkboxes instanceof RadioNodeList) {
                for (i = 0; i < checkboxes.length; i++) {
                    checkboxes[i].checked = isMasterCheckboxChecked;
                }
            } else {
                checkboxes.checked = isMasterCheckboxChecked;
            }
        }

        function toggleMasterCheckbox() {
            var masterCheckbox = document.getElementById("masterCheckbox");
            var checkboxes = document.sessionsForm.sessionsToTerminate;

            if (checkboxes instanceof RadioNodeList) {
                for (var i = 0; i < checkboxes.length; i++) {
                    if (!checkboxes[i].checked) {
                        masterCheckbox.checked = false;
                        return;
                    }
                }
                masterCheckbox.checked = true;
            } else {
                masterCheckbox.checked = checkboxes.checked;
            }
        }

        function validateForm(submittedAction) {
            document.getElementById("ActiveSessionsLimitAction").setAttribute("value", submittedAction);

            if (submittedAction === "terminateActiveSessionsAction") {
                var checkboxes = document.sessionsForm.sessionsToTerminate;

                if (checkboxes instanceof RadioNodeList) {
                    for (var i = 0; i < checkboxes.length; i++) {
                        if (checkboxes[i].checked) {
                            return true;
                        }
                    }
                } else if (checkboxes.checked) {
                    return true;
                }

            } else if (submittedAction === "denyLimitActiveSessionsAction" || submittedAction === "refreshActiveSessionsAction") {
                return true;
            }

            $('#selected_sessions_validation').modal("show");

            return false;
        }
    </script>
</body>
</html>
