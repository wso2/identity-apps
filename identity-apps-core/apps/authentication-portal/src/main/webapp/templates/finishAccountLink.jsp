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

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="../includes/branding-preferences.jsp"/>

<head>
    <script src="../js/scripts.js"></script>
</head>

<script>
    $(".segment").show();

    function continueProcess(key) {
        var input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", "action." + key);
        var parent = document.getElementById("account-linking-finish");
        parent.appendChild(input);
    }
</script>

<div>
    <h3 class="ui header">
      <%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.are.all.set")%>
    </h3>
</div>

<div class="boarder-all ">
    <div class="clearfix"></div>
    <div class="padding-double login-form" id="samplet">
        <form action="<%=commonauthURL%>" method="POST">
            <div id="account-linking-finish">
                <c:forEach var="input" items='${requestScope.data["inputs"]}'>
                    <div id="account-linking-finish-message" class="col-xs-12 col-sm-12 col-md-12 col-lg-12 form-group required">
                        <p style="text-align:left;"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "you.can.now.user.your")%>
                                ${input.accountType} <%=AuthenticationEndpointUtil.i18n(resourceBundle, "credentials.to.sign.in")%>
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "your.account").replace("{productName}",productName)%> <b>${input.email}</b>.
                        </p>
                        </br>
                        <p style="text-align:left;">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "next.time.you.can.use.excisting.account").replace("{productName}",productName)%> ${input.accountType}
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "account.to.sign.in")%>
                        </p>
                        </br>
                        <button onClick="continueProcess('${input.id}')"
                                data-testid="finish-account-link-message-continue"
                                class="ui primary fluid large button"
                                value="${input.id}">
                                ${input.label}
                        </button>
                    </div>
                </c:forEach>
                <input type="hidden" id="promptResp" name="promptResp" value="true">
                <input type="hidden" id="promptId" name="promptId" value="${requestScope.promptId}">
            </div>
        </form>
        <div class="clearfix"></div>
    </div>
</div>
