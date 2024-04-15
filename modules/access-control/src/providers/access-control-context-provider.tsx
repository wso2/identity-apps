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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import AccessControlContext from "../context/access-control-context";

/**
 * Interface to store Access Control Context props
 */
export interface AccessControlContextInterface {
    allowedScopes: string;
    isLegacyRuntimeEnabled: boolean;
    organizationType: string;
}

/**
 * Component which will initialize the permission context
 * according to the scopes received from the backend.
 *
 * @param props - component props
 * @returns
 */
const AccessControlContextProvider: FunctionComponent<PropsWithChildren<AccessControlContextInterface>> = (
    props: PropsWithChildren<AccessControlContextInterface>
): ReactElement => {

    const {
        allowedScopes,
        children,
        isLegacyRuntimeEnabled,
        organizationType
    } = props;

    return (
        <AccessControlContext.Provider
            value={ {
                allowedScopes,
                isLegacyRuntimeEnabled,
                organizationType
            } }
        >
            { children }
        </AccessControlContext.Provider>
    );
};

export default AccessControlContextProvider;
