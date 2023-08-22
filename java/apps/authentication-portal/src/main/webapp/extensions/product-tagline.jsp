<%--
 ~
 ~ Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 LLC. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%-- localize.jsp MUST already be included in the calling script --%>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>

<%-- Localization --%>
<jsp:directive.include file="../includes/localize.jsp" />

<div class="slogan-container">
    <div class="theme-icon inline auto transparent product-logo portal-logo">
        <img src="libs/themes/asgardio/assets/images/branding/asgardeo-logo.svg" alt="Asgardeo Logo" />
    </div>

    <h2 class="ui header portal-logo-tagline login-page">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "asgardeo.product.tagline")%>
        <br/>
    </h2>
    <p class="slogan-description">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "asgardeo.product.description")%>
    </p>
</div>
