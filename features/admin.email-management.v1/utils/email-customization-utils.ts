/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
    BrandingPreferenceInterface,
    BrandingPreferenceThemeInterface,
    PredefinedThemes,
    ThemeConfigInterface
} from "../../common.branding.v1/models";
import { CustomTextInterface } from "@wso2is/admin.branding.v1/models/custom-text-preference";
import { BrandingPreferenceUtils } from "@wso2is/admin.branding.v1/utils";
import processCustomTextTemplateLiterals from "@wso2is/admin.branding.v1/utils/process-custom-text-template-literals";

export class EmailCustomizationUtils {

    private static readonly brandingFallBackValues: Record<string, string> = {
        background_color: "#F8F9FA",
        button_font_color: "#FFFFFF",
        copyright_text: "&#169; YYYY WSO2 LLC.",
        dark_background_color: "#111111",
        dark_border_color: "#333333",
        dark_logo_url: "",
        font_color: "#231F20",
        font_style: "Montserrat",
        light_background_color: "#FFFFFF",
        light_border_color: "transparent",
        light_logo_url: "",
        primary_color: "#FF7300"
    }

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * Get the template body with the branding configs.
     *
     * @param organizationName - Current organization name
     * @param brandingConfigs - Current branding configs
     * @param templateBody - Email template body (HTML template)
     * @param predefinedThemes - Predefined themes
     */
    public static getTemplateBody(
        organizationName: string,
        brandingConfigs: BrandingPreferenceInterface,
        customText: CustomTextInterface,
        templateBody: string,
        predefinedThemes: BrandingPreferenceThemeInterface
    ): string {
        let updatedTemplateBody: string = templateBody;
        const isCustomLogoURLPresent: boolean = !!brandingConfigs?.
            theme[brandingConfigs?.theme?.activeTheme]?.images?.logo?.imgURL;

        /**
         * If the branding preferences doesn't have a custom logo configured,
         * modify the preview HTML to not show a broken image icon with alternative text.
         *
         * Ref: https://github.com/wso2/product-is/issues/18194#issuecomment-1862264745
         * */
        if (!isCustomLogoURLPresent) {
            updatedTemplateBody = updatedTemplateBody.replace(
                /alt="{{organization.logo.altText}}"/g,
                ""
            ).replace(
                /src="{{organization.logo.img}}"/g,
                ""
            );
        }

        if (!brandingConfigs) {
            return updatedTemplateBody
                .replace(/{{organization.color.background}}/g, this.brandingFallBackValues.background_color)
                .replace(/{{organization.color.primary}}/g, this.brandingFallBackValues.primary_color)
                .replace(/{{organization.theme.background.color}}/g, this.brandingFallBackValues.light_background_color)
                .replace(/{{organization.theme.border.color}}/g, this.brandingFallBackValues.light_border_color)
                .replace(/{{organization.font}}/g, this.brandingFallBackValues.font_style)
                .replace(/{{organization.font.color}}/g, this.brandingFallBackValues.font_color)
                .replace(/{{organization.button.font.color}}/g, this.brandingFallBackValues.button_font_color)
                .replace(/{{organization-name}}/g, organizationName)
                .replace(/{{organization.logo.img}}/g, this.brandingFallBackValues.light_logo_url);
        }

        const {
            organizationDetails: {
                copyrightText,
                supportEmail,
                displayName
            },
            theme
        } = BrandingPreferenceUtils.migrateThemePreference(brandingConfigs, {
            theme: predefinedThemes
        });

        const currentTheme: ThemeConfigInterface = theme[theme.activeTheme];
        const defaultOrgLogo: string = (theme.activeTheme === PredefinedThemes.DARK
            ? this.brandingFallBackValues.dark_logo_url : this.brandingFallBackValues.light_logo_url);

        updatedTemplateBody = updatedTemplateBody
            .replace(/{{organization.color.background}}/g, currentTheme.colors.background.body.main)
            .replace(/{{organization.color.primary}}/g, currentTheme.colors.primary.main)
            .replace(
                /{{organization.theme.background.color}}/g,
                currentTheme.colors.background.surface.main
                    ? currentTheme.colors.background.surface.main
                    : theme.activeTheme === PredefinedThemes.DARK
                        ? "#111111"
                        : "#FFFFFF"
            )
            .replace(
                /{{organization.theme.border.color}}/g,
                currentTheme.colors.outlined.default
                    ? currentTheme.colors.outlined.default
                    : theme.activeTheme === PredefinedThemes.DARK
                        ? "#333333"
                        : "transparent"
            )
            .replace(/{{organization.font}}/g, currentTheme.typography.font.fontFamily)
            .replace(/{{organization.font.color}}/g, currentTheme.colors.text.primary)
            .replace(/{{organization.button.font.color}}/g, currentTheme.buttons.primary.base.font.color)
            .replace(/{{organization-name}}/g, displayName ? displayName : organizationName)
            .replace(/{{organization.logo.img}}/g, currentTheme.images.logo.imgURL || defaultOrgLogo)
            .replace(/{{organization.logo.altText}}/g, currentTheme.images.logo.altText)
            .replace(/{{organization.copyright.text}}/g,
                (
                    customText && processCustomTextTemplateLiterals(customText["copyright"])
                ) ?? copyrightText
            )
            .replace(/{{organization.support.mail}}/g, supportEmail);

        return updatedTemplateBody;
    }
}
