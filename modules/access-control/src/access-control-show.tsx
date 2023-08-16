/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, {
    Fragment,
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode
} from "react";
import { useAccess } from "react-access-control";

/**
 * Interface for show component.
 */
export interface AccessControlShowInterface {
    /**
     * Permissions needed to render child elements
     */
    when: string | string[];
    /**
     * Permissions which will hide the child elemements
     */
    notWhen?: string |string[];
    /**
     * Fallback elements which will be rendered if permission is not matched.
     */
    fallback?: ReactNode;
    /**
     * Granular level resource permissions.
     */
    resource?: Record<string, any>;
}

/**
 * Show component which will render child elements based on the permissions received.
 *
 * @param props - props required for permissions based rendering.
 * @returns permission matched child elements
 */
export const Show: FunctionComponent<PropsWithChildren<AccessControlShowInterface>> = (
    props: PropsWithChildren<AccessControlShowInterface>
): ReactElement<any, any> | null => {

    const { hasPermission } = useAccess();

    const {
        when,
        notWhen,
        fallback,
        resource,
        children
    } = props;

    const show = hasPermission(when, { resource });
    let hideOn = false;

    if (notWhen && notWhen.length > 0) {
        hideOn = hasPermission(notWhen, { resource });
    }

    if (show) {

        if (hideOn) {
            return null;
        } else {
            return (
                <Fragment>
                    { children }
                </Fragment>
            );
        }

    }

    return <Fragment>{ fallback }</Fragment> || null;
};
