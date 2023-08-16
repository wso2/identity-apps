/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useContext } from "react";
import { BrandingPreferenceContext, BrandingPreferenceContextProps } from "../contexts";
import { BrandingPreferenceAPIResponseInterface, BrandingPreferenceOrganizationDetailsInterface } from "../models";

/**
 * Interface for the return type of the useBrandingPreference hook.
 */
export type UseBrandingPreferenceInterface = {
    /**
     * Organization's basic details.
     */
    organizationDetails: BrandingPreferenceOrganizationDetailsInterface;
    /**
     * The current theme object from the branding preference.
     */
    theme: any;
    /**
     * The raw branding preference API response.
     */
    raw: BrandingPreferenceAPIResponseInterface;
};

/**
 * Hook that provides access to the branding preference context.
 * @returns An object containing the current branding preference theme and raw API response.
 */
export const useBrandingPreference = (): UseBrandingPreferenceInterface => {
    const { brandingPreference }: BrandingPreferenceContextProps = useContext(BrandingPreferenceContext);

    return {
        organizationDetails: brandingPreference?.preference?.organizationDetails,
        raw: brandingPreference,
        theme: brandingPreference?.preference?.theme[brandingPreference?.preference?.theme?.activeTheme]
    };
};
