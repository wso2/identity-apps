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

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import Mustache from "mustache";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "@wso2is/admin.core.v1/store";
import { BrandingPreferenceInterface, PredefinedThemes } from "@wso2is/common.branding.v1/models";
import { CustomTextPreferenceConstants } from "../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../hooks/use-branding-preference";
import { BrandingPreferenceMeta } from "../../meta/branding-preference-meta";

/**
 * Prop-types for the login box component of login screen skeleton.
 */
interface EmailTemplateScreenSkeletonInterface extends IdentifiableComponentInterface {
    content: string;
    /**
     * Branding preferences object.
     */
    brandingPreference: BrandingPreferenceInterface;
}

/**
 * My Account skeleton.
 *
 * @param props - Props injected to the component.
 * @returns My Account skeleton as a react component.
 */
export const EmailTemplateScreenSkeleton: FunctionComponent<EmailTemplateScreenSkeletonInterface> = (
    props: EmailTemplateScreenSkeletonInterface
): ReactElement => {
    const {
        brandingPreference,
        content,
        [ "data-componentid" ]: componentId
    } = props;

    const { i18n }= useBrandingPreference();

    const tenantDomain: string = useSelector((state: AppState) => state.auth.tenantDomain);
    const systemTheme: string = useSelector((state: AppState) => state.config?.ui?.theme?.name);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile?.profileInfo);
    const supportEmail: string = useSelector((state: AppState) => {
        return state.config.deployment.extensions?.supportEmail as string;
    });

    const userDisplayName: string = useMemo(() => resolveUserDisplayName(profileInfo, null, "John"), [ profileInfo ]);

    return (
        <div
            className="email-template-screen-skeleton"
            data-testid={ componentId }
            style={ {
                backgroundColor: brandingPreference.theme[
                    brandingPreference.theme.activeTheme].colors?.background?.body?.main
                    || brandingPreference.theme[brandingPreference.theme.activeTheme].page.background.backgroundColor,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                pointerEvents: "none"
            } }
        >
            { parse(
                Mustache.render(content, {
                    organization: {
                        button: {
                            font: {
                                color: brandingPreference.theme[
                                    brandingPreference.theme.activeTheme
                                ].buttons.primary.base.font.color
                            }
                        },
                        color: {
                            background: brandingPreference.theme[
                                brandingPreference.theme.activeTheme].colors?.background?.body?.main
                                || brandingPreference.theme[
                                    brandingPreference.theme.activeTheme].page.background.backgroundColor,
                            primary: brandingPreference.theme[
                                brandingPreference.theme.activeTheme].colors?.primary?.main
                                || brandingPreference.theme[brandingPreference.theme.activeTheme].colors.primary
                        },
                        copyright: {
                            text: i18n(
                                CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.COPYRIGHT, ""
                            ) ?? brandingPreference.organizationDetails.copyrightText
                        },
                        font: {
                            color: brandingPreference.theme[brandingPreference.theme.activeTheme].colors?.text?.primary
                                || brandingPreference.theme[brandingPreference.theme.activeTheme].page.font.color,
                            fontFamily: brandingPreference.theme[
                                brandingPreference.theme.activeTheme].typography.font.fontFamily

                        },
                        logo: {
                            altText: brandingPreference.theme[brandingPreference.theme.activeTheme].images.logo.altText,
                            img: brandingPreference.theme[brandingPreference.theme.activeTheme].images.logo.imgURL ??
                            BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(systemTheme).theme[
                                brandingPreference.theme.activeTheme
                            ].images.logo.imgURL
                        },
                        support: {
                            mail: brandingPreference.organizationDetails.supportEmail || supportEmail
                        },
                        theme: {
                            background: {
                                color: brandingPreference.theme[
                                    brandingPreference.theme.activeTheme].colors?.background?.surface?.main
                                    || (
                                        brandingPreference.theme.activeTheme === PredefinedThemes.DARK
                                            ? "#111111"
                                            : "#FFFFFF"
                                    )
                            },
                            border: {
                                color: brandingPreference.theme[
                                    brandingPreference.theme.activeTheme].colors?.outlined?.default
                                    || (
                                        brandingPreference.theme.activeTheme === PredefinedThemes.DARK
                                            ? "#333333"
                                            : "transparent"
                                    )
                            }
                        }
                    },
                    "organization-name": brandingPreference.organizationDetails.displayName
                        ? brandingPreference.organizationDetails.displayName : tenantDomain,
                    "user-name": userDisplayName
                })
            ) }
        </div>
    );
};

/**
 * Default props for the component.
 */
EmailTemplateScreenSkeleton.defaultProps = {
    "data-componentid": "email-template-screen-skeleton"
};
