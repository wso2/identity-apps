/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
