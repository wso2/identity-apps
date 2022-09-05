<%--
  ~ Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
  ~
  ~ WSO2 Inc. licenses this file to you under the Apache License,
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

<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EncodedControl" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.wso2.carbon.identity.recovery.ui.IdentityManagementAdminClient" %>
<%@ page import="org.wso2.carbon.identity.recovery.model.ChallengeQuestion" %>
<%@ page import="org.wso2.carbon.utils.ServerConstants" %>
<%@ page import="org.wso2.carbon.ui.CarbonUIUtil" %>
<%@ page import="org.wso2.carbon.CarbonConstants" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.util.ResourceBundle" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.io.File" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String BUNDLE = "org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources";
    ResourceBundle resourceBundle = ResourceBundle.getBundle(BUNDLE, request.getLocale(), new
            EncodedControl(StandardCharsets.UTF_8.toString()));
    String urlData = request.getParameter("data");
    // Extract the challenge questions from the request and add them into an array
    String[] questionSets = null;
    if (urlData != null) {
        questionSets = urlData.split("&");
    }
    // Hash-map to hold available challenge questions in the system
    Map<String, List<ChallengeQuestion>> challengeQuestionMap = new HashMap<>();

    for (String question : questionSets) {
        String[] questionProperties = question.split("\\|");
        // Construct a new ChallengeQuestion for each challenge question received from the request
        ChallengeQuestion tempChallengeQuestion = new ChallengeQuestion();
        // Extract the challenge question properties
        String questionSetId = questionProperties[0];
        String questionId = questionProperties[1];
        String questionBody = questionProperties[2];
        tempChallengeQuestion.setQuestionSetId(questionSetId);
        tempChallengeQuestion.setQuestionId(questionId);
        tempChallengeQuestion.setQuestion(questionBody);
        // Add the challenge question to the Hash-map
        List<ChallengeQuestion> challengeQuestionList = challengeQuestionMap.get(questionSetId);
        if (challengeQuestionList == null) {
            challengeQuestionList = new ArrayList<>();
            challengeQuestionList.add(tempChallengeQuestion);
            challengeQuestionMap.put(questionSetId, challengeQuestionList);
        } else {
            challengeQuestionList.add(tempChallengeQuestion);
        }
    }
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
                <h3><%=AuthenticationEndpointUtil.i18n(resourceBundle, "answer.following.questions")%></h3>

                <div class="ui divider hidden"></div>

                <form class="ui large form" action="../commonauth" method="post" id="profile" name="">
                    <div class="segment-form">
                        <%
                            for (String challengeQuestionSet : challengeQuestionMap.keySet()) {
                        %>
                        <legend><%=AuthenticationEndpointUtil.i18n(resourceBundle, "challenge.question.set")%></legend>
                        <div class="ui divider"></div>
                        <div class="field">
                            <label>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.challenge.question")%>
                            </label>
                            <div>
                                <select id="challengeQuestion1" class="ui fluid dropdown"
                                    name=<%="Q-" + Encode.forHtmlAttribute(challengeQuestionSet)%>>
                                    <%
                                        for (ChallengeQuestion challengeQuestion : challengeQuestionMap.get(challengeQuestionSet)) {
                                    %>
                                    <option name="q" selected="selected" value="<%=Encode.forHtmlAttribute(challengeQuestion.getQuestion())%>">
                                        <%=Encode.forHtmlContent(challengeQuestion.getQuestion())%>
                                    </option>
                                    <%
                                        }
                                    %>
                                </select>
                            </div>
                        </div>
                        <div class="field">
                            <label>
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "answers.challenge.question")%>
                            </label>
                            <div>
                                <input required type="text" class="form-control" id="answer_to_questions"
                                    placeholder="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "type.your.challenge.answer")%>"
                                    name=<%="A-" + Encode.forHtmlAttribute(challengeQuestionSet)%>>
                            </div>
                        </div>
                        <div class="ui divider hidden"></div>
                        <%
                            }
                        %>

                        <div class="align-right buttons">
                            <input type="submit" class="ui primary large button"
                                value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>">

                            <input type="hidden" name="<%="sessionDataKey"%>"
                                value="<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>"/>
                        </div>
                    </div>
                </form>
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
