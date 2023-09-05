<%
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
        theme = (String) overrideFallbackValues.get(ACTIVE_THEME_KEY);
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
%>