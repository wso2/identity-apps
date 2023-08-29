<%--
  ~ Copyright (c) 2018-2023, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AdaptiveAuthUtil" %>
<%@ page import="java.io.File" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>

<%-- Localization --%>
<%@ include file="includes/localize.jsp" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%
    String sessionDataKey = request.getParameter("sessionDataKey");
%>

<%-- Data for the layout from the page --%>
<%
    layoutData.put("containerSize", "medium");
%>

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

    <link href="css/longwait-loader.css" rel="stylesheet">
</head>
<body class="login-portal layout authentication-portal-layout">
    <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
        <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
            String productTitleFilePath = "extensions/product-title.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productTitleFilePath = customLayoutFileRelativeBasePath + "/product-title.jsp";
            }
            if (!new File(getServletContext().getRealPath(productTitleFilePath)).exists()) {
                productTitleFilePath = "includes/product-title.jsp";
            }
            %>
            <jsp:include page="<%= productTitleFilePath %>" />
        </layout:component>
        <layout:component componentName="MainSection" >
            <div id="loader-wrapper">
                <div id="loader"></div>
                <form id="toCommonAuth" action="<%=commonauthURL%>" method="POST" style="display:none;">
                    <input id="sessionDataKey" type="hidden" name="sessionDataKey" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>">
                </form>
            </div>
        </layout:component>
        <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
            String productFooterFilePath = "extensions/product-footer.jsp";
            if (StringUtils.isNotBlank(customLayoutFileRelativeBasePath)) {
                productFooterFilePath = customLayoutFileRelativeBasePath + "/product-footer.jsp";
            }
            if (!new File(getServletContext().getRealPath(productFooterFilePath)).exists()) {
                productFooterFilePath = "includes/product-footer.jsp";
            }
            %>
            <jsp:include page="<%= productFooterFilePath %>" />
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

    <script type="text/javascript">

        var sessionDataKey = '<%=Encode.forJavaScriptBlock(sessionDataKey)%>';
        var refreshInterval = '<%=AdaptiveAuthUtil.getRefreshInterval()%>';
        var timeout = '<%=AdaptiveAuthUtil.getRequestTimeout()%>';

        $(document).ready(function () {
            var intervalListener = window.setInterval(function () {
                checkLongWaitStatus();
            }, refreshInterval);

            var timeoutListenerListener = window.setTimeout(function () {
                window.clearInterval(intervalListener);
                window.location.replace("retry.do");
            }, timeout);

            function checkLongWaitStatus() {
                $.ajax({
                	type: "GET",
                    url: "<%=longwaitstatusURL%>",
                    async: false,
                    data: {waitingId: sessionDataKey},
                    success: function (res) {
                        handleStatusResponse(res);
                    },
                    error: function (res) {
                        window.clearInterval(intervalListener);
                        window.location.replace("retry.do");
                    },
                    failure: function (res) {
                        window.clearInterval(intervalListener);
                        window.location.replace("retry.do");
                    }
                });
            }

            function handleStatusResponse(res) {
                if (res.status === 'COMPLETED') {
                    continueAuthentication();
                }
            }

            function continueAuthentication() {
                //Redirect to common auth
                window.clearInterval(intervalListener);
                document.getElementById("toCommonAuth").submit();
            }
        });

    </script>

</body>
</html>
