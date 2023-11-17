<%--
   ~ Copyright (c) 2023, WSO2 Inc. (http://www.wso2.com).
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
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="layout" uri="org.wso2.identity.apps.taglibs.layout.controller" %>
<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>
<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>
<%
   String idp = request.getParameter("idp");
   String authenticator = request.getParameter("authenticator");
   String sessionDataKey = request.getParameter(Constants.SESSION_DATA_KEY);

   String errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
   String authenticationFailed = "false";

   // Log the actual error for localized error fallbacks
   boolean isErrorFallbackLocale = !userLocale.toLanguageTag().equals("en_US");

   if (Boolean.parseBoolean(request.getParameter(Constants.AUTH_FAILURE))) {
       authenticationFailed = "true";
       if (request.getParameter(Constants.AUTH_FAILURE_MSG) != null) {
           errorMessage = request.getParameter(Constants.AUTH_FAILURE_MSG);
           if (errorMessage.equalsIgnoreCase("authentication.fail.message")) {
               errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "error.retry");
           } else if (errorMessage.equalsIgnoreCase("Can't identify organization")) {
                errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle, "invalid.organization.discovery.input");
           } else if (isErrorFallbackLocale) {
               errorMessage = AuthenticationEndpointUtil.i18n(resourceBundle,"error.retry");
           }
       }
   }
%>
<%-- Data for the layout from the page --%>
<%
   layoutData.put("containerSize", "medium");
%>
<html lang="en-US">
   <head>
      <%-- header --%>
      <%
         File headerFile = new File(getServletContext().getRealPath("extensions/header.jsp"));
         if (headerFile.exists()) {
      %>
      <jsp:include page="extensions/header.jsp"/>
      <%
         } else {
      %>
      <jsp:include page="includes/header.jsp"/>
      <%
         }
      %>
   </head>
   <body class="login-portal layout authentication-portal-layout">
      <layout:main layoutName="<%= layout %>" layoutFileRelativePath="<%= layoutFileRelativePath %>" data="<%= layoutData %>" >
         <layout:component componentName="ProductHeader">
            <%-- product-title --%>
            <%
               File productTitleFile = new File(getServletContext().getRealPath("extensions/product-title.jsp"));
               if (productTitleFile.exists()) {
            %>
            <jsp:include page="extensions/product-title.jsp"/>
            <%
               } else {
            %>
            <jsp:include page="includes/product-title.jsp"/>
            <%
               }
            %>
         </layout:component>
         <layout:component componentName="MainSection">
            <div class="ui segment">
               <%-- page content --%>
               <h2><%=AuthenticationEndpointUtil.i18n(resourceBundle, "sign.in.with")%> <%= StringUtils.isNotBlank(idp) ? idp : AuthenticationEndpointUtil.i18n(resourceBundle, "organization.login") %></h2>
               <div class="ui divider hidden"></div>
               <%
                  if ("true".equals(authenticationFailed)) {
               %>
               <div class="ui negative message" id="failed-msg"><%=Encode.forHtmlContent(errorMessage)%></div>
               <div class="ui divider hidden"></div>
               <%
               }
               %>
               <div id="alertDiv"></div>
               <form class="ui large form" id="org_form" name="org_form" action="<%=commonauthURL%>" method="POST">
                    <div class="field m-0 text-left required">
                        <label><%=AuthenticationEndpointUtil.i18n(resourceBundle, "organization.email")%></label>
                    </div>
                    <input type="text" id='orgDiscovery' name="orgDiscovery" size='30'/>

                    <div class="mt-1" id="discoveryInputError" style="display: none;">
                        <i class="red exclamation circle fitted icon"></i>
                        <span class="validation-error-message" id="discoveryInputErrorText">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "discovery.input.cannot.be.empty")%>
                        </span>
                    </div>
                    <input id="prompt" name="prompt" type="hidden" value="orgName">
                    <input id="idp" name="idp" type="hidden" value="<%=Encode.forHtmlAttribute(idp)%>"/>
                    <input id="authenticator" name="authenticator" type="hidden" value="<%=Encode.forHtmlAttribute(authenticator)%>"/>
                    <input id="sessionDataKey" name="sessionDataKey" type="hidden" value="<%=Encode.forHtmlAttribute(sessionDataKey)%>"/>
                    <div class="ui divider hidden"></div>
                    <input type="submit" id="submitButton" onclick="submitDiscovery(); return false;"
                        value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "submit")%>"
                        class="ui primary large fluid button" />
                   <div class="mt-1 align-center">
                       <a href="javascript:navigateBackToLoginPage()" class="ui button secondary large fluid">
                           <%=AuthenticationEndpointUtil.i18n(resourceBundle, "cancel")%>
                       </a>
                   </div>
                    <div class="ui horizontal divider">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "or")%>
                    </div>
                    <div class="social-login blurring social-dimmer">
                        <input type="submit" id="orgNameButton" onclick="enterOrgName();" class="ui primary basic button link-button"
                            value="<%=AuthenticationEndpointUtil.i18n(resourceBundle, "provide.organization.name")%>">
                    </div>
               </form>
            </div>
         </layout:component>
         <layout:component componentName="ProductFooter">
            <%-- product-footer --%>
            <%
               File productFooterFile = new File(getServletContext().getRealPath("extensions/product-footer.jsp"));
               if (productFooterFile.exists()) {
            %>
                <jsp:include page="extensions/product-footer.jsp"/>
            <%
                } else {
            %>
                <jsp:include page="includes/product-footer.jsp"/>
            <%
            }
            %>
         </layout:component>
      </layout:main>
      <%-- footer --%>
      <%
         File footerFile = new File(getServletContext().getRealPath("extensions/footer.jsp"));
         if (footerFile.exists()) {
         %>
            <jsp:include page="extensions/footer.jsp"/>
        <%
        } else {
        %>
        <jsp:include page="includes/footer.jsp"/>
        <%
        }
        %>

      <script type="text/javascript">
         function enterOrgName() {
            document.getElementById("orgDiscovery").disabled = true;
            document.getElementById("org_form").submit();
         }

         function navigateBackToLoginPage() {
             // login page is always 2 steps back from the current page.
             window.history.go(-2);
         }

         function submitDiscovery() {
            // Show error message when discovery input is empty.
            if (document.getElementById("orgDiscovery").value.length <= 0) {
                showEmptyDiscoveryInputErrorMessage();
                return;
            }
            document.getElementById("prompt").remove();
            document.getElementById("org_form").submit();
         }

         // Function to show error message when discovery input is empty.
         function showEmptyDiscoveryInputErrorMessage() {
            var discoveryInputError = $("#discoveryInputError");
            discoveryInputError.show();
         }
      </script>
   </body>
</html>
