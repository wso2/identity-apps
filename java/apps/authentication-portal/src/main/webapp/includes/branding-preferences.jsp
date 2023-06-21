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
<%@ page import="java.io.FileReader" %>
<%@ page import="java.io.FileNotFoundException" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="org.json.JSONObject" %>
<%@ page import="org.json.JSONTokener" %>
<%@ page import="org.json.JSONException" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
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
    String faviconURL = "";
    String privacyPolicyURL = "privacy_policy.do";
    String termsOfUseURL = "";
    String cookiePolicyURL = "cookie_policy.do";
    String selfSignUpOverrideURL = "";
    String passwordRecoveryOverrideURL = "";
    String layout = "default";
    String layoutFileRelativePath = "includes/layouts/default/body.ser";
    String customLayoutFileRelativeBasePath = "";
    Map<String, Object> layoutData = new HashMap<String, Object>();
    String productName = "WSO2 Identity Server";

    try {

        String tenantRequestingPreferences = tenantForTheming;
        String applicationRequestingPreferences = spAppName;
        String brandingPreferenceFilePath = "";

        // If the `sp` param is defined, the resource is an app.
        if (StringUtils.isNotBlank(applicationRequestingPreferences) && StringUtils.isNotBlank(tenantRequestingPreferences)) {
            // TODO: Get the selected locale and check for the localization file.
            String appWiseBrandingPreferenceFilePath = getServletContext().getRealPath("extensions/branding/" + tenantRequestingPreferences + "/" + "apps" + "/" + applicationRequestingPreferences + "/branding-preference_en_US.json");

            File appWiseBrandingPreferenceFile = new File(appWiseBrandingPreferenceFilePath);

            if (appWiseBrandingPreferenceFile.exists()) {
                brandingPreferenceFilePath = appWiseBrandingPreferenceFilePath;
                customLayoutFileRelativeBasePath = "extensions/branding/" + tenantRequestingPreferences + "/" + "apps" + "/" + applicationRequestingPreferences + "/layouts";
            }
        }

        if (StringUtils.isNotBlank(tenantRequestingPreferences)) {

            JSONObject brandingPreferenceResponse = null;

            if (StringUtils.isBlank(brandingPreferenceFilePath)) {
                String tenantWiseBrandingPreferenceFilePath = getServletContext().getRealPath("extensions/branding/" + tenantRequestingPreferences + "/branding-preference_en_US.json");
                File tenantWiseBrandingPreferenceFile = new File(tenantWiseBrandingPreferenceFilePath);

                if (tenantWiseBrandingPreferenceFile.exists()) {
                    brandingPreferenceFilePath = tenantWiseBrandingPreferenceFilePath;
                    customLayoutFileRelativeBasePath = "extensions/branding/" + tenantRequestingPreferences + "/layouts";
                }
            }

            if (StringUtils.isNotBlank(brandingPreferenceFilePath)) {
                try {
                    JSONTokener tokener = new JSONTokener(new FileReader(brandingPreferenceFilePath));
                    JSONObject jsonObject = new JSONObject(tokener);
                    brandingPreferenceResponse = jsonObject;
                } catch (JSONException e) {
                    e.printStackTrace();
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }
            }

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

            if (brandingPreferenceResponse != null && brandingPreferenceResponse.has(PREFERENCE_KEY)) {
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
        }
    } catch (Exception e) {
        // Exception is ignored and the variable will use the fallbacks.
        // TODO: Move the duplicated logic to a common place.
    } finally {

        // Set fallbacks.
        if (StringUtils.isEmpty(logoURL)) {
            if (StringUtils.isEmpty(activeThemeName)) {
                logoURL = "libs/themes/default/assets/images/branding/logo.svg";
            } else if (StringUtils.equalsIgnoreCase(activeThemeName, "DARK")) {
                logoURL = "libs/themes/default/assets/images/branding/logo.svg";
            } else {
                logoURL = "libs/themes/default/assets/images/branding/logo.svg";
            }
        }

        if (StringUtils.isEmpty(logoAlt)) {
            if (StringUtils.isEmpty(activeThemeName)) {
                logoAlt = "WSO2 Identity Server Logo";
            } else if (StringUtils.equalsIgnoreCase(activeThemeName, "DARK")) {
                logoAlt = "WSO2 Identity Server Logo White Variation";
            } else {
                logoAlt = "WSO2 Identity Server Logo";
            }
        }

        if (StringUtils.isEmpty(faviconURL)) {
            faviconURL = "libs/themes/default/assets/images/branding/favicon.ico";
        }
    }
%>
