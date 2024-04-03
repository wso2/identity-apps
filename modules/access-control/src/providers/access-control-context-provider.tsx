/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect } from "react";
import { useAccess } from "react-access-control";
import { PermissionsInterface } from "../models";

/**
 * Interface to store Access Control Context props
 */
export interface AccessControlContextInterface {
    allowedScopes: string;
    permissions: PermissionsInterface
}

/**
 * Component which will initialize the permission context
 * according to the scopes received from the backend.
 *
 * @param props - component props
 * @returns
 */
const AccessControlContext: FunctionComponent<PropsWithChildren<AccessControlContextInterface>> = (
    props: PropsWithChildren<AccessControlContextInterface>
): ReactElement => {

    const { isLoaded, define } = useAccess();

    const {
        allowedScopes,
        children,
        permissions
    } = props;

    useEffect(() => {

        if (isEmpty(allowedScopes)) {
            return;
        }

        if (isLoaded) {
            return;
        }

        define({
            permissions: permissions
        });
    }, [ allowedScopes ]);

    return (<> { children } </>);
};

export default AccessControlContext;
