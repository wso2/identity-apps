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
import { BrandingPreferenceInterface } from "@wso2is/common.branding.v1/models";
import { CustomTextPreferenceConstants } from "../../constants/custom-text-preference-constants";
import useBrandingPreference from "../../hooks/use-branding-preference";
import { BrandingPreferenceMeta } from "../../meta/branding-preference-meta";

/**
 * Prop-types for the login box component of login screen skeleton.
 */
interface MyAccountScreenSkeletonInterface extends IdentifiableComponentInterface {
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
export const MyAccountScreenSkeleton: FunctionComponent<MyAccountScreenSkeletonInterface> = (
    props: MyAccountScreenSkeletonInterface
): ReactElement => {
    const { brandingPreference, content, ["data-componentid"]: componentId } = props;

    const { i18n }= useBrandingPreference();

    const systemTheme: string = useSelector((state: AppState) => state.config?.ui?.theme?.name);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile?.profileInfo);

    const userDisplayName: string = useMemo(() => resolveUserDisplayName(profileInfo, null, "John"), [ profileInfo ]);

    return (
        <div className="my-account-screen-skeleton" data-testid={ componentId } style={ { pointerEvents: "none" } }>
            { parse(
                Mustache.render(content, {
                    avatarInitial: userDisplayName.charAt(0).toLocaleUpperCase(),
                    copyright: {
                        text: i18n(
                            CustomTextPreferenceConstants.TEXT_BUNDLE_KEYS.COPYRIGHT, ""
                        ) ?? brandingPreference.organizationDetails.copyrightText
                    },
                    logoImage:
                        brandingPreference.theme[brandingPreference.theme.activeTheme].images?.myAccountLogo?.imgURL ??
                        BrandingPreferenceMeta.getBrandingPreferenceInternalFallbacks(systemTheme).theme[
                            brandingPreference.theme.activeTheme
                        ].images?.myAccountLogo?.imgURL,
                    logoTitle:
                        brandingPreference.theme[brandingPreference.theme.activeTheme].images?.myAccountLogo?.title,
                    welcomeMessage: `Welcome, ${userDisplayName}`
                })
            ) }
        </div>
    );
};

/**
 * Default props for the component.
 */
MyAccountScreenSkeleton.defaultProps = {
    "data-componentid": "my-account-screen-skeleton"
};
