/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { Themes } from "@wso2is/theme";

/*
 * Theme options type.
 */
const themes = Themes as Themes; // Convert Themes array to string literal
export type ThemeTypes = typeof themes[number];

/*
 * Theme compile options interface.
 */
export interface ThemeCompileOptionsInterface {
    "@primaryColor"?: string;
    "@pageBackground"?: string;
}

/*
 * ThemeContext state interface.
 */
export interface ThemeContextStateInterface {
    appName?: string;
    copyrightText?: string;
    css?: string;
    logo?: string;
    productName?: string;
    styles?: ThemeCompileOptionsInterface;
    theme?: ThemeTypes;
}

/*
 * ThemeContext interface.
 */
export interface ThemeContextInterface {
    dispatch: ({ type }: {type: string}) => void;
    compile: (options: ThemeCompileOptionsInterface) => void;
    setAppName: (name: string) => void;
    setCopyrightText: (text: string) => void;
    setCSS: (css: string) => void;
    setLogo: (url: string) => void;
    setProductName: (name: string) => void;
    setStyles: (styles: ThemeCompileOptionsInterface) => void;
    setTheme: (theme: ThemeTypes) => void;
    state: ThemeContextStateInterface;
}
