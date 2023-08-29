<%--
 ~
 ~ Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 ~
 ~ This software is the property of WSO2 Inc. and its suppliers, if any.
 ~ Dissemination of any information or reproduction of any material contained
 ~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 ~ You may not alter or remove any copyright or other notice from copies of this content."
 ~
--%>

<%-- localize.jsp MUST already be included in the calling script --%>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="./branding-preferences.jsp"/>

<div class="theme-icon inline auto transparent product-logo portal-logo">
    <img src="<%= StringEscapeUtils.escapeHtml4(logoURL) %>" id="product-logo" alt="<%= StringEscapeUtils.escapeHtml4(logoAlt) %>" />
</div>
