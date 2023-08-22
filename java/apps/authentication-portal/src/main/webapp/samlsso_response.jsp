<%--
~    Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~    This software is the property of WSO2 Inc. and its suppliers, if any.
~    Dissemination of any information or reproduction of any material contained
~    herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~    You may not alter or remove any copyright or other notice from copies of this content."
--%>

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.sso.saml.SAMLSSOConstants" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="extensions/branding-preferences.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp" />

<%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
<% if (overrideStylesheet != null) { %>
<link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
<% } %>

<html>

<head>
    <title><%=AuthenticationEndpointUtil.i18n(resourceBundle, "redirecting")%></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');

        @font-face {
            font-family: 'Montserrat', sans-serif;
            font-style: normal;
            font-weight: 400;
            src: local('Montserrat'),
                local('Montserrat'),
                url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap') format('Roboto');
        }

        svg #_1 {
            animation-name: alert-success;
            animation-duration: 3s;
            position: relative;
            animation-delay: 0s;
            animation-iteration-count: infinite;

        }

        svg #_2 {
            animation-name: alert-success;
            animation-duration: 3s;
            position: relative;
            animation-delay: 1s;
            animation-iteration-count: infinite;

        }

        svg #_3 {
            animation-name: alert-success;
            animation-duration: 3s;
            position: relative;
            animation-delay: 2s;
            animation-iteration-count: infinite;

        }

        @keyframes alert-success {
            0% {
                opacity: 1;
            }

            100% {
                opacity: 0;
            }
        }

        .login-portal.layout {
            background: #F5F6F6;
            height: 100%;
            flex-direction: column;
            display: flex;
            margin: unset;
        }

        .login-portal {
            font-family: Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif;
        }

        .login-portal.layout .page-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .login-portal.layout .center-segment {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .login-portal.layout .center-segment {
            flex-shrink: 0;
            margin: auto;
            display: flex;
            align-items: center;
        }

        .text-center {
            text-align: center !important;
        }

        .message-description {
            color: #999ea2;
            font-size: 17px;
        }

        p:last-child {
            margin-bottom: 0;
        }

        p {
            margin: 0 0 1em;
            line-height: 1.4285em;
        }

        .message-header {
            font-weight: 300 !important;
            font-family: Montserrat, sans-serif;
            font-size: 24px;
            color: #000000a3;
        }

        .mb-3 {
            margin-bottom: 1rem !important;
        }

        h2 {
            font-size: 1.71428571rem;
        }

        .password-toggle {
            right: 0 !important;
            left: auto !important;
            pointer-events: all !important;
            cursor: pointer !important;
        }

        #tenant-validation-icon-loader,
        #tenant-validation-icon-check,
        #tenant-validation-icon-cross {
            left: unset;
            right: 1px;
        }

        p.privacy {
            font-size: 0.9em;
            color: #00000085;
        }

        p.if-redirection-failed {
            color: #999ea2;
        }

        span.pointer {
            cursor: pointer;
        }

        .login-portal.layout .footer {
            padding: 0 8rem;
            border-top: 1px solid #DCDCDC;
        }

        .ui.fluid.container {
            width: 100%;
        }

        @media only screen and (min-width: 1200px) {
            .ui.container {
                width: 1127px;
                margin-left: auto !important;
                margin-right: auto !important;
            }

            .ui.container {
                display: block;
                max-width: 100% !important;
            }
        }

        .login-portal.layout .footer .ui.text.menu {
            margin: 0;
            line-height: 40px;
        }

        .ui.text.menu {
            background: none transparent;
            border-radius: 0;
            box-shadow: none;
            border: none;
            margin: 1em -.5em;
        }

        .ui.menu:last-child {
            margin-bottom: 0;
        }

        .ui.menu:first-child {
            margin-top: 0;
        }

        .ui.menu {
            font-size: 1rem;
        }

        .ui.menu {
            display: flex;
            margin: 1rem 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif, font-awesome, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            background: #fbfbfb;
            font-weight: 400;
            border: 1px solid rgba(34, 36, 38, .15);
            box-shadow: 0 1px 2px 0 rgb(34 36 38 / 15%);
            border-radius: 4px;
            min-height: 2.85714286em;
        }

        .ui.menu:not(.vertical)>.menu {
            display: flex;
        }

        .ui.menu .menu {
            margin: 0;
        }

        .ui.menu:not(.vertical) .right.item,
        .ui.menu:not(.vertical) .right.menu {
            display: flex;
            margin-left: auto !important;
        }

        .ui.menu:not(.vertical)>.menu {
            display: flex;
        }

        .ui.menu .menu {
            margin: 0;
        }

        .login-portal.layout .footer .ui.text.menu .item {
            color: #909599;
        }

        .ui.text.menu .item {
            border-radius: 0;
            box-shadow: none;
            align-self: center;
            margin: 0 0;
            padding: .35714286em .5em;
            font-weight: 400;
            color: rgba(0, 0, 0, .6);
            transition: opacity .1s ease;
        }

        .ui.menu:not(.vertical) .item {
            display: flex;
            align-items: center;
        }

        .ui.menu .item {
            position: relative;
            vertical-align: middle;
            line-height: 1;
            text-decoration: none;
            -webkit-tap-highlight-color: transparent;
            flex: 0 0 auto;
            user-select: none;
            background: 0 0;
            padding: .92857143em 1.14285714em;
            text-transform: none;
            color: rgba(0, 0, 0, .87);
            font-weight: 400;
            transition: background .1s ease, box-shadow .1s ease, color .1s ease;
        }

        a {
            color: #ff7300;
            text-decoration: none;
        }

        a {
            background-color: transparent;
            -webkit-text-decoration-skip: objects;
        }

        .ui.button {
            cursor: pointer;
            display: inline-block;
            min-height: 1em;
            outline: 0;
            border: none;
            vertical-align: baseline;
            background-color: #ff7300;
            color: #fff;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif, font-awesome, 'Helvetica Neue', Arial, Helvetica, sans-serif;
            margin: 0 .25em 0 0;
            padding: .78571429em 1.5em .78571429em;
            text-transform: none;
            text-shadow: none;
            font-weight: 500;
            line-height: 1em;
            font-style: normal;
            text-align: center;
            text-decoration: none;
            border-radius: 4px;
            box-shadow: 0 0 0 1px transparent inset, 0 0 0 0 rgb(34 36 38 / 15%) inset;
            user-select: none;
            transition: opacity .1s ease, background-color .1s ease, color .1s ease, box-shadow .1s ease, background .1s ease;
            will-change: '';
            -webkit-tap-highlight-color: transparent;
        }
    </style>
</head>

<body class="login-portal layout recovery-layout" onload="javascript:document.getElementById('samlsso-response-form').submit()">

    <div class="page-wrapper">
        <main class="center-segment registration-loader">
            <div class="ui container aligned middle aligned text-center">
                <svg data-testid="{" `${ testId }-svg` } xmlns="http://www.w3.org/2000/svg" width="67.56"
                    height="58.476" viewBox="0 0 67.56 58.476">
                    <g id="logo-only" transform="translate(-424.967 -306)">
                        <path id="_3" data-name="3"
                            d="M734.291,388.98l6.194,10.752-6.868,11.907h13.737l6.226,10.751H714.97Z"
                            transform="translate(-261.054 -82.98)" fill="#ff7300" />
                        <path id="_2" data-name="2"
                            d="M705.95,422.391l6.227-10.751h13.736l-6.867-11.907,6.193-10.752,19.321,33.411Z"
                            transform="translate(-280.983 -82.98)" fill="#ff7300" />
                        <path id="_1" data-name="1"
                            d="M736.65,430.2l-6.868-11.907-6.9,11.907H710.46l19.322-33.411L749.071,430.2Z"
                            transform="translate(-271.019 -65.725)" fill="#000" />
                    </g>
                </svg>
                <%
                    String spName = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_SP_NAME);
                    String acUrl = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_AC_URL);
                    if (StringUtils.isNotBlank(spName)) {
                %>
                    <h2 class="message-header mb-3"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.wait.while.we.take.you.back.to")%> <%= spName %></h2>
                <% } else { %>
                    <h2 class="message-header mb-3"><%=AuthenticationEndpointUtil.i18n(resourceBundle, "please.wait.while.we.take.you.back.to")%> <%= acUrl %></h2>
                <% } %>
                <p class="message-description">
                    <a class="primary-color-btn button" href="javascript:document.getElementById('samlsso-response-form').submit()">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "click.here")%>
                    </a> <%=AuthenticationEndpointUtil.i18n(resourceBundle, "if.you.have.been.waiting.for.too.long")%></p>
                <form id="samlsso-response-form" method="post" action="<%= acUrl %>">
                    <%--$params--%>
                    <%
                        String samlMessage = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_SAML_MESSAGE);
                        String samlMessageType = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_SAML_MESSAGE_TYPE);
                    %>
                        <input type='hidden' name='<%= samlMessageType %>' value='<%= Encode.forHtmlAttribute(samlMessage) %>'/>
                    <%
                    	String relayState = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_RELAY_STATE);
                        if (relayState != null) {
                    %>
                        <input type='hidden' name='<%= SAMLSSOConstants.RELAY_STATE %>' value='<%= Encode.forHtmlAttribute(relayState) %>'/>
                    <% } %>
                    <%--$additionalParams--%>
                    <%
                    	String authenticatedIdPs = (String) request.getAttribute(SAMLSSOConstants.ATTR_NAME_AUTHENTICATED_IDPS);
                        if (authenticatedIdPs != null && !authenticatedIdPs.isEmpty()) {
                    %>
                        <input type='hidden' name='AuthenticatedIdPs' value='<%= Encode.forHtmlAttribute(authenticatedIdPs) %>'/>
                    <% } %>
                </form>
            </div>
        </main>
    </div>

</body>

</html>
