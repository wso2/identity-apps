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
 * Prop-types for the Main App layout.
 */
export type AppLayoutPropsInterface = IdentifiableComponentInterface;

/**
 * Main app layout.
 * Used to render all the layouts that's being used inside the app.
 *
 * @param props - Props injected to the component.
 * @returns App layout component.
 */
export const AppLayout: FunctionComponent<PropsWithChildren<AppLayoutPropsInterface>> = (
    props: PropsWithChildren<PropsWithChildren<AppLayoutPropsInterface>>
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
