<%--
  ~ Copyright (c) 2020-2024, WSO2 LLC. (http://www.wso2.com).
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

<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointUtil" %>
<%@ page import="org.wso2.carbon.identity.application.authentication.endpoint.util.EncodedControl" %>
<%@ page import="java.nio.charset.StandardCharsets" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="java.util.Calendar" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>
<%@ page import="org.owasp.encoder.Encode" %>

<%
    String uiLocaleFromURL = request.getParameter("ui_locales");
    Boolean isLocalizationParamPrioritized = StringUtils.equals("true", application.getInitParameter("isLocalizationParamPrioritized"));
%>

<script src="util/url-utils.js"></script>
<script type="text/javascript">
    if ("<%= isLocalizationParamPrioritized %>" === "true") {
        function getCookie(name) {
            const cookieMatch = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'));
            return cookieMatch ? cookieMatch[1] : null;
        }

        function setUILangCookie(name, value, days, options) {
            var expires = "";
            var domain = ";domain=" + URLUtils.getDomain(window.location.href);

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }

            var httpOnlyString = (options && options.httpOnly) ? "; HttpOnly" : "";
            var secureString = (options && options.secure) ? "; Secure" : "";

            document.cookie = name + "=" + (value || "") + expires + domain + "; path=/" + httpOnlyString + secureString;
        }

        function reconcileLocale() {
            const cookie = getCookie('ui_lang');
            const url = new URL(location.href);
            let param = "";

            if (url.searchParams.get('ui_locales')) {
                param = url.searchParams.get('ui_locales');
            } else if ("<%= Encode.forJavaScript(uiLocaleFromURL) %>") {
                param = "<%= Encode.forJavaScript(uiLocaleFromURL) %>";
            }

            const onBack = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';

            if (onBack) {
                if (cookie && param !== cookie) {
                    url.searchParams.set('ui_locales', cookie);
                    history.replaceState(null, '', url.toString());
                    location.reload();
                }
                return;
            }

            if (param && param !== cookie) {
                setUILangCookie(param);

            }
        }

        reconcileLocale();

        window.addEventListener('pageshow', e => {
            if (e.persisted) { reconcileLocale(); }
        });
    }
</script>

<%
    String lang = "en_US"; // Default lang is en_US
    String DEFAULT_LOCALE = "en_US";
    String COOKIE_NAME = "ui_lang";
    Locale browserLocale = request.getLocale();
    Locale userLocale = browserLocale;
    String uiLocaleFromURL = request.getParameter("ui_locales");
    String localeFromCookie = null;
    String BUNDLE = "org.wso2.carbon.identity.application.authentication.endpoint.i18n.Resources";

    // List of screen names for retrieving text branding customizations.
    List<String> screenNames = new ArrayList<>();
    screenNames.add("common");

    // Map to store default supported language codes.
    // TODO: Use this map to generate the `language-switcher.jsp`.
    Map<String, String> supportedLanguages = new HashMap<>();
    supportedLanguages.put("en", "US");
    supportedLanguages.put("fr", "FR");
    supportedLanguages.put("es", "ES");
    supportedLanguages.put("pt", "PT");
    supportedLanguages.put("de", "DE");
    supportedLanguages.put("zh", "CN");
    supportedLanguages.put("ja", "JP");

    List<String> languageSupportedCountries = new ArrayList<>();
    languageSupportedCountries.add("US");
    languageSupportedCountries.add("FR");
    languageSupportedCountries.add("ES");
    languageSupportedCountries.add("PT");
    languageSupportedCountries.add("DE");
    languageSupportedCountries.add("CN");
    languageSupportedCountries.add("JP");
    languageSupportedCountries.add("BR");

    // Check cookie for the user selected language first
    Cookie[] cookies = request.getCookies();
    if (cookies != null) {
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals(COOKIE_NAME)) {
                localeFromCookie = cookie.getValue();
            }
        }
    }

    // Set lang from the priority order
    if (isLocalizationParamPrioritized == true) {
        if (uiLocaleFromURL != null) {
            for (String localeStr : uiLocaleFromURL.split(" ")) {
                String langStr = "en";
                String langLocale = "US";

                if (localeStr.contains("_")) {
                    langStr = localeStr.split("_")[0];
                    langLocale = localeStr.split("_")[1];
                } else if (localeStr.contains("-")) {
                    langStr = localeStr.split("-")[0];
                    langLocale = localeStr.split("-")[1];
                }

                Locale tempLocale = new Locale(langStr, langLocale);

                // Trying to find out whether we have resource bundle for the given locale
                try {
                    ResourceBundle foundBundle = ResourceBundle.getBundle(BUNDLE, tempLocale);

                    // If so, setting the userLocale to that locale. If not, set the browser locale as user locale
                    // Currently, we only care about the language - we do not compare about country locales since our
                    // supported locale set is limited.
                    if (tempLocale.getLanguage().equals(foundBundle.getLocale().getLanguage())) {
                        userLocale = tempLocale;
                        break;
                    } else if (tempLocale.getLanguage().equals("en") && foundBundle.getLocale().getLanguage().equals("")) {
                        // When the given locale is en - which is our fallback one, we have to handle it separately because
                        // returns and empty string as locale language
                        userLocale = tempLocale;
                        break;
                    } else {
                        userLocale = browserLocale;
                    }
                } catch (Exception e) {
                    userLocale = browserLocale;
                }
            }
        } else if (localeFromCookie != null) {
            lang = localeFromCookie;

            try {
                String langStr = "en";
                String langLocale = "US";

                if (lang.contains("_")) {
                    langStr = lang.split("_")[0];
                    langLocale = lang.split("_")[1];
                } else if (lang.contains("-")) {
                    langStr = lang.split("-")[0];
                    langLocale = lang.split("-")[1];
                }

                userLocale = new Locale(langStr, langLocale);
            } catch (Exception e) {
                // In case the language is defined but not in the correct format
                userLocale = browserLocale;
            }
        } else {
            // `browserLocale` is coming as `en` instead of `en_US` for the first render before switching the language from the dropdown.
            String countryCode = browserLocale.getCountry();
            String fallbackCountryCode = supportedLanguages.get(browserLocale.getLanguage());

            if (StringUtils.isNotBlank(countryCode) && languageSupportedCountries.contains(countryCode)) {
                userLocale = new Locale(browserLocale.getLanguage(), countryCode);
            } else if (StringUtils.isNotBlank(fallbackCountryCode)){
                userLocale = new Locale(browserLocale.getLanguage(), fallbackCountryCode);
            } else {
                userLocale = new Locale("en","US");
            }
        }
    } else {
        if (localeFromCookie != null) {
            lang = localeFromCookie;

            try {
                String langStr = "en";
                String langLocale = "US";

                if (lang.contains("_")) {
                    langStr = lang.split("_")[0];
                    langLocale = lang.split("_")[1];
                } else if (lang.contains("-")) {
                    langStr = lang.split("-")[0];
                    langLocale = lang.split("-")[1];
                }

                userLocale = new Locale(langStr, langLocale);
            } catch (Exception e) {
                // In case the language is defined but not in the correct format
                userLocale = browserLocale;
            }
        } else if (uiLocaleFromURL != null) {
            for (String localeStr : uiLocaleFromURL.split(" ")) {
                String langStr = "en";
                String langLocale = "US";

                if (localeStr.contains("_")) {
                    langStr = localeStr.split("_")[0];
                    langLocale = localeStr.split("_")[1];
                } else if (localeStr.contains("-")) {
                    langStr = localeStr.split("-")[0];
                    langLocale = localeStr.split("-")[1];
                }

                Locale tempLocale = new Locale(langStr, langLocale);

                // Trying to find out whether we have resource bundle for the given locale
                try {
                    ResourceBundle foundBundle = ResourceBundle.getBundle(BUNDLE, tempLocale);

                    // If so, setting the userLocale to that locale. If not, set the browser locale as user locale
                    // Currently, we only care about the language - we do not compare about country locales since our
                    // supported locale set is limited.
                    if (tempLocale.getLanguage().equals(foundBundle.getLocale().getLanguage())) {
                        userLocale = tempLocale;
                        break;
                    } else if (tempLocale.getLanguage().equals("en") && foundBundle.getLocale().getLanguage().equals("")) {
                        // When the given locale is en - which is our fallback one, we have to handle it separately because
                        // returns and empty string as locale language
                        userLocale = tempLocale;
                        break;
                    } else {
                        userLocale = browserLocale;
                    }
                } catch (Exception e) {
                    userLocale = browserLocale;
                }
            }
        } else {
            // `browserLocale` is coming as `en` instead of `en_US` for the first render before switching the language from the dropdown.
            String countryCode = browserLocale.getCountry();
            String fallbackCountryCode = supportedLanguages.get(browserLocale.getLanguage());

            if (StringUtils.isNotBlank(countryCode) && languageSupportedCountries.contains(countryCode)) {
                userLocale = new Locale(browserLocale.getLanguage(), countryCode);
            } else if (StringUtils.isNotBlank(fallbackCountryCode)){
                userLocale = new Locale(browserLocale.getLanguage(), fallbackCountryCode);
            } else {
                userLocale = new Locale("en","US");
            }
        }   
    }

    ResourceBundle resourceBundle = ResourceBundle.getBundle(BUNDLE, userLocale, new
        EncodedControl(StandardCharsets.UTF_8.toString()));
%>

<%!
    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key) {
        return i18n(resourceBundle, customText, key, null, true);
    }

    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     * Overloaded method with default value.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @param defaultValue Default value.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key, String defaultValue) {
        return i18n(resourceBundle, customText, key, defaultValue, true);
    }

    /**
     * Get the localized string for the given key.
     * Interacts with both the `resourceBundle` & the custom text from the Branding API.
     * Overloaded method with default value with the ability to not fallback to resource bundle and return "" as default.
     *
     * @param resourceBundle Resource bundle.
     * @param customText Custom text.
     * @param key Key of the localized string.
     * @param defaultValue Default value.
     * @param shouldFallbackToResourceBundle Should fallback to resource bundle.
     * @return Localized string.
     */
    public String i18n(ResourceBundle resourceBundle, JSONObject customText, String key, String defaultValue, boolean shouldFallbackToResourceBundle) {
        String localizedString = null;
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);

        try {
            if (customText != null && customText.has(key)) {
                localizedString = Encode.forHtmlContent(customText.getString(key));
            } else {
                if (StringUtils.isNotBlank(defaultValue)) {
                    localizedString = Encode.forHtmlContent(defaultValue);
                } else if (shouldFallbackToResourceBundle) {
                    localizedString = IdentityManagementEndpointUtil.i18n(resourceBundle, key);
                } else {
                    localizedString = "";
                }
            }
        } catch (Exception e) {
            // Return the key itself as a fallback
            localizedString = Encode.forHtmlContent(key);
        }

        // Replace newline characters with actual line breaks
        localizedString = localizedString.replace("\\n", "\n");

        return localizedString.replace("{{currentYear}}", String.valueOf(currentYear));
    }

    /**
     * Replaces i18n path placeholders in a given link with locale and country codes.
     *
     * @param locale The locale from which to derive values for placeholders.
     * @param link The link containing i18n placeholders (e.g., {{lang}}, {{country}}, {{locale}}).
     * @return The link with placeholders replaced by actual values based on the given locale.
     */
    public String i18nLink(Locale locale, String link) {
        String transformedLink = link;

        try {
            String langCode = locale.getLanguage();
            String countryCode = locale.getCountry();
            String localeCode = locale.toLanguageTag();

            String LANGUAGE_PLACEHOLDER = "{{lang}}";
            String COUNTRY_PLACEHOLDER = "{{country}}";
            String LOCALE_PLACEHOLDER = "{{locale}}";

            if (transformedLink.contains(LANGUAGE_PLACEHOLDER) || transformedLink.contains(COUNTRY_PLACEHOLDER) || transformedLink.contains(LOCALE_PLACEHOLDER)) {
                transformedLink = transformedLink
                    .replace("{{lang}}", langCode)
                    .replace("{{country}}", countryCode)
                    .replace("{{locale}}", localeCode);
            } else {
                if (transformedLink.contains("?")) {
                    return transformedLink.concat("&ui_locales=" + localeCode);
                } else {
                    return transformedLink.concat("?ui_locales=" + localeCode);
                }
            }

            return StringEscapeUtils.escapeHtml4(transformedLink);
        } catch (Exception e) {
            // Return the link itself as a fallback.
            return StringEscapeUtils.escapeHtml4(transformedLink);
        }
    }
%>
