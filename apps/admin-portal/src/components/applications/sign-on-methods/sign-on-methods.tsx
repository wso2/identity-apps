/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { FunctionComponent } from "react";
import { AuthenticationFlow } from "./authentication-flow";

/**
 * Proptypes for the sign on methods component.
 */
interface SignOnMethodsPropsInterface {
    appId?: string;
    authenticationSequence: any;
    isLoading?: boolean;
}

/**
 * Configure the different sign on strategies for an application.
 *
 * @param {SignOnMethodsPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const SignOnMethods: FunctionComponent<SignOnMethodsPropsInterface> = (
    props: SignOnMethodsPropsInterface
): JSX.Element => {

    const {
        appId,
        authenticationSequence
    } = props;

    return (
        <div className="sign-on-methods-tab-content">
            <AuthenticationFlow appId={ appId } authenticationSequence={ authenticationSequence } />
        </div>
    );
};
