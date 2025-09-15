<%--
  ~ Copyright (c) 2016-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.serviceclient.UserIdentityManagementAdminServiceClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.stub.dto.ChallengeQuestionDTO" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp"/>

<%-- Include tenant context --%>
<jsp:directive.include file="tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    boolean error = IdentityManagementEndpointUtil.getBooleanValue(request.getAttribute("error"));
    String errorMsg = IdentityManagementEndpointUtil.getStringValue(request.getAttribute("errorMsg"));

    Map<String, List<ChallengeQuestionDTO>> challengeQuestionSets = new HashMap<String, List<ChallengeQuestionDTO>>();
    String username = (String) session.getAttribute("username");

    if (!StringUtils.isBlank(username)) {
        UserIdentityManagementAdminServiceClient userIdentityManagementAdminServiceClient = new
                UserIdentityManagementAdminServiceClient();
        ChallengeQuestionDTO[] challengeQuestionDTOs =
                userIdentityManagementAdminServiceClient.getAllChallengeQuestions();

        for (ChallengeQuestionDTO challengeQuestionDTO : challengeQuestionDTOs) {
            String questionSetId = challengeQuestionDTO.getQuestionSetId();
            if (!challengeQuestionSets.containsKey(questionSetId)) {
                List<ChallengeQuestionDTO> questionDTOList = new ArrayList<ChallengeQuestionDTO>();
                challengeQuestionSets.put(questionSetId, questionDTOList);
            }
            challengeQuestionSets.get(questionSetId).add(challengeQuestionDTO);
        }

        session.setAttribute("challengeQuestionSet", challengeQuestionSets.keySet());
    } else {
        request.setAttribute("error", true);
        request.setAttribute("errorMsg", IdentityManagementEndpointUtil.i18n(recoveryResourceBundle,
                "Registered.user.not.found.in.session"));
        request.setAttribute("username", username);
        request.getRequestDispatcher("error.jsp").forward(request, response);
    }
%>

<% request.setAttribute("pageName", "challenge-question-add"); %>

<!doctype html>
<html lang="en-US">
<head>
    <%
        File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
        if (headerFile.exists()) {
    %>
            <jsp:include page="extensions/header.jsp"/>
    <% } else { %>
            <jsp:include page="includes/header.jsp"/>
    <% } %>
</head>
<body class="login-portal layout recovery-layout" data-page="<%= request.getAttribute("pageName") %>">
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
        <layout:component componentName="MainSection" >
            <div class="ui segment">
                <%-- page content --%>
                <h3 class="ui header m-0" data-testid="add-security-question-page-header">
                    <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Update.security.question")%>
                </h3>
                <% if (error) { %>
                <div class="ui visible negative message" id="server-error-msg">
                    <%=IdentityManagementEndpointUtil.i18nBase64(recoveryResourceBundle, errorMsg)%>
                </div>
                <% } %>
                <div class="ui negative message" id="error-msg" hidden="hidden"></div>

                <div class="ui divider hidden"></div>
                <div class="segment-form">
                    <form class="ui large form" method="post" action="completeregistration.do"
                            id="securityQuestionForm">
                        <% for (Map.Entry<String, List<ChallengeQuestionDTO>> entry : challengeQuestionSets
                                .entrySet()) {
                        %>
                        <div class="field">
                            <select
                                class="ui fluid dropdown"
                                name="<%="Q-" + Encode.forHtmlAttribute(entry.getKey())%>"
                                required
                            >
                                <%
                                    for (ChallengeQuestionDTO challengeQuestionDTO : entry.getValue()) {
                                %>
                                <option value="<%=Encode.forHtmlAttribute(challengeQuestionDTO.getQuestion())%>">
                                    <%=Encode.forHtml(challengeQuestionDTO.getQuestion())%>
                                </option>
                                <%  } %>
                            </select>
                        </div>
                        <div class="field">
                            <div class="ui fluid input">
                                <input
                                    name="<%="A-" + Encode.forHtmlAttribute(entry.getKey())%>"
                                    type="text"
                                    tabindex="0"
                                    placeholder="<%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Your.answer")%>"
                                    required
                                >
                            </div>
                        </div>
                        <div class="ui divider hidden"></div>
                        <%
                            }
                        %>
                        <div class="mt-4">
                            <button id="securityQuestionSubmit"
                                    class="ui primary button large fluid"
                                    type="submit">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Update")%>
                            </button>
                        </div>
                        <div class="mt-1 align-center">
                            <button id="securityQuestionSkip"
                                    class="ui secondary button large fluid"
                                    onclick="location.href='../accountrecoveryendpoint/completeregistration.do?skip=true';">
                                <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "Skip")%>
                            </button>
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
        $('select.dropdown').dropdown();
    </script>
</body>
</html>
