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

import { AuthProvider } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement } from "react";
import { Authentication } from "./authentication";
import { AuthenticateUtils } from "./features/authentication";
import { PreLoader } from "./features/core";
export const App: FunctionComponent<Record<string, never>> = (): ReactElement => {
    return (
        <AuthProvider config={ AuthenticateUtils.initializeConfig } fallback={ <PreLoader /> }>
            <Authentication />
        </AuthProvider>
    );
};
