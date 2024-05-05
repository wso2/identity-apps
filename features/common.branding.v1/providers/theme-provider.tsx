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


import { ThemeProvider as OxygenThemeProvider } from "@oxygen-ui/react/theme";
import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import { Helmet } from "react-helmet";
import { generateTheme } from "../branding/theme";
import { BrandingPreferenceContext, BrandingPreferenceContextProps } from "../contexts/branding-preference-context";
import { BrandingPreferenceMeta } from "../meta";
import { BrandingPreferenceAPIResponseInterface } from "../models";

/**
 * Props interface for the ThemeProvider.
 */export interface ThemeProviderProps {
    // The user's theme preference obtained from the BrandingPreferenceAPI.
    themePreference: BrandingPreferenceAPIResponseInterface;

    // The default theme mode, either "light" or "dark".
    defaultMode: "light" | "dark";

    // The key used for storing the theme mode preference in local storage.
    modeStorageKey: string;

    // The title of the application.
    appTitle?: string;
}


/**
 * Branding preference provider.
 *
 * @param props - Props for the client.
 * @returns Branding preference provider.
 */
export const ThemeProvider = (props: PropsWithChildren<ThemeProviderProps>): ReactElement => {
    const { children,
        appTitle,
        themePreference: brandingPreference,
        defaultMode,
        modeStorageKey

    } = props;

    const contextValues: BrandingPreferenceContextProps = useMemo(() => {
        if (!brandingPreference?.preference?.configs?.isBrandingEnabled) {
            return { brandingPreference: undefined };
        }

        return { brandingPreference };
    }, [ brandingPreference ]);

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
                { injectBrandingCSSSkeleton() }
            </Helmet>
            <OxygenThemeProvider
                theme={ generateTheme(contextValues) }
                defaultMode={ defaultMode }
                modeStorageKey={ modeStorageKey }
            >
                { children }
            </OxygenThemeProvider>
        </BrandingPreferenceContext.Provider>
    );
};
