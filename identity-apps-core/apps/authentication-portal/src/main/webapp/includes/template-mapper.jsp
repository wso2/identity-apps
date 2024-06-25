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

<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>

<%
    Map<String, String> templateMap = new HashMap<>();
    templateMap.put("genericForm", "templates/genericForm.jsp");
    templateMap.put("username", "templates/username.jsp");
    templateMap.put("startAccountLink", "templates/startAccountLink.jsp");
    templateMap.put("finishAccountLink", "templates/finishAccountLink.jsp");
    templateMap.put("externalRedirect", "templates/externalRedirect.jsp");
    templateMap.put("internalWait", "templates/internalWait.jsp");
%>
