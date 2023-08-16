/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import parse from "html-react-parser";
import Mustache from "mustache";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../../../../features/core/store";
import { BrandingPreferenceMeta } from "../../meta/branding-preference-meta";
import { BrandingPreferenceInterface } from "../../models";

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

    const systemTheme: string = useSelector((state: AppState) => state.config?.ui?.theme?.name);
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile?.profileInfo);

    const userDisplayName: string = useMemo(() => resolveUserDisplayName(profileInfo, null, "John"), [ profileInfo ]);

    return (
        <div className="my-account-screen-skeleton" data-testid={ componentId } style={ { pointerEvents: "none" } }>
            { parse(
                Mustache.render(content, {
                    avatarInitial: userDisplayName.charAt(0).toLocaleUpperCase(),
                    copyright: brandingPreference.organizationDetails.copyrightText,
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
