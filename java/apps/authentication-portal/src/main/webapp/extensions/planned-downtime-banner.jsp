<%--
~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~ This software is the property of WSO2 Inc. and its suppliers, if any.
~ Dissemination of any information or reproduction of any material contained
~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~ You may not alter or remove any copyright or other notice from copies of this content."
--%>

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<div id="downtime-banner" class="ui inline nag downtime-banner" >
    <span class="title">
                        Please write to <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>" target="_blank">
                        <span class="orange-text-color button"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></span>
                    </a> for assistance.
        <p>Asgardeo services will be unavailable on <b>10 May 2021 between 10.00 AM to 3.00 PM IST</b> due to a planned maintenance.
            <br>For more information, contact <a href="mailto:<%= StringEscapeUtils.escapeHtml4(supportEmail) %>"><%= StringEscapeUtils.escapeHtml4(supportEmail) %></a>
        </p>
    </span>
</div>
