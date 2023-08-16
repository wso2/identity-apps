/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
