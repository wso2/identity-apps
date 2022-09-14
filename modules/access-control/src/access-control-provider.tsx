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

import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { AccessProvider } from "react-access-control";
import { AccessControlContext } from "./access-control-context-provider";

/**
 * Interface to store Access Control Provider props
 */
export interface AccessControlProviderInterface {
    featureConfig: any; // TODO : Properly map FeatureConfigInterface type
    allowedScopes: string;
}

/**
 * This will wrap all children passed to it with access control provider
 * with context generated using the scopes recieved.
 * 
 * @param props - component props
 * @returns 
 */
export const AccessControlProvider: FunctionComponent<PropsWithChildren<AccessControlProviderInterface>> = (
    props: PropsWithChildren<AccessControlProviderInterface>
): ReactElement => {

    const {
        allowedScopes,
        children,
        featureConfig
    } = props;

    return (
        <AccessProvider>
            <AccessControlContext allowedScopes={ allowedScopes } featureConfig={ featureConfig }>
                { children }
            </AccessControlContext>
        </AccessProvider>
    );

};
