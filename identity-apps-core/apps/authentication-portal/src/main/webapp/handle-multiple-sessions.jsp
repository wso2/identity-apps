<%--
  ~ Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
  ~
  ~ WSO2 LLC. licenses this file to you under the Apache License,
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
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="java.net.URLEncoder" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@include file="includes/localize.jsp" %>
<jsp:directive.include file="includes/init-url.jsp"/>
<jsp:directive.include file="includes/template-mapper.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%@ taglib prefix="e" uri="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<%
    String promptId = request.getParameter("promptId");
    String authAPIURL = application.getInitParameter(Constants.AUTHENTICATION_REST_ENDPOINT_URL);

    if (StringUtils.isBlank(authAPIURL)) {
        authAPIURL = IdentityManagementEndpointUtil.getBasePath(tenantDomain, "/api/identity/auth/v1.1/", true);
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

<% request.setAttribute("pageName", "handle-multiple-sessions"); %>

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
<body class="login-portal layout authentication-portal-layout" data-page="<%= request.getAttribute("pageName") %>">
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
                <div class="segment-form">
                    <c:set var="data" value="<%=data%>" scope="request"/>
                    <c:set var="promptId" value="<%=URLEncoder.encode(promptId, StandardCharsets.UTF_8.name())%>"
                            scope="request"/>

                    <h3 class="ui header">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "multiple.active.sessions.found")%>
                    </h3>

                    <form class="segment-form" name="sessionsForm" action="<%=commonauthURL%>" method="POST"
                            onsubmit="return validateForm(this.submitted)">

                        <h5>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.have.reached.maximum.active.sessions.1")%> <fmt:formatNumber><e:forHtmlContent value='${requestScope.data["MaxSessionCount"]}'/></fmt:formatNumber>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.have.reached.maximum.active.sessions.2")%>.
                        </h5>
                        <h5>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "terminate.unwanted.sessions.message.1")%>.
                        </h5>

                        <a class="session-refresh" href='javascript:;' onclick="setRefreshActionAndSubmitForm()">
                            <i aria-hidden="true" class="refresh icon"></i> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "refresh.sessions")%>
                        </a>
                        <table id="session-details" class="ui celled table active-sessions-table">
                            <thead>
                                <tr>
                                    <th class='th-session-checkbox'>
                                        <div class="ui checkbox">
                                            <input type="checkbox" onchange="toggleSessionCheckboxes()" id="masterCheckbox" class="checkbox-session">
                                            <label></label>
                                        </div>
                                    </th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "browser")%></th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "platform")%></th>
                                    <th><%=AuthenticationEndpointUtil.i18n(resourceBundle, "last.accessed")%></th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>

                        <input type="hidden" name="promptResp" value="true">
                        <input type="hidden" name="promptId" value="<e:forHtmlAttribute value="${requestScope.promptId}"/>">

                        <div class="buttons align-right button-group-sessions">
                            <input name="denyLimitActiveSessionsAction" id="denyLimitActiveSessionsAction" type="submit"
                                    onclick="this.form.submitted='denyLimitActiveSessionsAction';"
                                    class="ui medium button secondary"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>">

                            <input name="terminateActiveSessionsAction" id="terminateActiveSessionsAction" type="submit"
                                    onclick="this.form.submitted='terminateActiveSessionsAction';"
                                    class="ui medium button primary disabled"
                                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "terminate")%>">

                            <input id="ActiveSessionsLimitAction" type="hidden" name="ActiveSessionsLimitAction"/>
                        </div>
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
        $(document).ready(function() {
            <c:forEach items='${requestScope.data["sessions"]}' var="session" varStatus="loop">
                var accessedTime = getDateFromTimestamp(<e:forJavaScript value="${session[1]}"/>);
                var tableRow =
                    "<tr>"
                    + "<td class='td-session-checkbox'>"
                        + "<div class='ui checkbox'>"
                            + "<input type='checkbox' class='checkbox-session' onchange='handleToggleSessionCheckbox()' value='<e:forHtmlAttribute value="${session[0]}"/>' name='sessionsToTerminate' />"
                            + "<label class='session-checkbox-label' style='padding-left: 0px;'></label>"
                        + "</div>"
                    + "</td>"
                    + "<td><e:forHtmlContent value="${session[2]}"/></td>"
                    + "<td><e:forHtmlContent value="${session[3]}"/></td>"
                    + "<td id='<e:forHtmlAttribute value="${session[1]}"/>'>" + accessedTime + "</td>"
                    + "</tr>";

                $("#session-details tbody").append(tableRow);
            </c:forEach>
        });

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
            return date.toLocaleDateString(undefined, options);
        }

        function handleToggleSessionCheckbox() {

            toggleMasterCheckbox();
            handleTerminateButtonActivation();
        }

        function handleTerminateButtonActivation() {

            var checkboxes = document.sessionsForm.sessionsToTerminate;
            var existsCheckedSession = false;
            if (checkboxes instanceof RadioNodeList) {
                for (i = 0; i < checkboxes.length; i++) {
                    existsCheckedSession = checkboxes[i].checked
                    if (existsCheckedSession) {
                        break;
                    }
                }
            } else {
                existsCheckedSession = checkboxes.checked
            }

            if (existsCheckedSession) {
                document.getElementById("terminateActiveSessionsAction").classList.remove("disabled");
            } else {
                document.getElementById("terminateActiveSessionsAction").classList.add("disabled");
            }
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
            handleTerminateButtonActivation();
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

        function setRefreshActionAndSubmitForm() {

            document.sessionsForm.submitted = "refreshActiveSessionsAction";
            if (validateForm("refreshActiveSessionsAction")) {
                document.sessionsForm.submit();
            }
        }
    </script>
</body>
</html>
