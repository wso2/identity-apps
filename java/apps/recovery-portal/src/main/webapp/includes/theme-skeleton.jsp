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

<%@ page import="org.json.JSONObject" %>
<%@ page import="org.apache.commons.lang.StringUtils" %>
<%@ page import="org.apache.commons.text.StringEscapeUtils" %>

<%-- Include tenant context --%>
<jsp:directive.include file="../tenant-resolve.jsp"/>

<%-- Branding Preferences --%>
<jsp:directive.include file="branding-preferences.jsp"/>

<%
    String externalConnectionButtonBaseBackgroundColor = "";
    String externalConnectionButtonBaseBorderRadius = "";
    String externalConnectionButtonBaseFontColor = "";
    String primaryColorMain = "";
    String secondaryColorMain = "";
    String bodyBackgroundColorMain = "";
    String surfaceBackgroundColorMain = "";
    String surfaceBackgroundColorLight = "";
    String surfaceBackgroundColorDark = "";
    String surfaceBackgroundColorInverted = "";
    String outlinedComponentDefaultBorderColor = "";
    String primaryIllustrationColorMain = "";
    String secondaryIllustrationColorMain = "";
    String accent1IllustrationColorMain = "";
    String accent2IllustrationColorMain = "";
    String accent3IllustrationColorMain = "";
    String neutralAlertColorMain = "#f8f8f9";
    String infoAlertColorMain = "#eff7fd";
    String warningAlertColorMain = "#fff6e7";
    String errorAlertColorMain = "#ffd8d8";
    String primaryTextColor = "";
    String secondaryTextColor = "";
    String loginPageBackgroundColor = "";
    String loginPageFontColor = "";
    String footerBorderColor = "";
    String footerFontColor = "inherit";
    String headingFontColor = "inherit";
    String inputBaseBackgroundColor = "";
    String inputBaseBorderColor = "";
    String inputBaseBorderRadius = "";
    String inputBaseFontColor = "inherit";
    String inputBaseLabelFontColor = "inherit";
    String loginBoxBackgroundColor = "";
    String loginBoxBorderColor = "";
    String loginBoxBorderRadius = "";
    String loginBoxBorderWidth = "";
    String loginBoxFontColor = "inherit";
    String primaryButtonBaseFontColor = "";
    String primaryButtonBaseBorderRadius = "";
    String secondaryButtonBaseFontColor = "";
    String secondaryButtonBaseBorderRadius = "";
    String typographyFontFamily = "";
    String typographyFontFamilyImportURL = "";

    // Preferences response object pointer keys.
    String ELEMENT_STATE_BASE_KEY = "base";
    String BUTTONS_KEY = "buttons";
    String BUTTONS_PRIMARY_KEY = "primary";
    String BUTTONS_SECONDARY_KEY = "secondary";
    String BUTTONS_EXTERNAL_CONNECTION_KEY = "externalConnection";
    String COLORS_KEY = "colors";
    String COLORS_PRIMARY_KEY = "primary";
    String COLORS_SECONDARY_KEY = "secondary";
    String COLORS_BACKGROUND_KEY = "background";
    String COLORS_OUTLINED_KEY = "outlined";
    String COLORS_BACKGROUND_BODY_KEY = "body";
    String COLORS_BACKGROUND_SURFACE_KEY = "surface";
    String COLORS_TEXT_KEY = "text";
    String COLORS_ALERTS_KEY = "alerts";
    String COLORS_ILLUSTRATIONS_KEY = "illustrations";
    String COLORS_ALERTS_NEUTRAL_KEY = "neutral";
    String COLORS_ALERTS_INFO_KEY = "info";
    String COLORS_ALERTS_WARNING_KEY = "warning";
    String COLORS_ALERTS_ERROR_KEY = "error";
    String COLORS_MAIN_VARIANT_KEY = "main";
    String COLORS_LIGHT_VARIANT_KEY = "light";
    String COLORS_DARK_VARIANT_KEY = "dark";
    String COLORS_INVERTED_VARIANT_KEY = "inverted";
    String COLORS_DEFAULT_VARIANT_KEY = "default";
    String COLORS_PRIMARY_VARIANT_KEY = "primary";
    String COLORS_SECONDARY_VARIANT_KEY = "secondary";
    String COLORS_ACCENT1_VARIANT_KEY = "accent1";
    String COLORS_ACCENT2_VARIANT_KEY = "accent2";
    String COLORS_ACCENT3_VARIANT_KEY = "accent3";
    String FOOTER_KEY = "footer";
    String LOGIN_BOX_KEY = "loginBox";
    /* @deprecated Renamed to loginPage */
    String PAGE_KEY = "page";
    String LOGIN_PAGE_KEY = "loginPage";
    String BACKGROUND_KEY = "background";
    String BACKGROUND_COLOR_KEY = "backgroundColor";
    String BORDER_KEY = "border";
    String BORDER_COLOR_KEY = "borderColor";
    String BORDER_RADIUS_KEY = "borderRadius";
    String BORDER_WIDTH_KEY = "borderWidth";
    String FONT_KEY = "font";
    String FONT_COLOR_KEY = "color";
    String FONT_FAMILY_KEY = "fontFamily";
    String FONT_FAMILY_IMPORT_URL = "importURL";
    String HEADING_KEY = "heading";
    String INPUTS_KEY = "inputs";
    String INPUT_LABELS_KEY = "labels";
    String TYPOGRAPHY_KEY = "typography";

    // Extract the attributes from the `theme` object.
    // If null, check for `colors` object to check if the user is on the deprecated document version.
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
                if (colorPalette.has(COLORS_SECONDARY_KEY)) {
                    JSONObject secondary = colorPalette.optJSONObject(COLORS_SECONDARY_KEY);

                    if (secondary != null) {
                        if (secondary.has(COLORS_MAIN_VARIANT_KEY)
                            && !StringUtils.isBlank(secondary.getString(COLORS_MAIN_VARIANT_KEY))) {

                            secondaryColorMain = secondary.getString(COLORS_MAIN_VARIANT_KEY);
                        }
                    } else if (!StringUtils.isBlank(colorPalette.getString(COLORS_SECONDARY_KEY))) {
                        secondaryColorMain = colorPalette.getString(COLORS_SECONDARY_KEY);
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
                        if (background.has(COLORS_BACKGROUND_SURFACE_KEY)) {
                            JSONObject surface = background.optJSONObject(COLORS_BACKGROUND_SURFACE_KEY);

                            if (surface != null) {
                                if (surface.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(surface.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    surfaceBackgroundColorMain = surface.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                                if (surface.has(COLORS_LIGHT_VARIANT_KEY)
                                    && !StringUtils.isBlank(surface.getString(COLORS_LIGHT_VARIANT_KEY))) {

                                    surfaceBackgroundColorLight = surface.getString(COLORS_LIGHT_VARIANT_KEY);
                                }
                                if (surface.has(COLORS_DARK_VARIANT_KEY)
                                    && !StringUtils.isBlank(surface.getString(COLORS_DARK_VARIANT_KEY))) {

                                    surfaceBackgroundColorDark = surface.getString(COLORS_DARK_VARIANT_KEY);
                                }
                                if (surface.has(COLORS_INVERTED_VARIANT_KEY)
                                    && !StringUtils.isBlank(surface.getString(COLORS_INVERTED_VARIANT_KEY))) {

                                    surfaceBackgroundColorInverted = surface.getString(COLORS_INVERTED_VARIANT_KEY);
                                }
                            }
                        }
                    }
                }
                if (colorPalette.has(COLORS_OUTLINED_KEY)) {
                    JSONObject outlined = colorPalette.optJSONObject(COLORS_OUTLINED_KEY);

                    if (outlined != null) {
                        if (outlined.has(COLORS_DEFAULT_VARIANT_KEY)
                            && !StringUtils.isBlank(outlined.getString(COLORS_DEFAULT_VARIANT_KEY))) {

                            outlinedComponentDefaultBorderColor = outlined.getString(COLORS_DEFAULT_VARIANT_KEY);
                        }
                    }
                }
                if (colorPalette.has(COLORS_TEXT_KEY)) {
                    JSONObject text = colorPalette.optJSONObject(COLORS_TEXT_KEY);

                    if (text != null) {
                        if (text.has(COLORS_PRIMARY_VARIANT_KEY)
                            && !StringUtils.isBlank(text.getString(COLORS_PRIMARY_VARIANT_KEY))) {

                            primaryTextColor = text.getString(COLORS_PRIMARY_VARIANT_KEY);
                        }
                        if (text.has(COLORS_SECONDARY_VARIANT_KEY)
                            && !StringUtils.isBlank(text.getString(COLORS_SECONDARY_VARIANT_KEY))) {

                            secondaryTextColor = text.getString(COLORS_SECONDARY_VARIANT_KEY);
                        }
                    }
                }
                if (colorPalette.has(COLORS_ALERTS_KEY)) {
                    JSONObject alerts = colorPalette.optJSONObject(COLORS_ALERTS_KEY);

                    if (alerts != null) {
                        if (alerts.has(COLORS_ALERTS_NEUTRAL_KEY)) {
                            JSONObject neutralAlert = alerts.optJSONObject(COLORS_ALERTS_NEUTRAL_KEY);

                            if (neutralAlert != null) {
                                if (neutralAlert.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(neutralAlert.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    neutralAlertColorMain = neutralAlert.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (alerts.has(COLORS_ALERTS_INFO_KEY)) {
                            JSONObject infoAlert = alerts.optJSONObject(COLORS_ALERTS_INFO_KEY);

                            if (infoAlert != null) {
                                if (infoAlert.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(infoAlert.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    infoAlertColorMain = infoAlert.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (alerts.has(COLORS_ALERTS_WARNING_KEY)) {
                            JSONObject warningAlert = alerts.optJSONObject(COLORS_ALERTS_WARNING_KEY);

                            if (warningAlert != null) {
                                if (warningAlert.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(warningAlert.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    warningAlertColorMain = warningAlert.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (alerts.has(COLORS_ALERTS_ERROR_KEY)) {
                            JSONObject errorAlert = alerts.optJSONObject(COLORS_ALERTS_ERROR_KEY);

                            if (errorAlert != null) {
                                if (errorAlert.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(errorAlert.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    errorAlertColorMain = errorAlert.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                    }
                }
                if (colorPalette.has(COLORS_ILLUSTRATIONS_KEY)) {
                    JSONObject illustrations = colorPalette.optJSONObject(COLORS_ILLUSTRATIONS_KEY);

                    if (illustrations != null) {
                        if (illustrations.has(COLORS_PRIMARY_VARIANT_KEY)) {
                            JSONObject primary = illustrations.optJSONObject(COLORS_PRIMARY_VARIANT_KEY);

                            if (primary != null) {
                                if (primary.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(primary.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    primaryIllustrationColorMain = primary.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (illustrations.has(COLORS_SECONDARY_VARIANT_KEY)) {
                            JSONObject secondary = illustrations.optJSONObject(COLORS_SECONDARY_VARIANT_KEY);

                            if (secondary != null) {
                                if (secondary.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(secondary.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    secondaryIllustrationColorMain = secondary.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (illustrations.has(COLORS_ACCENT1_VARIANT_KEY)) {
                            JSONObject accent1 = illustrations.optJSONObject(COLORS_ACCENT1_VARIANT_KEY);

                            if (accent1 != null) {
                                if (accent1.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(accent1.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    accent1IllustrationColorMain = accent1.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (illustrations.has(COLORS_ACCENT2_VARIANT_KEY)) {
                            JSONObject accent2 = illustrations.optJSONObject(COLORS_ACCENT2_VARIANT_KEY);

                            if (accent2 != null) {
                                if (accent2.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(accent2.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    accent2IllustrationColorMain = accent2.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                        if (illustrations.has(COLORS_ACCENT3_VARIANT_KEY)) {
                            JSONObject accent3 = illustrations.optJSONObject(COLORS_ACCENT3_VARIANT_KEY);

                            if (accent3 != null) {
                                if (accent3.has(COLORS_MAIN_VARIANT_KEY)
                                    && !StringUtils.isBlank(accent3.getString(COLORS_MAIN_VARIANT_KEY))) {

                                    accent3IllustrationColorMain = accent3.getString(COLORS_MAIN_VARIANT_KEY);
                                }
                            }
                        }
                    }
                }
            }
        }

        if (theme.has(PAGE_KEY)) {

            JSONObject pageBody = theme.optJSONObject(PAGE_KEY);

            if (theme.has(LOGIN_PAGE_KEY)) {
                pageBody = theme.optJSONObject(LOGIN_PAGE_KEY);
            }

            if (pageBody != null) {
                if (pageBody.has(BACKGROUND_KEY)
                    && pageBody.getJSONObject(BACKGROUND_KEY).has(BACKGROUND_COLOR_KEY)
                    && !StringUtils.isBlank(pageBody.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY))) {

                    loginPageBackgroundColor = pageBody.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY);
                }
                if (pageBody.has(FONT_KEY)
                    && pageBody.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(pageBody.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    loginPageFontColor = pageBody.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                }
            }
        }

        if (theme.has(FOOTER_KEY)) {

            JSONObject footer = theme.optJSONObject(FOOTER_KEY);

            if (footer != null) {
                if (footer.has(BORDER_KEY)
                    && footer.getJSONObject(BORDER_KEY).has(BORDER_COLOR_KEY)
                    && !StringUtils.isBlank(footer.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY))) {

                    footerBorderColor = footer.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY);
                }
                if (footer.has(FONT_KEY)
                    && footer.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(footer.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    footerFontColor = footer.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
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
                if (typography.has(HEADING_KEY)
                    && typography.getJSONObject(HEADING_KEY).has(FONT_KEY)
                    && typography.getJSONObject(HEADING_KEY).getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(typography.getJSONObject(HEADING_KEY).getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    headingFontColor = typography.getJSONObject(HEADING_KEY).getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                }
            }
        }

        if (theme.has(BUTTONS_KEY)) {

            JSONObject buttons = theme.optJSONObject(BUTTONS_KEY);

            if (buttons != null) {
                if (buttons.has(BUTTONS_PRIMARY_KEY)) {

                    JSONObject primaryButton = buttons.getJSONObject(BUTTONS_PRIMARY_KEY);

                    if (primaryButton.has(ELEMENT_STATE_BASE_KEY)) {

                        JSONObject primaryButtonBase = primaryButton.getJSONObject(ELEMENT_STATE_BASE_KEY);

                        if (primaryButtonBase.has(BORDER_KEY)
                            && primaryButtonBase.getJSONObject(BORDER_KEY).has(BORDER_RADIUS_KEY)
                            && !StringUtils.isBlank(primaryButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY))) {

                            primaryButtonBaseBorderRadius = primaryButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY);
                        }
                        if (primaryButtonBase.has(FONT_KEY)
                            && primaryButtonBase.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                            && !StringUtils.isBlank(primaryButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                            primaryButtonBaseFontColor = primaryButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                        }
                    }
                }
                if (buttons.has(BUTTONS_SECONDARY_KEY)) {

                    JSONObject secondaryButton = buttons.getJSONObject(BUTTONS_SECONDARY_KEY);

                    if (secondaryButton.has(ELEMENT_STATE_BASE_KEY)) {

                        JSONObject secondaryButtonBase = secondaryButton.getJSONObject(ELEMENT_STATE_BASE_KEY);

                        if (secondaryButtonBase.has(BORDER_KEY)
                            && secondaryButtonBase.getJSONObject(BORDER_KEY).has(BORDER_RADIUS_KEY)
                            && !StringUtils.isBlank(secondaryButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY))) {

                            secondaryButtonBaseBorderRadius = secondaryButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY);
                        }
                        if (secondaryButtonBase.has(FONT_KEY)
                            && secondaryButtonBase.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                            && !StringUtils.isBlank(secondaryButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                            secondaryButtonBaseFontColor = secondaryButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                        }
                    }
                }
                if (buttons.has(BUTTONS_EXTERNAL_CONNECTION_KEY)) {

                    JSONObject externalConnectionButton = buttons.getJSONObject(BUTTONS_EXTERNAL_CONNECTION_KEY);

                    if (externalConnectionButton.has(ELEMENT_STATE_BASE_KEY)) {

                        JSONObject externalConnectionButtonBase = externalConnectionButton.getJSONObject(ELEMENT_STATE_BASE_KEY);

                        if (externalConnectionButtonBase.has(BACKGROUND_KEY)
                            && externalConnectionButtonBase.getJSONObject(BACKGROUND_KEY).has(BACKGROUND_COLOR_KEY)
                            && !StringUtils.isBlank(externalConnectionButtonBase.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY))) {

                            externalConnectionButtonBaseBackgroundColor = externalConnectionButtonBase.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY);
                        }
                        if (externalConnectionButtonBase.has(BORDER_KEY)
                            && externalConnectionButtonBase.getJSONObject(BORDER_KEY).has(BORDER_RADIUS_KEY)
                            && !StringUtils.isBlank(externalConnectionButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY))) {

                            externalConnectionButtonBaseBorderRadius = externalConnectionButtonBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY);
                        }
                        if (externalConnectionButtonBase.has(FONT_KEY)
                            && externalConnectionButtonBase.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                            && !StringUtils.isBlank(externalConnectionButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                            externalConnectionButtonBaseFontColor = externalConnectionButtonBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                        }
                    }
                }
            }
        }

        if (theme.has(LOGIN_BOX_KEY)) {

            JSONObject loginBox = theme.optJSONObject(LOGIN_BOX_KEY);

            if (loginBox != null) {
                if (loginBox.has(BACKGROUND_KEY)
                    && loginBox.getJSONObject(BACKGROUND_KEY).has(BACKGROUND_COLOR_KEY)
                    && !StringUtils.isBlank(loginBox.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY))) {

                    loginBoxBackgroundColor = loginBox.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY);
                }
                if (loginBox.has(BORDER_KEY)) {
                    if (loginBox.getJSONObject(BORDER_KEY).has(BORDER_COLOR_KEY)
                        && !StringUtils.isBlank(loginBox.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY))) {

                        loginBoxBorderColor = loginBox.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY);
                    }
                    if (loginBox.getJSONObject(BORDER_KEY).has(BORDER_RADIUS_KEY)
                        && !StringUtils.isBlank(loginBox.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY))) {

                        loginBoxBorderRadius = loginBox.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY);
                    }
                    if (loginBox.getJSONObject(BORDER_KEY).has(BORDER_WIDTH_KEY)
                        && !StringUtils.isBlank(loginBox.getJSONObject(BORDER_KEY).getString(BORDER_WIDTH_KEY))) {

                        loginBoxBorderWidth = loginBox.getJSONObject(BORDER_KEY).getString(BORDER_WIDTH_KEY);
                    }
                }
                if (loginBox.has(FONT_KEY)
                    && loginBox.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(loginBox.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    loginBoxFontColor = loginBox.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                }
            }
        }

        if (theme.has(INPUTS_KEY)) {

            JSONObject inputs = theme.getJSONObject(INPUTS_KEY);

            if (inputs.has(ELEMENT_STATE_BASE_KEY)) {

                JSONObject inputsBase = inputs.getJSONObject(ELEMENT_STATE_BASE_KEY);

                if (inputsBase.has(BACKGROUND_KEY)
                    && inputsBase.getJSONObject(BACKGROUND_KEY).has(BACKGROUND_COLOR_KEY)
                    && !StringUtils.isBlank(inputsBase.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY))) {

                    inputBaseBackgroundColor = inputsBase.getJSONObject(BACKGROUND_KEY).getString(BACKGROUND_COLOR_KEY);
                }
                if (inputsBase.has(BORDER_KEY)) {
                    if (inputsBase.getJSONObject(BORDER_KEY).has(BORDER_COLOR_KEY)
                        && !StringUtils.isBlank(inputsBase.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY))) {

                        inputBaseBorderColor = inputsBase.getJSONObject(BORDER_KEY).getString(BORDER_COLOR_KEY);
                    }
                    if (inputsBase.getJSONObject(BORDER_KEY).has(BORDER_RADIUS_KEY)
                        && !StringUtils.isBlank(inputsBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY))) {

                        inputBaseBorderRadius = inputsBase.getJSONObject(BORDER_KEY).getString(BORDER_RADIUS_KEY);
                    }
                }
                if (inputsBase.has(FONT_KEY)
                    && inputsBase.getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(inputsBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    inputBaseFontColor = inputsBase.getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                }
                if (inputsBase.has(INPUT_LABELS_KEY)
                    && inputsBase.getJSONObject(INPUT_LABELS_KEY).has(FONT_KEY)
                    && inputsBase.getJSONObject(INPUT_LABELS_KEY).getJSONObject(FONT_KEY).has(FONT_COLOR_KEY)
                    && !StringUtils.isBlank(inputsBase.getJSONObject(INPUT_LABELS_KEY).getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY))) {

                    inputBaseLabelFontColor = inputsBase.getJSONObject(INPUT_LABELS_KEY).getJSONObject(FONT_KEY).getString(FONT_COLOR_KEY);
                }
            }
        }
    } else if (colors != null) {
        if (colors.has("primary") && !StringUtils.isBlank(colors.getString("primary"))) {
            primaryColorMain = colors.getString("primary");
        }
    }
%>

<% if (theme != null || !StringUtils.isBlank(primaryColorMain)) { %>

<%
    // `inherit` doesn't work properly when the input is autofilled.
    // So we need to add an explicit fallback.
    if (StringUtils.equals(inputBaseFontColor, "inherit")) {
        if (StringUtils.equals(loginBoxFontColor, "inherit")) {
            inputBaseFontColor = loginPageFontColor;
        } else {
            inputBaseFontColor = loginBoxFontColor;
        }
    }
%>

<style type="text/css">

    <%
        if (!StringUtils.isBlank(typographyFontFamilyImportURL)) {
    %>
        @import url("<%= typographyFontFamilyImportURL %>");
    <%
        }
    %>
    :root {
        --asg-colors-primary-main: <%= StringEscapeUtils.escapeHtml4(primaryColorMain) %>;
        --asg-colors-secondary-main: <%= StringEscapeUtils.escapeHtml4(secondaryColorMain) %>;
        --asg-colors-background-body-main: <%= StringEscapeUtils.escapeHtml4(bodyBackgroundColorMain) %>;
        --asg-colors-background-surface-main: <%= StringEscapeUtils.escapeHtml4(surfaceBackgroundColorMain) %>;
        --asg-colors-background-surface-light: <%= StringEscapeUtils.escapeHtml4(surfaceBackgroundColorLight) %>;
        --asg-colors-background-surface-dark: <%= StringEscapeUtils.escapeHtml4(surfaceBackgroundColorDark) %>;
        --asg-colors-background-surface-inverted: <%= StringEscapeUtils.escapeHtml4(surfaceBackgroundColorInverted) %>;
        --asg-colors-outlined-default: <%= StringEscapeUtils.escapeHtml4(outlinedComponentDefaultBorderColor) %>;
        --asg-colors-text-primary: <%= StringEscapeUtils.escapeHtml4(primaryTextColor) %>;
        --asg-colors-text-secondary: <%= StringEscapeUtils.escapeHtml4(secondaryTextColor) %>;
        --asg-colors-alerts-error-main: <%= StringEscapeUtils.escapeHtml4(errorAlertColorMain) %>;
        --asg-colors-alerts-neutral-main: <%= StringEscapeUtils.escapeHtml4(neutralAlertColorMain) %>;
        --asg-colors-alerts-info-main: <%= StringEscapeUtils.escapeHtml4(infoAlertColorMain) %>;
        --asg-colors-alerts-warning-main: <%= StringEscapeUtils.escapeHtml4(warningAlertColorMain) %>;
        --asg-colors-illustrations-primary-main: <%= StringEscapeUtils.escapeHtml4(primaryIllustrationColorMain) %>;
        --asg-colors-illustrations-secondary-main: <%= StringEscapeUtils.escapeHtml4(secondaryIllustrationColorMain) %>;
        --asg-colors-illustrations-accent1-main: <%= StringEscapeUtils.escapeHtml4(accent1IllustrationColorMain) %>;
        --asg-colors-illustrations-accent2-main: <%= StringEscapeUtils.escapeHtml4(accent2IllustrationColorMain) %>;
        --asg-colors-illustrations-accent3-main: <%= StringEscapeUtils.escapeHtml4(accent3IllustrationColorMain) %>;

        /* Components */
        --asg-footer-text-color: <%= StringEscapeUtils.escapeHtml4(footerFontColor) %>;
        --asg-footer-border-color: <%= !StringUtils.isBlank(footerBorderColor) ? StringEscapeUtils.escapeHtml4(footerBorderColor) : "var(--asg-colors-outlined-default)" %>;
        --asg-primary-font-family: <%= StringEscapeUtils.escapeHtml4(typographyFontFamily) %>;
        --asg-heading-text-color: <%= StringEscapeUtils.escapeHtml4(headingFontColor) %>;
        --asg-primary-button-base-text-color: <%= StringEscapeUtils.escapeHtml4(primaryButtonBaseFontColor) %>;
        --asg-primary-button-base-border-radius: <%= StringEscapeUtils.escapeHtml4(primaryButtonBaseBorderRadius) %>;
        --asg-secondary-button-base-text-color: <%= StringEscapeUtils.escapeHtml4(secondaryButtonBaseFontColor) %>;
        --asg-secondary-button-base-border-radius: <%= StringEscapeUtils.escapeHtml4(secondaryButtonBaseBorderRadius) %>;
        --asg-external-login-button-base-background-color: <%= StringEscapeUtils.escapeHtml4(externalConnectionButtonBaseBackgroundColor) %>;
        --asg-external-login-button-base-text-color: <%= StringEscapeUtils.escapeHtml4(externalConnectionButtonBaseFontColor) %>;
        --asg-external-login-button-base-border-radius: <%= StringEscapeUtils.escapeHtml4(externalConnectionButtonBaseBorderRadius) %>;
        --asg-login-box-background-color: <%= !StringUtils.isBlank(loginBoxBackgroundColor) ? StringEscapeUtils.escapeHtml4(loginBoxBackgroundColor) : "var(--asg-colors-background-surface-main)" %>;
        --asg-login-box-border-color: <%= !StringUtils.isBlank(loginBoxBorderColor) ? StringEscapeUtils.escapeHtml4(loginBoxBorderColor) : "var(--asg-colors-outlined-default)" %>;
        --asg-login-box-border-width: <%= StringEscapeUtils.escapeHtml4(loginBoxBorderWidth) %>;
        --asg-login-box-border-style: solid;
        --asg-login-box-border-radius: <%= StringEscapeUtils.escapeHtml4(loginBoxBorderRadius) %>;
        --asg-login-box-text-color: <%= StringEscapeUtils.escapeHtml4(loginBoxFontColor) %>;
        --asg-login-page-background-color: <%= !StringUtils.isBlank(loginPageBackgroundColor) ? StringEscapeUtils.escapeHtml4(loginPageBackgroundColor) : "var(--asg-colors-background-body-main)" %>;
        --asg-login-page-font-color: <%= !StringUtils.isBlank(loginPageFontColor) ? StringEscapeUtils.escapeHtml4(loginPageFontColor) : "var(--asg-colors-text-primary)" %>;
        --asg-input-field-base-text-color: <%= !StringUtils.isBlank(inputBaseFontColor) ? StringEscapeUtils.escapeHtml4(inputBaseFontColor) : "var(--asg-colors-text-primary)" %>;
        --asg-input-field-base-background-color: <%= StringEscapeUtils.escapeHtml4(inputBaseBackgroundColor) %>;
        --asg-input-field-base-label-text-color: <%= StringEscapeUtils.escapeHtml4(inputBaseLabelFontColor) %>;
        --asg-input-field-base-border-color: <%= !StringUtils.isBlank(inputBaseBorderColor) ? StringEscapeUtils.escapeHtml4(inputBaseBorderColor) : "var(--asg-colors-outlined-default)" %>;
        --asg-input-field-base-border-radius: <%= StringEscapeUtils.escapeHtml4(inputBaseBorderRadius) %>;
        --language-selector-background-color: <%= StringEscapeUtils.escapeHtml4(loginPageBackgroundColor) %> !important;
        --language-selector-text-color: <%= StringEscapeUtils.escapeHtml4(footerFontColor) %> !important;
        --language-selector-border-color: <%= StringEscapeUtils.escapeHtml4(primaryColorMain) %> !important;
    }

    body {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-body-main);
    }

    /*-----------------------------
            Anchor Tags
    ------------------------------*/

    /* Anchor Tags */
    a {
        color: var(--asg-colors-primary-main);
    }

    a:hover, a:focus, a:active {
        color: var(--asg-colors-primary-main);
        filter: brightness(0.85);
    }

    /*-----------------------------
             Pre Loader
    ------------------------------*/

    .pre-loader-wrapper {
        background: var(--asg-colors-background-body-main);
    }

    .ui.inverted.dimmer {
        background: var(--asg-colors-background-body-main);
    }

    /*-----------------------------
                Messages
    ------------------------------*/

    /* TODO: Remove the background color from .totp-tooltip */
    .ui.message, .ui.message.totp-tooltip {
        background-color: var(--asg-colors-alerts-neutral-main);
        color: var(--asg-colors-text-primary) !important;
    }

    .backup-code-label.info {
        background-color: var(--asg-colors-alerts-info-main) !important;
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.message.info {
        background-color: var(--asg-colors-alerts-info-main) !important;
    }

    .ui.message.warning {
        background-color: var(--asg-colors-alerts-warning-main) !important;
    }

    .ui.message.error, .ui.negative.message {
        background-color: var(--asg-colors-alerts-error-main) !important;
    }

    /*-----------------------------
                Alert
    ------------------------------*/

    .alert-wrapper .notifications-wrapper .notification {
        background: var(--asg-colors-background-surface-main) !important;
        color: var(--asg-colors-text-primary) !important;
        border: 1px solid var(--asg-colors-outlined-default) !important;
    }

    .alert-wrapper .notifications-wrapper .notification .notification-message .alert-message .description {
        color: var(--asg-colors-text-secondary);
    }

    .alert-wrapper .notifications-wrapper .notification .notification-dismiss {
        color: var(--asg-colors-text-primary) !important;
    }

    /*-----------------------------
                Card
    ------------------------------*/

    .ui.card, .ui.cards>.card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.card, .ui.card.settings-card {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.card>.extra, .ui.cards>.card>.extra, .ui.card.settings-card .extra-content {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.card>.content, .ui.cards>.card>.content {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.card .meta, .ui.cards>.card .meta {
        color: var(--asg-colors-text-secondary);
    }

    /* Security Page Active Sessions Terminate panel */
    .ui.card.settings-card .top-action-panel {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-input-field-base-border-color);
    }

    /* Card Actions */
    .ui.card.settings-card .extra-content .action-button .action-button-text {
        color: var(--asg-colors-primary-main);
    }

    .ui.card.basic-card {
        border-color: var(--asg-colors-outlined-default);
    }

    /*-----------------------------
                Dropdown
    ------------------------------*/

    /* Avatar Modal Inner */
    .ui.dropdown .menu {
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
        color: var(--asg-colors-text-primary);
    }
    .ui.dropdown .menu .selected.item, .ui.dropdown.selected {
        color: var(--asg-colors-text-primary);
    }

    /*-----------------------------
                Menu
    ------------------------------*/

    .ui.menu, .ui.vertical.menu {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.menu .dropdown.item .menu {
        background: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Modal
    ------------------------------*/

    .ui.modal, .ui.modal>.content {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.modal>.actions {
        background: var(--asg-colors-background-surface-light);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.modal>.header {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-light);
    }

    /*-----------------------------
                Segment
    ------------------------------*/

    .ui.segment {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.segment.edit-segment {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.segment.emphasized.placeholder-container {
        background: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Icons
    ------------------------------*/

    /* Primary Icons */
    i.icon.primary {
        color: var(--asg-colors-primary-main);
    }

    .theme-icon
        background: var(--asg-colors-background-surface-light);
    }

    .theme-icon.bordered {
        border-color: var(--asg-colors-outlined-default);
    }

    .theme-icon.two-tone svg.icon .lighten-1 {
        filter: brightness(1.08);
    }

    .theme-icon.two-tone svg.icon .lighten-2 {
        filter: brightness(1.16);
    }

    .theme-icon.two-tone svg.icon .darken-1 {
        filter: brightness(0.9);
    }

    .theme-icon.two-tone svg.icon .darken-2 {
        filter: brightness(0.7);
    }

    .theme-icon.two-tone svg.icon .opacity-80 {
        opacity: 0.8;
    }

    .theme-icon.two-tone svg.icon .opacity-60 {
        opacity: 0.6;
    }

    .theme-icon.two-tone svg.icon .fill.primary, .theme-icon.two-tone svg.icon .fill-primary {
        fill: var(--asg-colors-illustrations-primary-main);
    }

    .theme-icon.two-tone svg.icon .stroke.primary, .theme-icon.two-tone svg.icon .stroke-primary {
        stroke: var(--asg-colors-illustrations-primary-main);
    }

    .theme-icon.two-tone svg.icon .fill.secondary, .theme-icon.two-tone svg.icon .fill-secondary {
        fill: var(--asg-colors-illustrations-secondary-main);
    }

    .theme-icon.two-tone svg.icon .stroke.secondary, .theme-icon.two-tone svg.icon .stroke-secondary {
        stroke: var(--asg-colors-illustrations-secondary-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent1, .theme-icon.two-tone svg.icon .fill-accent1 {
        fill: var(--asg-colors-illustrations-accent1-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent1, .theme-icon.two-tone svg.icon .stroke-accent1 {
        stroke: var(--asg-colors-illustrations-accent1-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent2, .theme-icon.two-tone svg.icon .fill-accent2 {
        fill: var(--asg-colors-illustrations-accent2-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent2, .theme-icon.two-tone svg.icon .stroke-accent2 {
        stroke: var(--asg-colors-illustrations-accent2-main);
    }

    .theme-icon.two-tone svg.icon .fill.accent3, .theme-icon.two-tone svg.icon .fill-accent3 {
        fill: var(--asg-colors-illustrations-accent3-main);
    }

    .theme-icon.two-tone svg.icon .stroke.accent3, .theme-icon.two-tone svg.icon .stroke-accent3 {
        stroke: var(--asg-colors-illustrations-accent3-main);
    }

    /*-----------------------------
             Placeholder
    ------------------------------*/

    .ui.placeholder, .ui.placeholder .image.header:after, .ui.placeholder .line, .ui.placeholder .line:after, .ui.placeholder>:before {
        background-color: var(--asg-colors-background-surface-main);
    }

    /*-----------------------------
                Typography
    ------------------------------*/

    /* ------  Font Family ------ */

    /* Body */
    body {
        font-family: var(--asg-primary-font-family);
    }

    /* Headings */
    h1,
    h2,
    h3,
    h4,
    h5 {
        font-family: var(--asg-primary-font-family);
    }

    .ui.header {
        font-family: var(--asg-primary-font-family);
    }

    /* Inputs */
    .ui.form input:not([type]),
    .ui.form input[type="date"],
    .ui.form input[type="datetime-local"],
    .ui.form input[type="email"],
    .ui.form input[type="number"],
    .ui.form input[type="password"],
    .ui.form input[type="search"],
    .ui.form input[type="tel"],
    .ui.form input[type="time"],
    .ui.form input[type="text"],
    .ui.form input[type="file"],
    .ui.form input[type="url"] {

        font-family: var(--asg-primary-font-family);
    }

    .ui.input > input {
        font-family: var(--asg-primary-font-family);
    }

    /* Search */
    .ui.search > .results .result .title {
        font-family: var(--asg-primary-font-family);
    }

    .ui.search > .results > .message .header {
        font-family: var(--asg-primary-font-family);
    }

    .ui.category.search > .results .category > .name {
        font-family: var(--asg-primary-font-family);
    }

    /* Menus */
    .ui.menu {
        font-family: var(--asg-primary-font-family);
    }

    /* Message */
    .ui.message .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Table */
    .ui.sortable.table thead th:after {
        font-family: var(--asg-primary-font-family);
    }

    /* Button */
    .ui.button {
        font-family: var(--asg-primary-font-family);
    }

    /* Text Container */
    .ui.text.container {
        font-family: var(--asg-primary-font-family);
    }

    /* List */
    .ui.list .list > .item .header,
    .ui.list > .item .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Steps */
    .ui.steps .step .title {
        font-family: var(--asg-primary-font-family);
    }

    /* Accordion */
    .ui.accordion .title:not(.ui) {
        font-family: var(--asg-primary-font-family);
    }

    /* Modal */
    .ui.modal > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Popup */
    .ui.popup > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Cards */
    .ui.cards > .card > .content > .header,
    .ui.card > .content > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Items */
    .ui.items > .item > .content > .header {
        font-family: var(--asg-primary-font-family);
    }

    /* Statistics */
    .ui.statistics .statistic > .value,
    .ui.statistic > .value {
        font-family: var(--asg-primary-font-family);
    }

    /* ------  Font Colors ------ */

    .ui.table {
        color: var(--asg-colors-text-primary);
    }

    /* My Account session table */
    .ui.table.session-table {
        color: var(--asg-colors-text-secondary);
    }

    .ui.header .sub.header {
        color: var(--asg-colors-text-secondary);
    }

    .ui.list .list>.item .description, .ui.list>.item .description {
        color: var(--asg-colors-text-secondary);
    }

    .text-typography {
        color: var(--asg-colors-text-primary);
    }

    .ui.menu .item {
        color: var(--asg-colors-text-primary);
    }

    .ui.items>.item>.content>.description {
        color: var(--asg-colors-text-primary);
    }

    /* '!important' is used from Semantic UI's side */
    .ui.menu .ui.dropdown .menu>.item {
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.menu .ui.dropdown .menu>.item:hover {
        color: var(--asg-colors-text-primary) !important;
    }

    .ui.vertical.menu.side-panel .side-panel-item .route-name {
        color: var(--asg-colors-text-primary);
    }

    .empty-placeholder .subtitle {
        color: var(--asg-colors-text-secondary);
    }

    .ui.list .list>.item .header, .ui.list>.item .header {
        color: var(--asg-colors-text-primary);
    }

    .ui.header {
        color: var(--asg-heading-text-color);
    }

    /* Primary Text */
    .text-typography.primary {
        color: var(--asg-colors-primary-main);
    }

    .hint-description {
        color: var(--asg-colors-text-secondary) !important;
    }

    .ui.items>.item.application-list-item .text-content-container .item-description {
        color: var(--asg-colors-text-secondary);
    }

    .ui.card.application-card.recent .application-content .text-content-container .application-name {
        color: var(--asg-colors-text-primary);
    }

    .ui.card.application-card.recent .application-content .text-content-container .application-description {
        color: var(--asg-colors-text-secondary);
    }

    /*-----------------------------
                Buttons
    ------------------------------*/

    /* Primary */
    .ui.primary.button:not(.basic) {
        background: var(--asg-colors-primary-main) !important;
        color: var(--asg-primary-button-base-text-color);
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.primary.button:not(.basic):hover,
    .ui.primary.button:not(.basic):focus,
    .ui.primary.button:not(.basic):active {
        background: var(--asg-colors-primary-main) !important;
        filter: brightness(0.85);
    }

    /* Secondary */
    .ui.secondary.button {
        background: var(--asg-colors-secondary-main);
        color: var(--asg-secondary-button-base-text-color);
        border-radius: var(--asg-secondary-button-base-border-radius);
    }

    .ui.secondary.button:hover, .ui.secondary.button:focus, .ui.secondary.button:active {
        background: var(--asg-colors-secondary-main);
        filter: brightness(0.85);
    }

    /* Basic Button */
    .ui.basic.button, .ui.basic.buttons .button {
        color: var(--asg-colors-text-primary) !important;
        background: transparent !important;
    }

    .ui.basic.button:hover, .ui.basic.button:focus, .ui.basic.button:active, .ui.basic.buttons .button:hover, .ui.basic.buttons .button:active, .ui.basic.buttons .button:focus {
        color: var(--asg-colors-text-primary) !important;
        background: transparent !important;
    }

    .ui.basic.button.show-more-button {
        box-shadow: 0 0 0 1px var(--asg-colors-outlined-default) inset;
    }

    .ui.basic.button.show-more-button .arrow.down.icon {
        border-left: 1px solid var(--asg-colors-outlined-default);
    }

    .ui.basic.primary.button, .ui.basic.primary.buttons .button {
        color: var(--asg-colors-primary-main) !important;
        border-radius: var(--asg-primary-button-base-border-radius);
    }

    .ui.basic.primary.button:hover, .ui.basic.primary.buttons .button:hover {
        color: var(--asg-colors-primary-main) !important;
        filter: brightness(0.85);
    }

    /* External Connections */
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button {
        background: var(--asg-external-login-button-base-background-color);
        color: var(--asg-external-login-button-base-text-color);
        border-radius: var(--asg-external-login-button-base-border-radius);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:hover,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:focus,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .social-login .ui.button:active {
        background: var(--asg-external-login-button-base-background-color);
        filter: brightness(0.85);
    }

    /*-----------------------------
                Inputs
    ------------------------------*/

    /* Input */
    .ui.form input:not([type]), .ui.form input[type=date], .ui.form input[type=datetime-local], .ui.form input[type=email], .ui.form input[type=file], .ui.form input[type=number], .ui.form input[type=password], .ui.form input[type=search], .ui.form input[type=tel], .ui.form input[type=text], .ui.form input[type=time], .ui.form input[type=url],
    .ui.form .field.error input:not([type]), .ui.form .field.error input[type=date], .ui.form .field.error input[type=datetime-local], .ui.form .field.error input[type=email], .ui.form .field.error input[type=file], .ui.form .field.error input[type=number], .ui.form .field.error input[type=password], .ui.form .field.error input[type=search], .ui.form .field.error input[type=tel], .ui.form .field.error input[type=text], .ui.form .field.error input[type=time], .ui.form .field.error input[type=url], .ui.form .field.error select, .ui.form .field.error textarea, .ui.form .fields.error .field input:not([type]), .ui.form .fields.error .field input[type=date], .ui.form .fields.error .field input[type=datetime-local], .ui.form .fields.error .field input[type=email], .ui.form .fields.error .field input[type=file], .ui.form .fields.error .field input[type=number], .ui.form .fields.error .field input[type=password], .ui.form .fields.error .field input[type=search], .ui.form .fields.error .field input[type=tel], .ui.form .fields.error .field input[type=text], .ui.form .fields.error .field input[type=time], .ui.form .fields.error .field input[type=url], .ui.form .fields.error .field select, .ui.form .fields.error .field textarea,
    .ui.form .field.error input:not([type]):focus, .ui.form .field.error input[type=date]:focus, .ui.form .field.error input[type=datetime-local]:focus, .ui.form .field.error input[type=email]:focus, .ui.form .field.error input[type=file]:focus, .ui.form .field.error input[type=number]:focus, .ui.form .field.error input[type=password]:focus, .ui.form .field.error input[type=search]:focus, .ui.form .field.error input[type=tel]:focus, .ui.form .field.error input[type=text]:focus, .ui.form .field.error input[type=time]:focus, .ui.form .field.error input[type=url]:focus, .ui.form .field.error select:focus, .ui.form .field.error textarea:focus,
    .ui.form input:not([type]):focus, .ui.form input[type=date]:focus, .ui.form input[type=datetime-local]:focus, .ui.form input[type=email]:focus, .ui.form input[type=file]:focus, .ui.form input[type=number]:focus, .ui.form input[type=password]:focus, .ui.form input[type=search]:focus, .ui.form input[type=tel]:focus, .ui.form input[type=text]:focus, .ui.form input[type=time]:focus, .ui.form input[type=url]:focus,
    .ui.input.addon-wrapper,
    .ui.input.addon-wrapper:focus-within,
    .ui.selection.dropdown,
    .ui.selection.dropdown:hover {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
        border-radius: var(--asg-input-field-base-border-radius);
    }

    /* Autofilled */
    .ui.form .field.field input:-webkit-autofill {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Autofilled:Focus */
    .ui.form .field.field input:-webkit-autofill:focus {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Autofilled:Error */
    .ui.form .error.error input:-webkit-autofill {
        color: var(--asg-input-field-base-text-color) !important;
        -webkit-text-fill-color: var(--asg-input-field-base-text-color) !important;
        box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        -webkit-box-shadow: 0 0 0 100px var(--asg-input-field-base-background-color) inset!important;
        border-color: var(--asg-input-field-base-border-color) !important;
    }

    /* Input Labels */
    .ui.form .field>label {
        color: var(--asg-input-field-base-label-text-color);
    }

    /* Input Addon Icons */
    .ui.form .field .ui.input {
        color: var(--asg-input-field-base-text-color);
    }

    /* Input calendar icon */
    .ui.calendar .ui.input.left.icon .calendar.icon {
        color: var(--asg-input-field-base-text-color);
    }

    /* Input Readonly */
    .ui.form input[readonly] {
        background: var(--asg-input-field-base-background-color) !important;
        filter: brightness(0.85);
    }

    /* Dropdowns */
    .ui.selection.active.dropdown .menu {
        background: var(--asg-input-field-base-border-color);
    }

    .ui.selection.dropdown .menu>.item {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    /* Checkbox */
    .ui.checkbox .box:before, .ui.checkbox label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:focus~.box:before, .ui.checkbox input:focus~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked:focus~.box:before, .ui.checkbox input:checked:focus~label:before, .ui.checkbox input:not([type=radio]):indeterminate:focus~.box:before, .ui.checkbox input:not([type=radio]):indeterminate:focus~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked~label:before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox .box:hover::before, .ui.checkbox label:hover::before {
        background: var(--asg-input-field-base-background-color);
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.checkbox input:checked~.box:after, .ui.checkbox input:checked~label:after {
        color: var(--asg-input-field-base-text-color);
    }

    .ui.checkbox input:checked:focus~.box:after, .ui.checkbox input:checked:focus~label:after, .ui.checkbox input:not([type=radio]):indeterminate:focus~.box:after, .ui.checkbox input:not([type=radio]):indeterminate:focus~label:after {
        color: var(--asg-input-field-base-text-color);
    }

    .ui.checkbox label, .ui.checkbox+label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox label:hover, .ui.checkbox+label:hover {
        color: var(--asg-input-field-base-label-text-color);
    }

    .ui.checkbox input:focus~label {
        color: var(--asg-input-field-base-label-text-color);
    }

    /* Input Addons */
    .addon-field-wrapper .ui.input {
        border-color: var(--asg-input-field-base-border-color);
    }

    .addon-field-wrapper .ui.input:focus-within {
        border-color: var(--asg-input-field-base-border-color);
    }

    .ui.input>input {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper .ui.input.advanced-search {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on {
        border-color: var(--asg-input-field-base-border-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on input {
        color: var(--asg-input-field-base-text-color);
        background: var(--asg-input-field-base-background-color);
        border-radius: var(--asg-input-field-base-border-radius);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on .input-add-on {
        background: var(--asg-input-field-base-background-color) !important;
        border: 1px solid transparent;
    }

    .ui.input.advanced-search.with-add-on .ui.icon.input>i.icon {
        color: var(--asg-input-field-base-text-color);
    }

    .advanced-search-wrapper.fill-white .ui.input.advanced-search.with-add-on .input-add-on:active {
        background: var(--asg-input-field-base-background-color) !important;
    }

    /* Labeled Inputs */
    .ui.labeled.input>.label {
        background: var(--asg-input-field-base-background-color);
        color: var(--asg-colors-text-secondary);
        border: 1px solid var(--asg-input-field-base-border-color);
    }

    .ui[class*="right labeled"].input>input:focus {
        border-color: var(--asg-input-field-base-border-color) !important;;
    }

    /* Error Labels */
    .ui.form .field .prompt.label {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    /*-----------------------------
                Popup
    ------------------------------*/

    .ui.popup {
        color: var(--asg-colors-text-primary);
        background: var(--asg-colors-background-surface-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.bottom.popup:before, .ui.top.popup:before, .ui.left.popup:before, .ui.right.popup:before, .ui.left.center.popup:before, .ui.right.center.popup:before {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.popup:before {
        box-shadow: 1px 1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.bottom.left.popup:before, .ui.bottom.center.popup:before, .ui.bottom.right.popup:before {
        box-shadow: -1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.left.center.popup:before {
        box-shadow: 1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.right.center.popup:before {
        box-shadow: -1px 1px 0 0 var(--asg-colors-outlined-default);
    }

    /*-----------------------------
            Login Screens
    ------------------------------*/

    /* ------  Login Page ------ */

    /* Default Page */
    .login-portal.layout {
        color: var(--asg-login-page-font-color);
        background: var(--asg-login-page-background-color);
    }

    /* Default Page with Blurred Patch */
    .login-portal.layout .page-wrapper {
        background: var(--asg-login-page-background-color);
    }

    /* Error, Success Pages */
    .login-portal.layout .page-wrapper.success-page, .login-portal.layout .page-wrapper.error-page {
        background: var(--asg-login-page-background-color);
    }

    /* ------  Login Box ------ */

    .login-portal.layout .center-segment>.ui.container>.ui.segment {
        background: var(--asg-login-box-background-color);
        border-width: var(--asg-login-box-border-width) !important;
        border-color: var(--asg-login-box-border-color);
        border-style: var(--asg-login-box-border-style);
        border-radius: var(--asg-login-box-border-radius);
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .external-link-container.text-small {
       color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.checkbox label,
    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.checkbox+label {
        color: var(--asg-input-field-base-label-text-color);
    }

    .login-portal.layout .center-segment>.ui.container> .ui.bottom.attached.message {
        border-bottom-right-radius: var(--asg-login-box-border-radius);
        border-bottom-left-radius: var(--asg-login-box-border-radius);
    }

    /* Login Box Links */
    .login-portal.layout .clickable-link {
        color: var(--asg-colors-primary-main);
    }

    /* Misc Text */
    .ui.divider {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .portal-tagline-description {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .ui.list .list > .item .header, .ui.list > .item .header {
        color: var(--asg-login-box-text-color);
    }

    .login-portal.layout .center-segment>.ui.container>.ui.segment .login-portal-app-consent-request {
        color: var(--asg-login-box-text-color);
    }

    /* ------  Login Footer ------ */

    .login-portal.layout .footer {
        border-color: var(--asg-footer-border-color);
    }

    .login-portal.layout .footer .ui.text.menu .item {
        color: var(--asg-footer-text-color);
    }

    .login-portal.layout .footer .ui.text.menu .item:not(.no-hover):hover {
        color: var(--asg-colors-primary-main);
    }

    /*-----------------------------
              My Account
    ------------------------------*/

    .recovery-options-muted-header {
        background: var(--asg-colors-background-surface-dark);
        color: var(--asg-colors-text-secondary);
    }

    /* ------  My Account Side Panel ------ */

    .ui.vertical.menu.side-panel {
        background: var(--asg-colors-background-body-main);
    }

    /* ------  My Account Header ------ */

    .ui.menu.app-header {
        background: var(--asg-colors-background-surface-inverted);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.pointing.dropdown>.menu:after {
        background: var(--asg-colors-background-surface-main);
        box-shadow: -1px -1px 0 0 var(--asg-colors-outlined-default);
    }

    .ui.menu .user-dropdown .user-dropdown-menu .organization-label {
        background: var(--asg-colors-alerts-info-main);
        color: var(--asg-colors-text-secondary);
    }

    /* ------  My Account Footer ------ */

    .ui.menu.app-footer {
        background: var(--asg-colors-background-body-main);
        border-color: var(--asg-colors-outlined-default);
    }

    .ui.menu.app-footer {
        color: var(--asg-colors-text-secondary);
    }

    .ui.menu.app-footer .ui.menu .item.copyright {
        color: var(--asg-colors-text-secondary);
    }

    .ui.segment.cookie-consent-banner.inverted {
        border: 1px solid var(--asg-colors-outlined-default);
        background: var(--asg-colors-background-surface-inverted);
    }

    .ui.menu.app-footer .footer-dropdown .dropdown-trigger.link, .ui.menu.app-footer .footer-link {
        color: var(--asg-colors-text-primary);
    }

    .ui.menu.app-footer .footer-dropdown .dropdown.icon {
        color: var(--asg-colors-text-primary);
    }

    /* ------  My Account Applications ------ */

    .ui.items>.item.application-list-item {
        background: var(--asg-colors-background-surface-main);
    }

    .ui.items>.item.application-list-item .text-content-container .item-header {
        color: var(--asg-colors-text-primary);
    }

    .ui.image.app-image.app-avatar.default-app-icon .initials {
        color: var(--asg-colors-primary-main);
    }

    .ui.card.application-card.recent .application-image.default {
        background: var(--asg-colors-background-surface-light);
    }

    .ui.items>.item.application-list-item {
        border-color: var(--asg-colors-outlined-default);
    }
</style>
<% } %>
