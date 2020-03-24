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

import React, { createContext, Dispatch, useReducer } from "react"; 
import { Theme } from "@wso2is/theme";

/*
 * Themes index less file.
 */
const ThemeLess = (theme) => { return `themes-less/themes/${theme}/index.less` };

/*
 * Theme options type.
 */
type ThemeTypes = "dark" | "default";

/*
 * ThemeContext state interface.
 */
interface ThemeContextState {
    appName: string;
    copyrightText: string;
    css: string;
    logo: string;
    productName: string;
    theme: ThemeTypes;
}

/*
 * Theme compile options interface.
 */
export interface ThemeCompileOptionsInterface {
    "@primaryColor"?: string;
    "@pageBackground"?: string;
}

/*
 * ThemeContext interface.
 */
interface ThemeContextInterface {
    dispatch: ({type}: {type: string}) => void;
    compile: (type: ThemeCompileOptionsInterface) => void;
    setAppName: (type: string) => void;
    setCopyrightText: (type: string) => void;
    setLogo: (type: string) => void;
    setProductName: (type: string) => void;
    setTheme: (type: ThemeTypes) => void;
    state: ThemeContextState;
}

/**
 * Initial theme context state.
 */
const themeInitialState: ThemeContextState = {
    appName: "Identity Server",
    copyrightText: "WSO2 Identity Server © 2020",
    css: "",
    logo: "",
    productName: "",
    theme: "default"
}

/**
 * ThemeContext reducer actions.
 */
const themeContextReducerActions = {
    SET_APP_NAME: "SET_APP_NAME",
    SET_COPYRIGHT_TEXT: "SET_COPYRIGHT_TEXT",
    SET_LOGO_URL: "SET_LOGO_URL",
    SET_PRODUCT_NAME: "SET_PRODUCT_NAME",
    TOGGLE_STYLESHEETS: "TOGGLE",
    UPDATE_CUSTOM_CSS: "UPDATE"
};

/**
 * Set Theme CSS reducer action.
 *
 * @param {string} styles - Compiled CSS string.
 */
const setCSS = (styles: string) => ({
    payload: styles,
    type: themeContextReducerActions.UPDATE_CUSTOM_CSS
});

/**
 * Set Application name reducer action.
 *
 * @param {string} name - Application name.
 */
const setAppName = (name: string) => ({
    payload: name,
    type: themeContextReducerActions.SET_APP_NAME
});

/**
 * Set Application copyright text reducer action.
 *
 * @param {string} text - Application copyright text.
 */
const setCopyrightText = (text: string) => ({
    payload: text,
    type: themeContextReducerActions.SET_COPYRIGHT_TEXT
});

/**
 * Set Product logo reducer action.
 *
 * @param {string} url - Url of logo image
 */
const setLogo = (url: string) => ({
    payload: url,
    type: themeContextReducerActions.SET_LOGO_URL
});

/**
 * Set Product Name reducer action.
 *
 * @param {string} name - Product name.
 */
const setProductName = (name: string) => ({
    payload: name,
    type: themeContextReducerActions.SET_PRODUCT_NAME
});

/**
 * Set Theme name reducer action.
 *
 * @param {ThemeTypes} theme - Theme. E.g. "default", "dark"
 */
const setTheme = (theme: ThemeTypes) => ({
    payload: theme,
    type: themeContextReducerActions.TOGGLE_STYLESHEETS
});

/**
 * ThemeContext reducer.
 *
 * @param {themeInitialState} [ state ] - Initial Theme Context State.
 * @param {any} action - Reducer actions.
 * @returns
 */
const themeContextReducer = (state = themeInitialState, action) => {
    switch (action.type) {
        case themeContextReducerActions.SET_APP_NAME:
            return {
                ...state,
                appName: action.payload
            };
        case themeContextReducerActions.SET_COPYRIGHT_TEXT:
            return {
                ...state,
                copyrightText: action.payload
            };
        case themeContextReducerActions.SET_LOGO_URL:
            return {
                ...state,
                logo: action.payload
            };
        case themeContextReducerActions.SET_PRODUCT_NAME:
            return {
                ...state,
                productName: action.payload
            };
        case themeContextReducerActions.TOGGLE_STYLESHEETS:
            return {
                ...state,
                theme: action.payload
            };
        case themeContextReducerActions.UPDATE_CUSTOM_CSS:
            return {
                ...state,
                css: action.payload
            };
        default:
            return state;
    }
};

/**
 * Theme toggle method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {any} state - ThemeContext state.
 * @param {ThemeCompileOptionsInterface} options - Less copile options.
 */
const handleCompileTheme = (dispatch, state, options: ThemeCompileOptionsInterface) => {
    Theme.compile(ThemeLess(state.theme), { modifyVars: options })
        .then((styles) => {
            dispatch(setCSS(styles));
        });
};

/**
 * Set Application Name method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {string} name - application name.
 */
const handleSetAppName = (dispatch, name: string) => {
    dispatch(setAppName(name));
};

/**
 * Set Copyright Text method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {string} text - Copyright text.
 */
const handleSetCopyrightText = (dispatch, text: string) => {
    dispatch(setCopyrightText(text));
};

/**
 * Set Logo URL method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {string} url - Product logo URL.
 */
const handleSetLogo = (dispatch, url: string) => {
    dispatch(setLogo(url));
};

/**
 * Set Product Name method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {string} name - Product name.
 */
const handleProductName = (dispatch, name: string) => {
    dispatch(setProductName(name));
};

/**
 * Theme toggle method.
 * 
 * @param {any} dispatch - `dispatch` function from ReactContext.
 * @param {ThemeTypes} theme - Theme. E.g. "default", "dark"
 */
const handleThemeToggle = (dispatch, theme: ThemeTypes) => {
    dispatch(setTheme(theme));
};

/**
 * ThemeContext.
 */
export const ThemeContext = createContext<ThemeContextInterface>({
    compile: () => { return; },
    dispatch: (() => 0) as Dispatch<any>,
    setAppName: () => { return; },
    setCopyrightText: () => { return; },
    setLogo: () => { return; },
    setProductName: () => { return; },
    setTheme: () => { return; },
    state: themeInitialState
});

/**
 * ThemeContext Provider.
 *
 * @param {any} { children } - Wrap content/elements.
 * @returns { RecatElement } - ThemeContext Provider.
 */
export const ThemeProvider = ({ children }) => {
    const [ state, dispatch ] = useReducer(themeContextReducer, themeInitialState);

    const compile = (options?: ThemeCompileOptionsInterface) => { handleCompileTheme(dispatch, state, options); };

    const setAppName = (name: string) => { handleSetAppName(dispatch, name); };
    const setCopyrightText = (text: string) => { handleSetCopyrightText(dispatch, text); };
    const setLogo = (url: string) => { handleSetLogo(dispatch, url); };
    const setProductName = (name: string) => { handleProductName(dispatch, name); };
    const setTheme = (theme: ThemeTypes) => { handleThemeToggle(dispatch, theme); };

    /**
     * Render state, dispatch and special case actions.
     */
    return (
        <ThemeContext.Provider value={ {
            compile,
            dispatch,
            setAppName,
            setCopyrightText,
            setLogo,
            setProductName,
            setTheme,
            state
        } }>
            { children }
        </ThemeContext.Provider>
    );
};
