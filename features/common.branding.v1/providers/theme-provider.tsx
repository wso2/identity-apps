/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { ThemeProviderContext, ThemeProviderContextProps } from "../contexts/theme-provider-context";
import { ThemePreferenceMeta } from "../meta";
import { BrandingPreferenceAPIResponseInterface } from "../models";

/**
 * Props interface for the ThemeProvider.
 */
export interface ThemeProviderProps {
    /**
     * The user's theme preference obtained from the BrandingPreferenceAPI.
     */
    themePreference: BrandingPreferenceAPIResponseInterface;

    /**
     * The default theme mode, either "light" or "dark".
     */
    defaultMode: "light" | "dark";

    /**
     * The key used for storing the theme mode preference in local storage.
     */
    modeStorageKey: string;

    /**
     * The title of the application.
     *
     * This is an optional property.
     */
    appTitle?: string;
}

/**
 * Theme provider.
 *
 * This component sets up the theme context and applies the necessary theme configurations,
 * including the branding styles and favicon.
 *
 * @param props - Props for the ThemeProvider component.
 * @returns The ThemeProvider component.
 */
export const ThemeProvider = (props: PropsWithChildren<ThemeProviderProps>): ReactElement => {
    const {
        children,
        appTitle,
        themePreference,
        defaultMode,
        modeStorageKey
    } = props;

    /**
     * Memoizes the context values to avoid unnecessary re-renders.
     *
     * @returns The context values based on the theme preferences.
     */
    const contextValues: ThemeProviderContextProps = useMemo(() => {
        if (!themePreference?.preference?.configs?.isBrandingEnabled) {
            return { themePreference: undefined };
        }

        return { themePreference };
    }, [ themePreference ]);

    /**
     * Memoizes the theme skeleton CSS based on the theme preferences.
     *
     * @returns The theme skeleton CSS string.
     */
    const _theme: string = useMemo(
        () => ThemePreferenceMeta.getThemeSkeleton(themePreference?.preference?.theme),
        [ themePreference?.preference?.theme ]
    );

    /**
     * Memoizes the favicon URL based on the active theme.
     *
     * @returns The favicon URL string.
     */
    const favicon: string = useMemo(() => {
        return themePreference?.preference?.theme[
            themePreference?.preference?.theme?.activeTheme
        ].images?.favicon?.imgURL;
    }, [ themePreference?.preference?.theme ]);

    /**
     * Injects the branding CSS skeleton if branding is enabled.
     *
     * @returns A style element containing the branding CSS skeleton.
     */
    const injectBrandingCSSSkeleton = () => {
        if (!themePreference?.preference?.theme || !themePreference?.preference?.configs?.isBrandingEnabled) {
            return;
        }

        return <style type="text/css">{ _theme }</style>;
    };

    return (
        <ThemeProviderContext.Provider value={ contextValues }>
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
        </ThemeProviderContext.Provider>
    );
};
