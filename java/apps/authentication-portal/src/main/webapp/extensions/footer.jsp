<%--
~ Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
~
~ This software is the property of WSO2 Inc. and its suppliers, if any.
~ Dissemination of any information or reproduction of any material contained
~ herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
~ You may not alter or remove any copyright or other notice from copies of this content."
--%>

<script src="libs/themes/default/semantic.min.js"></script>

<script type="text/javascript">
    // Automatically shows on init if the user hasn't already acknowledged cookie usage.
    $(document).ready(function () {
        // downtime-banner
        var SHOW_DOWNTIME_BANNER = false;
        
        if(SHOW_DOWNTIME_BANNER) {
            $("#downtime-banner")
            .nag("show");
        }

        if (!isCookieConsentShown()) {
            // Simply show the banner without a transition.
            // Having a opening transition will be weird when switching
            // from apps. i.e From website to login portal.
            $("#cookie-consent-banner")
                .transition({
                    animation : undefined,
                    duration  : 0
                });
        }
    });

    /**
     * Get the name of the cookie consent cookie.
     */
    function getCookieConsentCookieName() {
  
        return "accepts-cookies";
    }

    /**
     * Callback for cookie consent banner action click.
     * @param e - Click event.
     */
    function onCookieConsentClear(e) {

        var cookieString = getCookieConsentCookieName() + "=true;max-age=31536000;path=/";

        if (extractDomainFromHost()) {
            cookieString = cookieString + ";domain=" + extractDomainFromHost();
        }

        document.cookie = cookieString;

        $("#cookie-consent-banner")
            .transition({
                animation : "slide up",
                duration  : 500
            });
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
     * Checks if the cookie consent is shown.
     */
    function isCookieConsentShown() {

        var COOKIE_CONSENT_COOKIE_NAME = "accepts-cookies";
        var isShown = getCookie(COOKIE_CONSENT_COOKIE_NAME);

        if (isShown !== undefined) {
            return isShown;
        }

        return false;
    }

    /**
     * Extracts the domain from the hostname.
     * If parsing fails, undefined will be returned.
     */
    function extractDomainFromHost() {

        var domain = undefined;

        /**
        * Extract the domain from the hostname.
        * Ex: If dev.accounts.asgardeo.io is parsed, `asgardeo.io` will be set as the domain.
        */
        try {
            var hostnameTokens = window.location.hostname.split('.');

            if (hostnameTokens.length > 1) {
                domain = hostnameTokens.slice((hostnameTokens.length -2), hostnameTokens.length).join(".");
            }
        } catch(e) {
            // Couldn't parse the hostname.
        }

        return domain;
    }
</script>
