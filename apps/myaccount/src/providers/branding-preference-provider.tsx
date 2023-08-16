/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ThemeProvider } from "@oxygen-ui/react/theme";
import { AppState } from "apps/myaccount/src/store";
import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useGetBrandingPreference } from "../api";
import { generateAsgardeoTheme } from "../branding/theme";
import { BrandingPreferenceContext, BrandingPreferenceContextProps } from "../contexts";
import { BrandingPreferenceMeta } from "../meta";


/**
 * Props interface for the BrandingPreferenceProvider.
 */
export interface BrandingPreferenceProviderProps {
    /**
     * Users tenant.
     */
    tenantDomain: string;
}

/**
 * Branding preference provider.
 *
 * @param props - Props for the client.
 * @returns Branding preference provider.
 */
export const BrandingPreferenceProvider = (props: PropsWithChildren<BrandingPreferenceProviderProps>): ReactElement => {
    const { children, tenantDomain } = props;

    const appTitle: string = useSelector((state: AppState) => state?.config?.ui?.appTitle);
    const theme: string = useSelector((state: AppState) => state?.config?.ui?.theme?.name);

    const { data: brandingPreference } = useGetBrandingPreference(tenantDomain);

    const contextValues: BrandingPreferenceContextProps = useMemo(() => {
        if (!brandingPreference?.preference?.configs?.isBrandingEnabled) {
            return { brandingPreference: undefined };
        }

        return { brandingPreference };
    }, [ brandingPreference ]);

    const injectBaseTheme = () => {
        if (!(window?.themeHash && window?.publicPath && theme)) {
            return;
        }

        return (
            <link
                href={
                    `${window?.origin}${window?.publicPath}/libs/themes/${theme}/theme.${window?.themeHash}.min.css`
                }
                rel="stylesheet"
                type="text/css"
            />
        );
    };

    const _theme: string = useMemo(
        () => BrandingPreferenceMeta.getThemeSkeleton(brandingPreference?.preference?.theme),
        [ brandingPreference?.preference?.theme ]
    );

    const injectBrandingCSSSkeleton = () => {
        if (!brandingPreference?.preference?.theme || !brandingPreference?.preference?.configs?.isBrandingEnabled) {
            return;
        }

        return <style type="text/css">{ _theme }</style>;
    };

    return (
        <BrandingPreferenceContext.Provider value={ contextValues }>
            <Helmet>
                { <title>{ appTitle }</title> }
                { injectBaseTheme() }
                { injectBrandingCSSSkeleton() }
            </Helmet>
            <ThemeProvider theme={ generateAsgardeoTheme(contextValues) }>
                { children }
            </ThemeProvider>
        </BrandingPreferenceContext.Provider>
    );
};
