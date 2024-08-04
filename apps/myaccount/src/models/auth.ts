/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
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

import { BasicProfileInterface, ProfileSchema } from "./profile";

export interface AuthStateInterface {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    children?: any;
    displayName: string;
    emails: string;
    isAuth: boolean;
    initialized: boolean;
    location: string;
    loginInit: boolean;
    logoutInit: boolean;
    profileSchemas: ProfileSchema[];
    profileInfo: BasicProfileInterface;
    tenantDomain?: string;
    username: string;
    scope: string;
    hasLocalAccount: boolean;
}
