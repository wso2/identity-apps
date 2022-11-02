/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { DocumentationContext } from "./documentation-context";

/**
 * Documentation provider props interface.
 */
interface DocumentationProviderPropsInterface<T> {
    /**
     * Initial reducer state.
     */
    links?: T;
}

/**
 * DocumentationContext Provider.
 *
 * @param props - Wrap content/elements.
 * @returns DocumentationContext Provider.
 */
export const DocumentationProvider = <T extends unknown>(
    props: PropsWithChildren<DocumentationProviderPropsInterface<T>>
): ReactElement => {

    const {
        children,
        links
    } = props;

    /**
     * Render state, dispatch and special case actions.
     */
    return (
        <DocumentationContext.Provider value={ { links } }>
            { children }
        </DocumentationContext.Provider>
    );
};
