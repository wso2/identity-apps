<%--
  ~ Copyright (c) 2023, WSO2 Inc. (http://www.wso2.org).
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

<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.AuthenticationEndpointUtil" %>
<%@ page import="java.util.ArrayList" %>
<%@ page import="java.util.List" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.File" %>
<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.FileReader" %>

<%-- Localization --%>
<jsp:directive.include file="localize.jsp" />

<script src="libs/jquery_3.6.0/jquery-3.6.0.min.js"></script>
<script type="text/javascript">
    $(document).ready(function(){
        const languageDropdown = $("#language-selector-dropdown");
        const languageSelectionInput = $("#language-selector-input");
        const selectedLanguageText = $("#language-selector-selected-text");

        // Setting language dropdown
        languageDropdown.dropdown('hide');
        $("> input.search", languageDropdown).attr("role", "presentation");

        // Set current lang value coming from cookie
        const urlParams = new URLSearchParams(window.location.search);
        const localeFromCookie = getCookie("ui_lang");
        var localeFromUrlParams = null;
        if (urlParams.has('ui_locales')) {
            localeFromUrlParams = encodeURIComponent(urlParams.get('ui_locales'));
        }
        const browserLocale = "<%= userLocale %>"
        const computedLocale = computeLocale(localeFromCookie, localeFromUrlParams, browserLocale);

        languageSelectionInput.val(computedLocale);

        const dataOption = $( "div[data-value='" + computedLocale + "']" );
        dataOption.addClass("active selected")

        selectedLanguageText.removeClass("default");
        selectedLanguageText.html(dataOption.html());

        document.documentElement.lang = computedLocale;
    });

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     */
    function extractDomainFromHost() {
        let domain = undefined;
        /**
         * Extract the domain from the hostname.
         * Ex: If env.app.example.io is parsed, `example.io` will be set as the domain.
         */
        try {
            let hostnameTokens = window.location.hostname.split('.');
            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length -2), hostnameTokens.length).join(".");
            } else if (hostnameTokens.length == 1) {
                domain = hostnameTokens[0];
            }
        } catch(e) {
            // Couldn't parse the hostname.
        }
        return domain;
    }

    /**
     * Look for a specific browser cookie.
     * @param name - Name of the cookie to find.
     */
    function getCookie(name) {
        var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

        if (match) {
            return match[2];
        }
    }

    /**
     * Creates a cookie with the given parameters, which lives within the given domain
     * @param name - Name of the cookie
     * @param value - Value to be stored
     * @param days - Expiry days
     */
    function setCookie(name, value, days) {
        let expires = "";
        const domain = ";domain=" + extractDomainFromHost();
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + domain + "; path=/";
    }

    /**
     * Handles language change by setting the `ui_locale` cookie, and reload the page to get the content translated.
     */
    function onLangChange() {
        const langSwitchForm = document.getElementById("language-selector-input");
        const language = langSwitchForm.value;
        const EXPIRY_DAYS = 30;

        setCookie('ui_lang', language, EXPIRY_DAYS);
        window.location.reload();
    }

    function computeLocale(localeFromCookie, localeFromUrlParams, browserLocale) {
        if (localeFromCookie) {
            return localeFromCookie;
        } else if (localeFromUrlParams) {
            const firstLangFromUrlParams = localeFromUrlParams.split(" ")[0];
            return firstLangFromUrlParams;
        } else if (browserLocale) {
            return browserLocale;
        } else {
            return "en_US";
        }
    }
</script>

<link href="css/language-selector.css" rel="stylesheet">

<%
    // Specify the file path
    String filePath = application.getRealPath("/") + "/WEB-INF/classes/LanguageOptions.properties";

    // Create a List to store the parsed data
    List<String[]> languageList = new ArrayList<>();

    // Use a BufferedReader to read the file content
    try (BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath))) {
        String line;
        while ((line = bufferedReader.readLine()) != null) {
            // Ignore comments and empty lines
            if (!line.trim().startsWith("#") && !line.trim().isEmpty()) {
                // Split the line into key and value using '=' as the delimiter
                String[] keyValue = line.split("=");
                // Split the key further using '.' as the delimiter
                String[] parts = keyValue[0].split("\\.");
                String languageCode = parts[parts.length - 1];
                // Split the value further using ',' as the delimiter
                String[] values = keyValue[1].split(",");
                String country = values[0];
                String displayName = values[1];
                // Add the values to the list
                languageList.add(new String[]{languageCode, country, displayName});
            }
        }
    } catch (Exception e) {
        throw e;
    }
%>

<div id="language-selector-dropdown" class="ui fluid search selection dropdown language-selector-dropdown" data-testid="language-selector-dropdown">
    <input type="hidden" id="language-selector-input" onChange="onLangChange()" name="language-select" />
    <i class="dropdown icon"></i>
    <div id="language-selector-selected-text" class="default text">
        <%=AuthenticationEndpointUtil.i18n(resourceBundle, "select.language")%>
    </div>
    <div class="menu">
        <% for (String[] language : languageList) { %>
            <div class="item"
                 data-value="<%= language[0] %>"
                 style="background-color: var(--language-selector-background-color) !important; color: var(--language-selector-text-color) !important;"
            >
                <i class="<%= language[1] %> flag"></i>
                <%= AuthenticationEndpointUtil.i18n(resourceBundle, language[2]) %>
            </div>
        <% } %>
    </div>
</div>

