<%--
~ Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

<%@ page import="org.owasp.encoder.Encode" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="org.apache.commons.collections.CollectionUtils" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.Constants" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.stream.Collectors" %>
<%@ page import="java.util.stream.Stream" %>
<%@ taglib prefix="template" tagdir="/WEB-INF/tags" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%@ include file="includes/localize.jsp" %>
<%@ include file="includes/init-url.jsp" %>

<%
    String app = request.getParameter("application");
    String scopeString = request.getParameter("scope");
    boolean displayScopes = Boolean.parseBoolean(getServletContext().getInitParameter("displayScopes"));
%>

<c:set var="body">
    <h3 class="ui header"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "authorize")%></h3>
    <form action="<%=oauth2AuthorizeURL%>" method="post" id="profile" name="oauth2_authz">
        <div class="feild">
            <div class="ui visible warning message" role="alert">
                <div>
                    <strong><%=Encode.forHtml(request.getParameter("application"))%></strong>
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "request.access.profile")%>
                </div>
            </div>
        </div>

        <%
            if (displayScopes && StringUtils.isNotBlank(scopeString)) {
                // Remove "openid" from the scope list to display.
                List<String> openIdScopes = Stream.of(scopeString.split(" "))
                        .filter(x -> !StringUtils.equalsIgnoreCase(x, "openid"))
                        .collect(Collectors.toList());

                if (CollectionUtils.isNotEmpty(openIdScopes)) {
        %>
        <h5 class="section-heading-5"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%></h5>
        <div class="border-gray" style="border-bottom: none;">
            <ul class="scopes-list padding">
                <%
                    for (String scopeID : openIdScopes) {
                %>
                <li><%=Encode.forHtml(scopeID)%></li>
                <%
                    }
                %>
            </ul>
        </div>
        <%
                }
            }
        %>
        <div class="ui secondary segment" style="text-align: left;">
            <div class="ui form">
                <div class="grouped fields">
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" class="hidden" name="scope-approval" id="approveCb" value="approve">
                            <label for="approveCb">Approve Once</label>
                        </div>
                    </div>
                    <div class="field">
                        <div class="ui radio checkbox">
                            <input type="radio" class="hidden" name="scope-approval" id="approveAlwaysCb" value="approveAlways">
                            <label for="approveAlwaysCb">Approve Always</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="login-buttons">
            <input type="hidden" name="<%=Constants.SESSION_DATA_KEY_CONSENT%>"
                value="<%=Encode.forHtmlAttribute(request.getParameter(Constants.SESSION_DATA_KEY_CONSENT))%>"/>
            <input type="hidden" name="consent" id="consent" value="deny"/>
            <div style="text-align: right;">
                <input class="ui large button" type="reset"
                    onclick="deny(); return false;"
                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"cancel")%>" />
                <input type="button" class="ui primary large button" id="approve" name="approve"
                    onclick="approve(); return false;"
                    value="<%=AuthenticationEndpointUtil.i18n(resourceBundle,"continue")%> "/>
            </div>
        </div>
    </form>

    <div class="ui modal mini" id="modal_scope_validation">
        <div class="header">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "requested.scopes")%>
        </div>
        <div class="content">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.select.approve.always")%>
        </div>
        <div class="actions">
            <button class="ui primary button" onclick="hideModal(this)">
                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "ok")%>
            </button>
        </div>
    </div>
</c:set>
<c:set var="bottom">
    <script>
        function approve() {
            var scopeApproval = $("input[name='scope-approval']");

            // If scope approval radio button is rendered then we need to validate that it's checked
            if (scopeApproval.length > 0) {
                if (scopeApproval.is(":checked")) {
                    var checkScopeConsent = $("input[name='scope-approval']:checked");
                    $('#consent').val(checkScopeConsent.val());
                } else {
                    $("#modal_scope_validation").modal('show');
                    return;
                }
            }

            document.getElementById("profile").submit();
        }
        
        function deny() {
            document.getElementById('consent').value = "deny";
            document.getElementById("profile").submit();
        }
    </script>
</c:set>

<template:loginWrapper
    pageTitle='<%=AuthenticationEndpointUtil.i18n(resourceBundle, "wso2.identity.server")%>'
    productTitle='<%=AuthenticationEndpointUtil.i18n(resourceBundle, "identity.server")%>'
    businessName='<%=AuthenticationEndpointUtil.i18n(resourceBundle, "business.name")%>'>
    <jsp:body>${body}</jsp:body>
    <jsp:attribute name="bottomIncludes">${bottom}</jsp:attribute>
</template:loginWrapper>
