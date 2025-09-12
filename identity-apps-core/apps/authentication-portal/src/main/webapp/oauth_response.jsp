<%--
  ~ Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.core.ServiceURLBuilder" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>

<%
    request.setAttribute("ut", request.getAttribute("userTenantDomain"));
    request.setAttribute("sp", request.getAttribute("serviceProvider"));
    // The `request` object contains the tenantDomain, which can be directly provided to the init-url.jsp code.
%>

<%-- Localization --%>
<jsp:directive.include file="includes/localize.jsp" />

<%-- Include tenant context --%>
<jsp:directive.include file="includes/init-url.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="includes/branding-preferences.jsp"/>

<%!
    private static final String AUTHENTICATION_ENDPOINT = "/authenticationendpoint";
    private static final String CONSOLE_APP_NAME = "Console";
%>

<%
    String primaryColorMain = "#ff7300";
    String primaryTextColor = "#999ea2";
    String bodyBackgroundColorMain = "#f5f6f6";
    String typographyFontFamily = "Montserrat, -apple-system, BlinkMacSystemFont, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif";
    String typographyFontFamilyImportURL = "https://fonts.googleapis.com/css2?family=Montserrat&display=swap";

    String COLORS_PRIMARY_KEY = "primary";
    String COLORS_MAIN_VARIANT_KEY = "main";
    String COLORS_TEXT_KEY = "text";
    String COLORS_PRIMARY_VARIANT_KEY = "primary";
    String COLORS_BACKGROUND_KEY = "background";
    String COLORS_BACKGROUND_BODY_KEY = "body";
    String FONT_KEY = "font";
    String FONT_FAMILY_KEY = "fontFamily";
    String FONT_FAMILY_IMPORT_URL = "importURL";
    String TYPOGRAPHY_KEY = "typography";

    if (theme != null) {
        if (theme.has(COLORS_KEY)) {

            JSONObject colorPalette = theme.optJSONObject(COLORS_KEY);

            if (colorPalette != null) {
                if (colorPalette.has(COLORS_PRIMARY_KEY)) {
                    JSONObject primary = colorPalette.optJSONObject(COLORS_PRIMARY_KEY);

                    if (primary != null) {
                        if (primary.has(COLORS_MAIN_VARIANT_KEY)
                            && !StringUtils.isBlank(primary.getString(COLORS_MAIN_VARIANT_KEY))) {

                            primaryColorMain = primary.getString(COLORS_MAIN_VARIANT_KEY);
                        }
                    } else if (!StringUtils.isBlank(colorPalette.getString(COLORS_PRIMARY_KEY))) {
                        primaryColorMain = colorPalette.getString(COLORS_PRIMARY_KEY);
                    }
                }

                if (colorPalette.has(COLORS_TEXT_KEY)) {
                    JSONObject text = colorPalette.optJSONObject(COLORS_TEXT_KEY);

                    if (text != null) {
                        if (text.has(COLORS_PRIMARY_VARIANT_KEY)
                            && !StringUtils.isBlank(text.getString(COLORS_PRIMARY_VARIANT_KEY))) {

                            primaryTextColor = text.getString(COLORS_PRIMARY_VARIANT_KEY);
                        }
                    }
                }

                if (colorPalette.has(COLORS_BACKGROUND_KEY)) {
                    JSONObject background = colorPalette.optJSONObject(COLORS_BACKGROUND_KEY);

                    if (background != null) {
                        if (background.has(COLORS_BACKGROUND_BODY_KEY)) {
                            JSONObject body = background.optJSONObject(COLORS_BACKGROUND_BODY_KEY);

                            if (body != null) {
                                if (body.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(body.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    bodyBackgroundColorMain = body.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (theme.has(TYPOGRAPHY_KEY)) {

            JSONObject typography = theme.optJSONObject(TYPOGRAPHY_KEY);

            if (typography != null) {
                if (typography.has(FONT_KEY)) {
                    if (typography.getJSONObject(FONT_KEY).has(FONT_FAMILY_KEY)
                        && !StringUtils.isBlank(typography.getJSONObject(FONT_KEY).getString(FONT_FAMILY_KEY))) {

                        typographyFontFamily = typography.getJSONObject(FONT_KEY).getString(FONT_FAMILY_KEY);
                    }
                    if (typography.getJSONObject(FONT_KEY).has(FONT_FAMILY_IMPORT_URL)
                        && !StringUtils.isBlank(typography.getJSONObject(FONT_KEY).getString(FONT_FAMILY_IMPORT_URL))) {

                        typographyFontFamilyImportURL = typography.getJSONObject(FONT_KEY).getString(FONT_FAMILY_IMPORT_URL);
                    }
                }
            }
        }
    } else if (colors != null) {
        if (colors.has("primary") && !StringUtils.isBlank(colors.getString("primary"))) {
            primaryColorMain = colors.getString("primary");
        }
    }
%>

<% request.setAttribute("pageName", "oauth-response"); %>

<html>

<head>
    <title><%= productName %></title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <style type="text/css">
        @import url("<%= StringEscapeUtils.escapeHtml4(typographyFontFamilyImportURL) %>");

        @font-face {
            font-family: 'Montserrat', sans-serif;
            font-style: normal;
            font-weight: 400;
            src: local('Montserrat'),
                local('Montserrat'),
                url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap') format('Roboto');
        }

        .pre-loader-logo {
            margin-top: 41px;
            border-style: none;
        }

        .content-loader {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            user-select: none;
        }

        .content-loader .ui.loader {
            display: block;
            position: relative;
            margin-top: 10px;
            margin-bottom: 25px;
        }

        @keyframes loader {
            0% {
                transform: rotate(0)
            }

            to {
                transform: rotate(1turn)
            }
        }

        .content-loader .ui.loader:before {
            content: "";
            display: block;
            height: 26px;
            width: 26px;
            border: .2em solid rgba(0,0,0,.1);
            border-radius: 500rem;
        }

        .content-loader .ui.loader:after {
            content: "";
            position: absolute;
            height: 26px;
            width: 26px;
            border-color: <%= !StringUtils.isBlank(primaryTextColor) ? StringEscapeUtils.escapeHtml4(primaryTextColor) : "#767676" %> transparent transparent !important;
            border: .2em solid transparent;
            animation: loader .6s linear;
            animation-iteration-count: infinite;
            border-radius: 500rem;
            box-shadow: 0 0 0 1px transparent;
            top: 0;
            left: 0;
        }

        .trifacta-pre-loader {
            margin-top: 41px;
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
            background: <%= StringEscapeUtils.escapeHtml4(bodyBackgroundColorMain) %>;
            height: 100%;
            flex-direction: column;
            display: flex;
            margin: unset;
        }

        .login-portal {
            font-family: <%= StringEscapeUtils.escapeHtml4(typographyFontFamily) %>;
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
            color: <%= StringEscapeUtils.escapeHtml4(primaryTextColor) %>;
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
            border-top: 1px solid #dcdcdc;
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
            border: 1px solid rgba(34, 36, 38, 0.15);
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
            padding: 0.35714286em 0.5em;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.6);
            transition: opacity 0.1s ease;
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
            padding: 0.92857143em 1.14285714em;
            text-transform: none;
            color: rgba(0, 0, 0, 0.87);
            font-weight: 400;
            transition: background 0.1s ease, box-shadow 0.1s ease, color 0.1s ease;
        }

        a {
            color: <%= StringEscapeUtils.escapeHtml4(primaryColorMain) %>;
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
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans,
                sans-serif, font-awesome, "Helvetica Neue", Arial, Helvetica, sans-serif;
            margin: 0 0.25em 0 0;
            padding: 0.78571429em 1.5em 0.78571429em;
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
            transition: opacity 0.1s ease, background-color 0.1s ease, color 0.1s ease, box-shadow 0.1s ease,
                background 0.1s ease;
            will-change: "";
            -webkit-tap-highlight-color: transparent;
        }
    </style>

    <%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
    <% if (overrideStylesheet != null) { %>
    <link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
    <% } %>
</head>

<body class="login-portal layout recovery-layout" onload="javascript:document.getElementById('oauth-response').submit()" data-page="<%= request.getAttribute("pageName") %>">
    <div class="page-wrapper">
        <main class="center-segment registration-loader">
            <div class="ui container aligned middle aligned text-center">
                <div class="pre-loader-wrapper" data-testid="pre-loader-wrapper">
                    <% if (StringUtils.equals(tenantForTheming, IdentityManagementEndpointConstants.SUPER_TENANT) && !enableDefaultPreLoader) { %>
                        <div class="trifacta-pre-loader" data-testid="trifacta-pre-loader">
                            <svg data-testid="trifacta-pre-loader-svg" xmlns="http://www.w3.org/2000/svg" width="67.56"
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
                        </div>
                    <%
                        } else {
                            if (!StringUtils.startsWith(logoURL, "http")) {
                                logoURL = ServiceURLBuilder.create().addPath(AUTHENTICATION_ENDPOINT + "/" + logoURL).build().getAbsolutePublicURL();
                            }
                    %>
                        <img class="pre-loader-logo" alt="<%= StringEscapeUtils.escapeHtml4(logoAlt) %>" src="<%= StringEscapeUtils.escapeHtml4(logoURL) %>">
                        <div class="content-loader">
                            <div class="ui dimmer">
                                <div class="ui loader"></div>
                            </div>
                        </div>
                    <% } %>
                </div>
                <p class="message-description">
                    <a class="primary-color-btn button"
                        href="javascript:document.getElementById('oauth-response').submit()">
                        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "click.here")%>
                    </a>
                    <%=AuthenticationEndpointUtil.i18n(resourceBundle, "if.you.have.been.waiting.for.too.long")%>
                </p>
                <form id="oauth-response" method="post" action="${redirectURI}">
                <% String params = (String) request.getAttribute("params"); %>
                <%= params %>
                </form>
            </div>
        </main>
    </div>
</body>

</html>
