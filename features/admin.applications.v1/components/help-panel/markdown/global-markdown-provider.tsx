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

import React, { PropsWithChildren, ReactElement } from "react";
import GlobalMarkdownContext, { GlobalMarkdownContextProps } from "./global-markdown-context";

/**
 * Props interface for the global markdown provider.
 */
export type GlobalMarkdownProviderProps = PropsWithChildren & GlobalMarkdownContextProps;

/**
 * Global markdown provider.
 *
 * @param props - Props for the provider.
 * @returns Global markdown provider.
 */
const GlobalMarkdownProvider = (props: GlobalMarkdownProviderProps): ReactElement => {
    const {
        children,
        ...rest
    } = props;

    return (
        <GlobalMarkdownContext.Provider
            value={ rest }
        >
            { children }
        </GlobalMarkdownContext.Provider>
    );
};

export default GlobalMarkdownProvider;
