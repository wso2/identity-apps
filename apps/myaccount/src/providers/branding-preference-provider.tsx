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

import { ThemeProvider } from "@oxygen-ui/react/theme";
import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useGetBrandingPreference } from "../api";
import { BrandingPreferenceContext, BrandingPreferenceContextProps } from "../contexts";
import { BrandingPreferenceMeta } from "../meta";
import { AppState } from "../store";
import generateTheme from "../theme";

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

    const favicon: string = useMemo(() => {
        return brandingPreference?.preference?.theme[
            brandingPreference?.preference?.theme?.activeTheme
        ].images?.favicon?.imgURL;
    }, [ brandingPreference?.preference?.theme ]);

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
                { favicon && <link rel="shortcut icon" href={ favicon } /> }
                { injectBaseTheme() }
                { injectBrandingCSSSkeleton() }
            </Helmet>
            <ThemeProvider
                theme={ generateTheme(contextValues) }
                defaultMode="light"
                modeStorageKey="myaccount-oxygen-mode"
            >
                { children }
            </ThemeProvider>
        </BrandingPreferenceContext.Provider>
    );
};
