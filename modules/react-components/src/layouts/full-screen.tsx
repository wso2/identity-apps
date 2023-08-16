/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";

/**
 * Proptypes for the Full screen layout.
 */
export type FullScreenLayoutPropsInterface = IdentifiableComponentInterface;

/**
 * Full screen layout.
 * Used to render features which has to be rendered in full screen mode.
 *
 * @param props - Props injected to the component.
 *
 * @returns the full screen layout component
 */
export const FullScreenLayout: FunctionComponent<PropsWithChildren<FullScreenLayoutPropsInterface>> = (
    props: PropsWithChildren<FullScreenLayoutPropsInterface>
): ReactElement => {

    const {
        children
    } = props;

    return (
        <>
            { children }
        </>
    );
};
