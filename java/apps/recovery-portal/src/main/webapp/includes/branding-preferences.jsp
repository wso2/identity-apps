<%--
  ~ Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

<%-- Tenant resolve JSP must be included in the calling script inorder to resolve tenant context --%>

<%@ page import="java.io.File" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.BrandingPreferenceRetrievalClient" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.client.BrandingPreferenceRetrievalClientException" %>
<%@ page import="org.wso2.carbon.identity.mgt.endpoint.util.IdentityManagementEndpointConstants" %>

<%
    JSONObject brandingPreference = null;

    boolean isBrandingEnabledInTenantPreferences = true;
    boolean isSelfSignUpEnabledInTenantPreferences = true;
    boolean isPasswordRecoveryEnabledInTenantPreferences = true;
    boolean shouldRemoveDefaultBranding = true;
    @Deprecated
    JSONObject colors = null;
    JSONObject theme = null;
    String activeThemeName = "";
    String overrideStylesheet = "";
    String copyrightText = "";
    String siteTitle = "";
    String supportEmail = "";
    String logoURL = "";
    String logoAlt = "";
    String faviconURL = "libs/themes/asgardio/assets/images/branding/favicon.ico";
    String privacyPolicyURL = "/authenticationendpoint/privacy_policy.do";
    String termsOfUseURL = "";
    String cookiePolicyURL = "/authenticationendpoint/cookie_policy.do";
    String selfSignUpOverrideURL = "";
    String passwordRecoveryOverrideURL = "";
    String layout = "centered";
    String layoutFileRelativePath = "includes/layouts/" + layout + "/body.ser";
    String styleFilePath = "includes/layouts/" + layout + "/styles.css";
    String layoutStoreURL = "extensions/layouts/custom/${tenantDomain}";
    Map<String, Object> layoutData = new HashMap<String, Object>();
    String productName = "WSO2 Identity Server";
    String productURL = "https://wso2.com/identity-server";
    String productLogoURL = "libs/themes/asgardio/assets/images/branding/logo.svg";
    String productLogoAlt = "WSO2 Identity Server Logo";
    String productWhiteLogoURL = "libs/themes/asgardio/assets/images/branding/logo-white.svg";
    String productWhiteLogoAlt = "WSO2 Identity Server Logo White Variation";

    // Preferences response object pointer keys.
    String PREFERENCE_KEY = "preference";
    String ACTIVE_THEME_KEY = "activeTheme";
    String COLORS_KEY = "colors";
    String THEME_KEY = "theme";
    String STYLESHEETS_KEY = "stylesheets";
    String ACCOUNT_APP_STYLESHEET_KEY = "accountApp";
    String ORG_DETAILS_KEY = "organizationDetails";
    String COPYRIGHT_TEXT_KEY = "copyrightText";
    String SITE_TITLE_KEY = "siteTitle";
    String SUPPORT_EMAIL_KEY = "supportEmail";
    String IMAGES_KEY = "images";
    String IMAGE_URL_KEY = "imgURL";
    String ALT_TEXT_KEY = "altText";
    String LOGO_KEY = "logo";
    String FAVICON_KEY = "favicon";
    String URLS_KEY = "urls";
    String PRIVACY_POLICY_URL_KEY = "privacyPolicyURL";
    String TERMS_OF_USE_URL_KEY = "termsOfUseURL";
    String COOKIE_POLICY_URL_KEY = "cookiePolicyURL";
    String SELF_SIGN_UP_URL_KEY = "selfSignUpURL";
    String PASSWORD_RECOVERY_URL_KEY = "passwordRecoveryURL";
    String CONFIGS_KEY = "configs";
    String IS_BRANDING_ENABLED_KEY= "isBrandingEnabled";
    String IS_SELF_SIGN_UP_ENABLED_KEY = "isSelfSignUpEnabled";
    String IS_PASSWORD_RECOVERY_ENABLED_KEY = "isPasswordRecoveryEnabled";
    String SHOULD_REMOVE_DEFAULT_BRANDING_KEY = "removeDefaultBranding";

    // Additional keys to override the fallback values.
    String PRODUCT_NAME_KEY = "productName";
    String PRODUCT_URL_KEY = "productURL";
    String PRODUCT_LOGO_URL_KEY = "productLogoURL";
    String PRODUCT_LOGO_ALT_KEY = "productLogoAlt";
    String PRODUCT_WHITE_LOGO_URL_KEY = "productWhiteLogoURL";
    String PRODUCT_WHITE_LOGO_ALT_KEY = "productWhiteLogoAlt";

    // Load the branding fallback override values file if it exists.
    if (config.getServletContext().getResource("extensions/branding-fallbacks.jsp") != null) {
%>

        <jsp:include page="/extensions/branding-fallbacks.jsp"/>

<%      
    }

    /*
        The override values are set within the request object using a Map object.
        This approach is necessary because 'branding-fallbacks.jsp' may not always exist.
        Consequently, a directive include cannot be employed; rather, an action include must be utilized.
        It ensures that the override values are accessible to this JSP page through the request object.
    */
    Map<String, Object> overrideFallbackValues = (Map<String, Object>) request.getAttribute("overrideFallbackValues");

    // Override the branding fallback values
    if (overrideFallbackValues != null) {
        // Configs
        if (overrideFallbackValues.containsKey(IS_BRANDING_ENABLED_KEY)) {
            isBrandingEnabledInTenantPreferences = (boolean) overrideFallbackValues.get(IS_BRANDING_ENABLED_KEY);
        }

        if (overrideFallbackValues.containsKey(IS_SELF_SIGN_UP_ENABLED_KEY)) {
            isSelfSignUpEnabledInTenantPreferences = (boolean) overrideFallbackValues.get(IS_SELF_SIGN_UP_ENABLED_KEY);
        }

        if (overrideFallbackValues.containsKey(IS_PASSWORD_RECOVERY_ENABLED_KEY)) {
            isPasswordRecoveryEnabledInTenantPreferences = (boolean) overrideFallbackValues.get(IS_PASSWORD_RECOVERY_ENABLED_KEY);
        }

        if (overrideFallbackValues.containsKey(SHOULD_REMOVE_DEFAULT_BRANDING_KEY)) {
            shouldRemoveDefaultBranding = (boolean) overrideFallbackValues.get(SHOULD_REMOVE_DEFAULT_BRANDING_KEY);
        }

        // Colors.
        // @deprecated Moved in to `theme` object. Kept here for backward compatibility.
        if (overrideFallbackValues.containsKey(COLORS_KEY)) {
            colors = (JSONObject) overrideFallbackValues.get(COLORS_KEY);
        }

        // Theme
        if (overrideFallbackValues.containsKey(THEME_KEY)) {
            theme = (JSONObject) overrideFallbackValues.get(THEME_KEY);
        }

        if (overrideFallbackValues.containsKey(ACTIVE_THEME_KEY)) {
            activeThemeName = (String) overrideFallbackValues.get(ACTIVE_THEME_KEY);
        }
        
        // Product details
        if (overrideFallbackValues.containsKey(PRODUCT_NAME_KEY)) {
            productName = (String) overrideFallbackValues.get(PRODUCT_NAME_KEY);
        }

        if (overrideFallbackValues.containsKey(PRODUCT_URL_KEY)) {
            productURL = (String) overrideFallbackValues.get(PRODUCT_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(PRODUCT_LOGO_URL_KEY)) {
            productLogoURL = (String) overrideFallbackValues.get(PRODUCT_LOGO_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(PRODUCT_LOGO_ALT_KEY)) {
            productLogoAlt = (String) overrideFallbackValues.get(PRODUCT_LOGO_ALT_KEY);
        }

        if (overrideFallbackValues.containsKey(PRODUCT_WHITE_LOGO_URL_KEY)) {
            productWhiteLogoURL = (String) overrideFallbackValues.get(PRODUCT_WHITE_LOGO_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(PRODUCT_WHITE_LOGO_ALT_KEY)) {
            productWhiteLogoAlt = (String) overrideFallbackValues.get(PRODUCT_WHITE_LOGO_ALT_KEY);
        }

        // Stylesheets
        if (overrideFallbackValues.containsKey(ACCOUNT_APP_STYLESHEET_KEY)) {
            overrideStylesheet = (String) overrideFallbackValues.get(ACCOUNT_APP_STYLESHEET_KEY);
        }

        // Organization Details
        if (overrideFallbackValues.containsKey(COPYRIGHT_TEXT_KEY)) {
            copyrightText = (String) overrideFallbackValues.get(COPYRIGHT_TEXT_KEY);
        }

        if (overrideFallbackValues.containsKey(SITE_TITLE_KEY)) {
            siteTitle = (String) overrideFallbackValues.get(SITE_TITLE_KEY);
        }

        if (overrideFallbackValues.containsKey(SUPPORT_EMAIL_KEY)) {
            supportEmail = (String) overrideFallbackValues.get(SUPPORT_EMAIL_KEY);
        }

        // Images
        if (overrideFallbackValues.containsKey(FAVICON_KEY)) {
            faviconURL = (String) overrideFallbackValues.get(FAVICON_KEY);
        }

        // Links
        if (overrideFallbackValues.containsKey(PRIVACY_POLICY_URL_KEY)) {
            privacyPolicyURL = (String) overrideFallbackValues.get(PRIVACY_POLICY_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(TERMS_OF_USE_URL_KEY)) {
            termsOfUseURL = (String) overrideFallbackValues.get(TERMS_OF_USE_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(COOKIE_POLICY_URL_KEY)) {
            cookiePolicyURL = (String) overrideFallbackValues.get(COOKIE_POLICY_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(SELF_SIGN_UP_URL_KEY)) {
            selfSignUpOverrideURL = (String) overrideFallbackValues.get(SELF_SIGN_UP_URL_KEY);
        }

        if (overrideFallbackValues.containsKey(PASSWORD_RECOVERY_URL_KEY)) {
            passwordRecoveryOverrideURL = (String) overrideFallbackValues.get(PASSWORD_RECOVERY_URL_KEY);
        }        
    }

    String DEFAULT_RESOURCE_LOCALE = "en-US";
    String ORG_PREFERENCE_RESOURCE_TYPE = "ORG";
    String APP_PREFERENCE_RESOURCE_TYPE = "APP";
    String preferenceResourceType = ORG_PREFERENCE_RESOURCE_TYPE;
    String tenantRequestingPreferences = tenantForTheming;
    String applicationRequestingPreferences = spAppName;

    try {

        // If the `sp` param is defined, set the resource type as app.
        if (StringUtils.isNotBlank(applicationRequestingPreferences)) {
            preferenceResourceType = APP_PREFERENCE_RESOURCE_TYPE;
        }

        BrandingPreferenceRetrievalClient brandingPreferenceRetrievalClient = new BrandingPreferenceRetrievalClient();
        JSONObject brandingPreferenceResponse = brandingPreferenceRetrievalClient.getPreference(tenantRequestingPreferences,
                preferenceResourceType, applicationRequestingPreferences, DEFAULT_RESOURCE_LOCALE);

        if (brandingPreferenceResponse.has(PREFERENCE_KEY)) {
            brandingPreference = brandingPreferenceResponse.getJSONObject(PREFERENCE_KEY);
        }

%>

<%@include file="layout-resolver.jsp" %>

<%

        // Proceed only if `preferences` object is defined.
        if (brandingPreference != null) {
            // First, check if Branding is enabled.
            if (brandingPreference.has(CONFIGS_KEY)) {
                if (brandingPreference.getJSONObject(CONFIGS_KEY).has(IS_BRANDING_ENABLED_KEY)) {
                    isBrandingEnabledInTenantPreferences = brandingPreference.getJSONObject(CONFIGS_KEY).getBoolean(IS_BRANDING_ENABLED_KEY);
                }
            }

            // Proceed only if the branding is enabled.
            if (isBrandingEnabledInTenantPreferences) {
                // Configs
                if (brandingPreference.has(CONFIGS_KEY)) {
                    if (brandingPreference.getJSONObject(CONFIGS_KEY).has(IS_SELF_SIGN_UP_ENABLED_KEY)) {
                        isSelfSignUpEnabledInTenantPreferences = brandingPreference.getJSONObject(CONFIGS_KEY).getBoolean(IS_SELF_SIGN_UP_ENABLED_KEY);
                    }

                    if (brandingPreference.getJSONObject(CONFIGS_KEY).has(IS_PASSWORD_RECOVERY_ENABLED_KEY)) {
                        isPasswordRecoveryEnabledInTenantPreferences = brandingPreference.getJSONObject(CONFIGS_KEY).getBoolean(IS_PASSWORD_RECOVERY_ENABLED_KEY);
                    }

                    if (brandingPreference.getJSONObject(CONFIGS_KEY).has(SHOULD_REMOVE_DEFAULT_BRANDING_KEY)) {
                        shouldRemoveDefaultBranding = brandingPreference.getJSONObject(CONFIGS_KEY).getBoolean(SHOULD_REMOVE_DEFAULT_BRANDING_KEY);
                    }
                }

                // Colors.
                // @deprecated Moved in to `theme` object. Kept here for backward compatibility.
                if (brandingPreference.has(COLORS_KEY)) {
                    colors = brandingPreference.getJSONObject(COLORS_KEY);
                }

                // Theme
                if (brandingPreference.has(THEME_KEY)) {
                    if (brandingPreference.getJSONObject(THEME_KEY).has(ACTIVE_THEME_KEY)) {
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(THEME_KEY).getString(ACTIVE_THEME_KEY))) {
                            activeThemeName = brandingPreference.getJSONObject(THEME_KEY).getString(ACTIVE_THEME_KEY);

                            if (brandingPreference.getJSONObject(THEME_KEY).has(activeThemeName)
                                && brandingPreference.getJSONObject(THEME_KEY).getJSONObject(activeThemeName) != null) {

                                theme = brandingPreference.getJSONObject(THEME_KEY).getJSONObject(activeThemeName);

                                if (theme.has(IMAGES_KEY) && theme.getJSONObject(IMAGES_KEY) != null) {
                                    if (theme.getJSONObject(IMAGES_KEY).has(LOGO_KEY) && theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY) != null) {
                                        if (theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).has(IMAGE_URL_KEY)
                                            && !StringUtils.isBlank(theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(IMAGE_URL_KEY))) {

                                            logoURL = theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(IMAGE_URL_KEY);
                                        }
                                        if (theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).has(ALT_TEXT_KEY)
                                            && !StringUtils.isBlank(theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(ALT_TEXT_KEY))) {

                                            logoAlt = theme.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(ALT_TEXT_KEY);
                                        }
                                    }
                                    if (theme.getJSONObject(IMAGES_KEY).has(FAVICON_KEY) && theme.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY) != null) {
                                        if (theme.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).has(IMAGE_URL_KEY)
                                            && !StringUtils.isBlank(theme.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).getString(IMAGE_URL_KEY))) {

                                            faviconURL = theme.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).getString(IMAGE_URL_KEY);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Stylesheets
                if (brandingPreference.has(STYLESHEETS_KEY)) {
                    if (brandingPreference.getJSONObject(STYLESHEETS_KEY).has(ACCOUNT_APP_STYLESHEET_KEY)) {
                        // Only assign the `stylesheet` from response if not empty.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(STYLESHEETS_KEY).getString(ACCOUNT_APP_STYLESHEET_KEY))) {
                            overrideStylesheet = brandingPreference.getJSONObject(STYLESHEETS_KEY).getString(ACCOUNT_APP_STYLESHEET_KEY);
                        }
                    }
                }

                // Organization Details
                if (brandingPreference.has(ORG_DETAILS_KEY)) {
                    if (brandingPreference.getJSONObject(ORG_DETAILS_KEY).has(COPYRIGHT_TEXT_KEY)) {
                        // Only assign the `copyright` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(COPYRIGHT_TEXT_KEY))) {
                            copyrightText = brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(COPYRIGHT_TEXT_KEY);
                        }
                    }

                    if (brandingPreference.getJSONObject(ORG_DETAILS_KEY).has(SITE_TITLE_KEY)) {
                        // Only assign the `siteTitle` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(SITE_TITLE_KEY))) {
                            siteTitle = brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(SITE_TITLE_KEY);
                        }
                    }

                    if (brandingPreference.getJSONObject(ORG_DETAILS_KEY).has(SUPPORT_EMAIL_KEY)) {
                        // Only assign the `supportEmail` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(SUPPORT_EMAIL_KEY))) {
                            supportEmail = brandingPreference.getJSONObject(ORG_DETAILS_KEY).getString(SUPPORT_EMAIL_KEY);
                        }
                    }
                }

                // Images
                if (brandingPreference.has(IMAGES_KEY)) {
                    if (brandingPreference.getJSONObject(IMAGES_KEY).has(LOGO_KEY)) {
                        if (brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).has(IMAGE_URL_KEY)) {
                            // Only assign the `logoURL` from response if not empty. Else use the default value.
                            if (!StringUtils.isBlank(brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(IMAGE_URL_KEY))) {
                                logoURL = brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(IMAGE_URL_KEY);
                            }
                        }

                        if (brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).has(ALT_TEXT_KEY)) {
                            // Only assign the `logoAlt` from response if not empty. Else use the default value.
                            if (!StringUtils.isBlank(brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(ALT_TEXT_KEY))) {
                                logoAlt = brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(LOGO_KEY).getString(ALT_TEXT_KEY);
                            }
                        }
                    }

                    if (brandingPreference.getJSONObject(IMAGES_KEY).has(FAVICON_KEY)) {
                        if (brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).has(IMAGE_URL_KEY)) {
                            // Only assign the `faviconURL` from response if not empty. Else use the default value.
                            if (!StringUtils.isBlank(brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).getString(IMAGE_URL_KEY))) {
                                faviconURL = brandingPreference.getJSONObject(IMAGES_KEY).getJSONObject(FAVICON_KEY).getString(IMAGE_URL_KEY);
                            }
                        }
                    }
                }

                // Links
                if (brandingPreference.has(URLS_KEY)) {
                    if (brandingPreference.getJSONObject(URLS_KEY).has(PRIVACY_POLICY_URL_KEY)) {
                        // Only assign the `privacyPolicyURL` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(URLS_KEY).getString(PRIVACY_POLICY_URL_KEY))) {
                            privacyPolicyURL = brandingPreference.getJSONObject(URLS_KEY).getString(PRIVACY_POLICY_URL_KEY);
                        }
                    }

                    if (brandingPreference.getJSONObject(URLS_KEY).has(TERMS_OF_USE_URL_KEY)) {
                        // Only assign the `termsOfUseURL` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(URLS_KEY).getString(TERMS_OF_USE_URL_KEY))) {
                            termsOfUseURL = brandingPreference.getJSONObject(URLS_KEY).getString(TERMS_OF_USE_URL_KEY);
                        }
                    }

                    if (brandingPreference.getJSONObject(URLS_KEY).has(COOKIE_POLICY_URL_KEY)) {
                        // Only assign the `cookiePolicyURL` from response if not empty. Else use the default value.
                        if (!StringUtils.isBlank(brandingPreference.getJSONObject(URLS_KEY).getString(COOKIE_POLICY_URL_KEY))) {
                            cookiePolicyURL = brandingPreference.getJSONObject(URLS_KEY).getString(COOKIE_POLICY_URL_KEY);
                        }
                    }

                    if (brandingPreference.getJSONObject(URLS_KEY).has(SELF_SIGN_UP_URL_KEY)) {
                        selfSignUpOverrideURL = brandingPreference.getJSONObject(URLS_KEY).getString(SELF_SIGN_UP_URL_KEY);
                    }

                    if (brandingPreference.getJSONObject(URLS_KEY).has(PASSWORD_RECOVERY_URL_KEY)) {
                        passwordRecoveryOverrideURL = brandingPreference.getJSONObject(URLS_KEY).getString(PASSWORD_RECOVERY_URL_KEY);
                    }
                }

            }
        }
        
    } catch (BrandingPreferenceRetrievalClientException e) {
        // Exception is ignored and the variable will use the fallbacks.
        // TODO: Move the duplicated logic to a common place.
    } finally {

        // Set fallbacks.
        if (StringUtils.isEmpty(logoURL)) {
            if (StringUtils.isEmpty(activeThemeName)) {
                logoURL = productLogoURL;
            } else if (StringUtils.equalsIgnoreCase(activeThemeName, "DARK")) {
                logoURL = productWhiteLogoURL;
            } else {
                logoURL = productLogoURL;
            }
        }

        if (StringUtils.isEmpty(logoAlt)) {
            if (StringUtils.isEmpty(activeThemeName)) {
                logoAlt = productLogoAlt;
            } else if (StringUtils.equalsIgnoreCase(activeThemeName, "DARK")) {
                logoAlt = productWhiteLogoAlt;
            } else {
                logoAlt = productLogoAlt;
            }
        }
    }
%>
