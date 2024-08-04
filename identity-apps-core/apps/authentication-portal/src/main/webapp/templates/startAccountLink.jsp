<%--
 ~
 ~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="e" uri="https://www.owasp.org/index.php/OWASP_Java_Encoder_Project" %>
<jsp:directive.include file="../includes/init-url.jsp"/>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="static org.wso2.carbon.identity.core.util.IdentityUtil.fillURLPlaceholders" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.ApplicationDataRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<%
    String applicationAccessURLWithoutEncoding = null;
    try {
        // Redirection URL of the back-to-sign resolves from the contextProperties.
        // If not possible, the URL will be resolved to URL of the Console.
        String sp = "console";
        if (request.getAttribute("data") instanceof Map) {
        	Map data = (Map) request.getAttribute("data");
           	if (data.get("inputs") instanceof ArrayList<?>) {
           	    ArrayList<Map> inputs = (ArrayList<Map>) data.get("inputs");
           	    if (inputs.get(0).containsKey("sp")){
       		    	sp = inputs.get(0).get("sp").toString();
        	    }
        	}
        }

        ApplicationDataRetrievalClient applicationDataRetrievalClient = new ApplicationDataRetrievalClient();
        applicationAccessURLWithoutEncoding = applicationDataRetrievalClient.getApplicationAccessURL(tenantDomain, sp);
        applicationAccessURLWithoutEncoding = IdentityManagementEndpointUtil.replaceUserTenantHintPlaceholder(
                                                                applicationAccessURLWithoutEncoding, userTenantDomain);
    } catch (ApplicationDataRetrievalClientException e) {
        // Ignored and fallback to login page url.
    }
%>

<head>
    <script src="../js/scripts.js"></script>
</head>

<script>
    $(".segment").show();

    function nextClick(key) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "action." + key);
        var parent = document.getElementById("account-link");
        parent.appendChild(input);
    }
</script>

<div>
    <h3 class="ui header">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "we.found.account.with.email").replace("{productName}",productName)%>
    </h3>
</div>

<div class="boarder-all">
    <div class="clearfix"></div>
    <div class="padding-double login-form" id="samplet">

        <form action="<%=commonauthURL%>" method="POST">
            <div id="account-link">
                <c:forEach var="input" items='${requestScope.data["inputs"]}'>
                    <div id="account-link-message" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group required">
                        <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "looks.like.you.are.signing.in.with")%>
                        <b>${input.accountType}</b> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "for.the.first.time")%>
                        </p>

                        <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.already.have.account").replace("{productName}",productName)%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "different option")%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "that.uses.email.address")%> <b>${input.email}</b>.
                        </p>

                        <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "click")%>
                            <b><%=AuthenticationEndpointUtil.i18n(resourceBundle, "next")%></b>
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "to.link.account.to").replace("{productName}",productName)%>
                            <c:if test="${input.accountType ne 'Google'}">
                                <b>${input.userName}</b>
                            </c:if>
                                ${input.accountType} <%=AuthenticationEndpointUtil.i18n(resourceBundle, "account")%>.
                        </p>
                        </br>
                        <button onClick="nextClick('${input.id}')"
                                data-testid="start-account-link-message-next"
                                class="ui primary fluid large button"
                                value="${input.id}">
                                <%=AuthenticationEndpointUtil.i18n(resourceBundle, "next")%>
                        </button>
                        </br>
                        <a class="clickable-link"
                           data-testid="start-account-link-message-back-to-sign-in-link"
                           href="<%=IdentityManagementEndpointUtil.getURLEncodedCallback(applicationAccessURLWithoutEncoding)%>?prompt=login">
                            <%=AuthenticationEndpointUtil.i18n(resourceBundle, "back.to.sign.in")%>
                        </a>
                    </div>
                </c:forEach>
                <input type="hidden" id="promptResp" name="promptResp" value="true">
                <input type="hidden" id="promptId" name="promptId" value="${requestScope.promptId}">
            </div>
        </form>
        <div class="clearfix"></div>
    </div>
</div>
