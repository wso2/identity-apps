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

<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>

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
        const localeFromUrlParams = urlParams.get('ui_locales');
        const computedLocale = computeLocale(localeFromCookie, localeFromUrlParams);

        languageSelectionInput.val(computedLocale);

        const dataOption = $( "div[data-value='" + computedLocale + "']" );
        dataOption.addClass("active selected")

        selectedLanguageText.removeClass("default");
        selectedLanguageText.html(dataOption.html());
    });

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     */
    function extractDomainFromHost() {
        let domain = undefined;
        /**
         * Extract the domain from the hostname.
         * Ex: If dev.accounts.asgardeo.io is parsed, `asgardeo.io` will be set as the domain.
         */
        try {
            let hostnameTokens = window.location.hostname.split('.');
            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length -2), hostnameTokens.length).join(".");
            }
        } catch(e) {
            // Couldn't parse the hostname.
        }
        return domain;
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

    function computeLocale(localeFromCookie, localeFromUrlParams) {
        if (localeFromCookie) {
            return localeFromCookie;
        } else if (localeFromUrlParams) {
            const firstLangFromUrlParams = localeFromUrlParams.split(" ")[0];
            return firstLangFromUrlParams;
        } else {
            return "en_US";
        }
    }
</script>


<div id="language-selector-dropdown"
     class="ui fluid search selection dropdown"
     data-testid="language-selector-dropdown"
>
    <input type="hidden"
           id="language-selector-input"
           onChange="onLangChange()"
           name="language-select"
    />
    <i class="dropdown icon"></i>
    <div id="language-selector-selected-text" class="default text">
        <%=IdentityManagementEndpointUtil.i18n(recoveryResourceBundle, "select.language")%>
    </div>
    <div class="menu">
        <div class="item" data-value="en_US">
            <i class="us flag"></i>
            English - United States
        </div>

        <div class="item" data-value="fr_FR">
            <i class="fr flag"></i>
            French - France
        </div>
    </div>
</div>
