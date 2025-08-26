<%--
  ~ Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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

<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.FileReader" %>

<%-- Include tenant context --%>
<jsp:directive.include file="init-url.jsp"/>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<%-- Extract the name of the stylesheet--%>
<%
    String themeName = "wso2is";
    String language = "en_US";
    Cookie[] userCookies = request.getCookies();
    String uiLocaleFromRequest = request.getParameter("ui_locales");

    if (isLocalizationParamPrioritized == true) {
        if (uiLocaleFromRequest != null) {
            language = uiLocaleFromRequest.split("\\s+")[0];
        } else if (userCookies != null) {
            for (Cookie cookie : userCookies) {
                if ("ui_lang".equals(cookie.getName())) {
                    language = cookie.getValue();
    
                    break;
                }
            }
        }
    } else {
        if (userCookies != null) {
            for (Cookie cookie : userCookies) {
                if ("ui_lang".equals(cookie.getName())) {
                    language = cookie.getValue();
    
                    break;
                }
            }
        } else if (uiLocaleFromRequest != null) {
            language = uiLocaleFromRequest.split("\\s+")[0];
        }
    }

    String filePath = application.getRealPath("/") + "/WEB-INF/classes/LanguageOptions.properties";
    Map<String, String> languageDirectionMap = new HashMap<>();

    try (BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath))) {
        String line;

        while ((line = bufferedReader.readLine()) != null) {
            line = line.trim();

            if (!line.startsWith("#") && !line.isEmpty()) {
                String[] keyValue = line.split("=");

                if (keyValue.length == 2) {
                    String[] keyParts = keyValue[0].split("\\.");
                    String languageCode = keyParts[keyParts.length - 1];
                    String[] valueParts = keyValue[1].split(",");

                    if (valueParts.length >= 3) {
                        String direction = valueParts[2].trim();
                        languageDirectionMap.put(languageCode, direction);
                    } else {
                        languageDirectionMap.put(languageCode, "ltr");
                    }
                }
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }

    String direction = languageDirectionMap.getOrDefault(language, "ltr");

    File themeDir = new File(request.getSession().getServletContext().getRealPath("/") + "libs/themes/" + themeName + "/");
    String themeFileName = "";
    String[] fileNames = null;

    if (themeDir.exists() && themeDir.isDirectory()) {
        fileNames = themeDir.list();

        if (fileNames != null) {
            for (String file : fileNames) {
                if (direction.equals("rtl") && file.endsWith(".rtl.min.css")) {
                    themeFileName = file;

                    break;
                } else if (direction.equals("ltr") && !file.contains(".rtl") && file.endsWith(".min.css")) {
                    themeFileName = file;

                    break;
                }
            }
        }
    }

    if (themeFileName.isEmpty() && fileNames != null) {
        for (String file : fileNames) {
            if (file.endsWith(".min.css") && !file.contains(".rtl")) {
                themeFileName = file;

                break;
            }
        }
    }
%>

<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<%-- Updates the favicon with the URL resolved in branding-preferences --%>
<link rel="icon" href="<%= StringEscapeUtils.escapeHtml4(faviconURL) %>" type="image/x-icon"/>

<%-- Load the base theme --%>
<link href="libs/themes/wso2is/<%= themeFileName %>" rel="stylesheet">

<%-- Load Default Theme Skeleton --%>
<jsp:include page="theme-skeleton.jsp"/>

<%-- If an override stylesheet is defined in branding-preferences, applying it... --%>
<% if (overrideStylesheet != null && !StringUtils.startsWith(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME)) { %>
<link rel="stylesheet" href="<%= StringEscapeUtils.escapeHtml4(overrideStylesheet) %>">
<% } %>

<%-- Layout specific style sheet--%>
<%
    String styleFilePath = "";
    if (StringUtils.startsWith(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME)) {
        if(StringUtils.isNotBlank(cssContent)) {
%>
<style type="text/css"><%= cssContent %></style>
<%
        } else {
            if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR
                + preferenceResolvedFromResourceName)) {
                styleFilePath = layoutStoreURL.replace("${tenantDomain}", preferenceResolvedFromResourceName) + "/styles.css";
            } else if (StringUtils.equals(layout, PREFIX_FOR_CUSTOM_LAYOUT_NAME + CUSTOM_LAYOUT_NAME_SEPERATOR
                + tenantRequestingPreferences + CUSTOM_LAYOUT_NAME_SEPERATOR + convertApplicationName(applicationRequestingPreferences))) {
                styleFilePath = layoutStoreURL.replace("${tenantDomain}", tenantRequestingPreferences) + "/apps/" + convertApplicationName(applicationRequestingPreferences) + "/styles.css";
            }
        }
    } else {
        styleFilePath = "includes/layouts/" + layout + "/styles.css";
    }

    if (StringUtils.isBlank(cssContent) && (styleFilePath.startsWith("http") || config.getServletContext().getResource(styleFilePath) != null)) {
%>
        <link rel="stylesheet" href="<%= styleFilePath %>">
<%
    }
%>

<%-- Updates the site tile with the text resolved in branding-preferences --%>
<title><%= i18n(resourceBundle, customText, "site.title", __DEPRECATED__siteTitle) %></title>

<%-- Downtime banner --%>
<%
    if (config.getServletContext().getResource("extensions/planned-downtime-banner.jsp") != null) {
%>
        <jsp:include page="/extensions/planned-downtime-banner.jsp"/>
<%
    }
%>

<script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>

<style type="text/css">
    :root {
        --otp-digits: 6;
    }

    .grecaptcha-badge {
        bottom: 55px !important;
    }

    .multi-code-otp-input-field {
        text-align: center;
        margin-top: 2.5em !important;
    }

    .multi-code-otp-input[autocomplete=one-time-code],
    .multi-code-otp-input[autocomplete=one-time-code]:focus {
        --otp-ls: 1.5ch;
        --otp-gap: 1.2;
        --_otp-bgsz: calc(var(--otp-ls) + 1ch);
        --_otp-digit: 0;

        all: unset;
        background: linear-gradient(90deg, var(--otp-bg, #BBB) calc(var(--otp-gap) * var(--otp-ls)), transparent 0),
            linear-gradient(90deg, var(--otp-bg, #EEE) calc(var(--otp-gap) * var(--otp-ls)), transparent 0) !important;
        background-position: calc(var(--_otp-digit) * var(--_otp-bgsz)) 0, 0 0 !important;
        background-repeat: no-repeat, repeat-x !important;
        background-size: var(--_otp-bgsz) 100% !important;
        caret-color: #222;
        clip-path: inset(0% calc(var(--otp-ls) / 2) 0% 0%);
        font-family: ui-monospace, monospace !important;
        font-size: 1.5em !important;
        inline-size: calc(var(--otp-digits) * var(--_otp-bgsz));
        letter-spacing: calc(var(--otp-ls));
        padding-block: var(--otp-pb, 1ch);
        padding-inline-start: calc(((var(--otp-ls) - 1ch) / 2) * var(--otp-gap));
        border: none !important;
        overflow-x: hidden !important;
        border-radius: 0 !important;
        padding: .5rem 0 .5rem .38ch !important;
        width: calc(var(--otp-ls) * var(--otp-digits) + 1ch * var(--otp-digits)) !important;
        margin: 0 auto 0 15px !important;
        text-align: left;
    }

    [dir=rtl] .multi-code-otp-input[autocomplete=one-time-code],
    [dir=rtl] .multi-code-otp-input[autocomplete=one-time-code]:focus {
        text-align: right;
        padding: .5rem .38ch .5rem 0 !important;
        margin: 0 15px 0 auto !important;
    }

    @media only screen and (max-width: 767px) {
        .grecaptcha-badge {
            bottom: 100px !important;
        }
    }
</style>

<script type="text/javascript">
    const direction = "<%= direction %>";
    if (direction) {
        document.documentElement.setAttribute("dir", direction);
    }
</script>
