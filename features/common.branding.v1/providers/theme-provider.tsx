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
import { generateAsgardeoTheme } from "../branding/theme";
import { BrandingPreferenceContext, BrandingPreferenceContextProps } from "../contexts/branding-preference-context";
import { BrandingPreferenceMeta } from "../meta";
import { BrandingPreferenceAPIResponseInterface } from "../models";

/**
 * Props interface for the BrandingPreferenceProvider.
 */
export interface BrandingPreferenceProviderProps {

    themePreference: BrandingPreferenceAPIResponseInterface;
}

/**
 * Branding preference provider.
 *
 * @param props - Props for the client.
 * @returns Branding preference provider.
 */
export const ThemeProvider = (props: PropsWithChildren<BrandingPreferenceProviderProps>): ReactElement => {
    const { children, themePreference: brandingPreference } = props;

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
                { favicon && <link rel="shortcut icon" href={ favicon } /> }
                { injectBrandingCSSSkeleton() }
            </Helmet>
            <OxygenThemeProvider
                theme={ generateAsgardeoTheme(contextValues) }
                defaultMode="light"
                modeStorageKey="console-oxygen-mode"
            >
                { children }
            </OxygenThemeProvider>
        </BrandingPreferenceContext.Provider>
    );
};
