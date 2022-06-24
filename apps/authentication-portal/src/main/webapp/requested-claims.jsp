<%--
  ~ Copyright (c) 2014, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
  ~ KIND, either express or implied.  See the License for the
  ~ specific language governing permissions and limitations
  ~ under the License.
  --%>

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>
<jsp:directive.include file="includes/layout-resolver.jsp"/>

<%
    String[] missingClaimList = null;
    String appName = null;
    Boolean isFederated = false;
    if (request.getParameter(Constants.MISSING_CLAIMS) != null) {
        missingClaimList = request.getParameter(Constants.MISSING_CLAIMS).split(",");
    }
    if (request.getParameter(Constants.REQUEST_PARAM_SP) != null) {
        appName = request.getParameter(Constants.REQUEST_PARAM_SP);
    }
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
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
        <jsp:include page="includes/header.jsp"/>
    <% } %>

    <script src="libs/addons/calendar.min.js"></script>
    <link rel="stylesheet" href="libs/addons/calendar.min.css"/>
</head>

<body class="login-portal layout authentication-portal-layout">

    <% if (new File(getServletContext().getRealPath("extensions/timeout.jsp")).exists()) { %>
        <jsp:include page="extensions/timeout.jsp"/>
    <% } else { %>
        <jsp:include page="util/timeout.jsp"/>
    <% } %>

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
                <h3 class="ui header" data-testid="request-claims-page-mandatory-header-text">
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "provide.mandatory.details")%>
                </h3>

                <% if (request.getParameter("errorMessage") != null) { %>
                    <div class="ui visible negative message" id="error-msg"
                         data-testid="request-claims-page-error-message">
                        <%= AuthenticationEndpointUtil.i18n(resourceBundle, request.getParameter("errorMessage")) %>
                    </div>
                <% }%>

                <form class="ui large form" action="<%=commonauthURL%>" method="post" id="claimForm">
                    <div class="ui divider hidden"></div>
                    <p data-testid="request-claims-page-recommendation">
                        <strong data-testid="request-claims-page-application-name">
                            <%=Encode.forHtmlContent(appName)%>
                        </strong>
                         <%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.claims.recommendation")%>
                    </p>

                    <div class="segment-form">
                        <div>
                            <h3 data-testid="request-claims-page-requested-attributes-header-text">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.attributes")%> :
                            </h3>
                            <% for (String claim : missingClaimList) {
                                String claimDisplayName = claim;
                                claimDisplayName = claimDisplayName.replaceAll(".*/", "");
                                claimDisplayName = claimDisplayName.substring(0, 1).toUpperCase() + claimDisplayName.substring(1);
                                if (claim.contains("claims/dob")) {
                                    claimDisplayName = "Date of Birth (YYYY-MM-DD)";
                                }
                            %>
                                <label for="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                       data-testid="request-claims-page-form-field-<%=Encode.forHtmlAttribute(claim)%>-label">
                                <%  if (StringUtils.isNotBlank(claimDisplayName)) { %>
                                    <%=Encode.forHtmlAttribute(claimDisplayName)%>
                                <% } else { %>
                                    <%=Encode.forHtmlAttribute(claim)%>
                                <% } %>
                                </label>
                                <% if (claim.contains("claims/dob")) { %>
                                    <div class="field">
                                        <div class="ui calendar" id="date_picker">
                                            <div class="ui input left icon" style="width: 100%;">
                                                <i class="calendar icon"></i>
                                                <input type="text"
                                                       autocomplete="off"
                                                       data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                                       id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                       name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                                       placeholder="Enter <%=Encode.forHtmlContent(claimDisplayName)%>"
                                                       required="required">
                                            </div>
                                        </div>
                                    </div>
                                <% } else if (claim.contains("claims/country")) {  %>
                                    <div class="field">
                                        <jsp:include page="includes/country-dropdown.jsp">
                                            <jsp:param name="required" value="required"/>
                                            <jsp:param name="claim" value="<%=Encode.forHtmlAttribute(claim)%>"/>
                                        </jsp:include>
                                    </div>
                                <% } else { %>
                                    <div class="field">
                                        <input type="text"
                                               autocomplete="off"
                                               data-testid="request-claims-page-form-field-claim-<%=Encode.forHtmlAttribute(claim)%>-input"
                                               name="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                               id="claim_mand_<%=Encode.forHtmlAttribute(claim)%>"
                                               placeholder="Enter <%=Encode.forHtmlContent(claimDisplayName)%>"
                                               required="required"/>
                                    </div>
                                <% } %>
                            <% } %>
                            <input type="hidden"
                                   name="sessionDataKey"
                                   data-testid="request-claims-page-session-data-key"
                                   value='<%=Encode.forHtmlAttribute(request.getParameter("sessionDataKey"))%>'/>
                        </div>
                        <div class="align-right buttons">
                            <button class="ui primary large button"
                                    type="submit"
                                    data-testid="request-claims-page-continue-button">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "continue")%>
                            </button>
                        </div>
                    </div>
                </form>
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

    <script defer>
        /**
         * Event handler and trigger for #date_picker element.
         * This is a extension we've added to facilitate a ui
         * calendar for Semantic-UI. The extension files are
         * added manually to lib/ directory of authentication
         * portal. calendar.min.js and calendar.min.css.
         *
         * If you do want to change these settings in the future
         * refer [1] since this API is not officially merged to
         * Semantic-UI.
         *
         * [1] https://github.com/mdehoog/Semantic-UI-Calendar#settings
         */
        $("#date_picker").calendar({
            type: 'date',
            formatter: {
                date: function (date, settings) {
                    var EMPTY_STRING = "";
                    var DATE_SEPARATOR = "-";
                    var STRING_ZERO = "0";
                    if (!date) return EMPTY_STRING;
                    var day = date.getDate() + EMPTY_STRING;
                    if (day.length < 2) {
                        day = STRING_ZERO + day;
                    }
                    var month = (date.getMonth() + 1) + EMPTY_STRING;
                    if (month.length < 2) {
                        month = STRING_ZERO + month;
                    }
                    var year = date.getFullYear();
                    return year + DATE_SEPARATOR + month + DATE_SEPARATOR + day;
                }
            }
        });
    </script>

</body>
</html>
